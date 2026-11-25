// @ts-check

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TRANSACTIONS, HERO_EXECUTIONS } from "../assets/data.js";
import { validateInquiryPayload } from "../assets/validation.js";
import { createAppServer } from "../server.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const JS_FILES = [
    "assets/data.js",
    "assets/validation.js",
    "assets/app.js",
    "server.mjs",
    "scripts/validate.mjs"
];

function checkSyntax() {
    for (const rel of JS_FILES) {
        const full = path.join(ROOT, rel);
        execFileSync(process.execPath, ["--check", full], { stdio: "pipe" });
    }
    process.stdout.write(`PASS syntax check (${JS_FILES.length} modules)\n`);
}

function checkLintAndSecurity() {
    const prodFiles = ["assets/data.js", "assets/validation.js", "assets/app.js", "server.mjs"];
    for (const rel of prodFiles) {
        const content = fs.readFileSync(path.join(ROOT, rel), "utf8");
        assert.ok(!/\bconsole\.(log|debug|info|warn|error)\s*\(/.test(content), `Debug console call found in ${rel}`);
        assert.ok(!/\bdebugger\b/.test(content), `Debugger statement found in ${rel}`);
        assert.ok(!/\beval\s*\(/.test(content), `Unsafe eval found in ${rel}`);
    }

    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    assert.ok(html.includes('http-equiv="Content-Security-Policy"'), "Missing CSP meta tag in index.html");
    assert.ok(!html.includes("unsafe-inline"), "CSP must not contain unsafe-inline");
    assert.ok(!html.includes("unsafe-eval"), "CSP must not contain unsafe-eval");
    assert.ok(!html.includes("onerror="), "Inline event handler found in index.html");
    assert.ok(html.includes("./assets/styles.css"), "Missing styles.css link");
    assert.ok(html.includes("./assets/app.js"), "Missing app.js module script");

    // Verify all local media assets exist on disk
    const localMedia = [
        "./assets/styles.css",
        "./assets/app.js",
        "./assets/data.js",
        "./assets/validation.js",
        "./assets/media/jake-cordelli.webp",
        "./favIcon.png",
        ...HERO_EXECUTIONS.map((e) => e.mediaSrc),
        ...TRANSACTIONS.map((t) => t.mediaSrc).filter((src) => src.startsWith("./"))
    ];

    for (const rel of new Set(localMedia)) {
        const full = path.resolve(ROOT, rel);
        assert.ok(fs.existsSync(full), `Missing local asset referenced by site: ${rel}`);
    }

    // Verify shared validation module behavior
    const badResult = validateInquiryPayload({
        fullName: "J",
        email: "not-an-email",
        phone: "bad!!!phone",
        mandateType: "Invalid",
        assetClass: "Invalid",
        valueBand: "Invalid",
        brief: "Too short"
    });
    assert.equal(badResult.valid, false);
    assert.ok(badResult.errors.fullName);
    assert.ok(badResult.errors.email);
    assert.ok(badResult.errors.phone);
    assert.ok(badResult.errors.brief);

    const spamResult = validateInquiryPayload({
        fullName: "Bot User",
        email: "bot@example.com",
        mandateType: "Off-Market Disposition",
        assetClass: "Multifamily (2-20+ Units)",
        valueBand: "$1M - $3M",
        brief: "This is a spam submission triggering the honeypot.",
        companyWebsite: "https://spam.invalid"
    });
    assert.equal(spamResult.isSpam, true);
    assert.equal(spamResult.valid, false);

    const goodResult = validateInquiryPayload({
        fullName: "Alex Mercer",
        email: "alex@mercerpartners.com",
        phone: "(203) 555-0144",
        mandateType: "Off-Market Disposition",
        assetClass: "Multifamily (2-20+ Units)",
        market: "New Haven County",
        valueBand: "$1M - $3M",
        brief: "Evaluating confidential disposition of a 12-unit stabilized multifamily asset in Greater New Haven.",
        requestNda: true
    });
    assert.equal(goodResult.valid, true);
    assert.equal(goodResult.isSpam, false);

    process.stdout.write(`PASS lint, asset integrity (${new Set(localMedia).size} local files), and validation checks\n`);
}

async function checkServerAndApi() {
    const server = createAppServer();
    await new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(undefined)));
    const addr = server.address();
    assert.ok(addr && typeof addr === "object");
    const baseUrl = `http://127.0.0.1:${addr.port}`;

    try {
        // 1. Index + security headers
        const homeRes = await fetch(`${baseUrl}/`);
        assert.equal(homeRes.status, 200);
        const csp = homeRes.headers.get("content-security-policy") || "";
        assert.ok(csp.includes("frame-ancestors 'none'"), "Missing frame-ancestors in HTTP CSP");
        assert.equal(homeRes.headers.get("x-content-type-options"), "nosniff");
        assert.equal(homeRes.headers.get("x-frame-options"), "DENY");
        assert.equal(homeRes.headers.get("referrer-policy"), "strict-origin-when-cross-origin");

        // 2. Health endpoint
        const healthRes = await fetch(`${baseUrl}/api/health`);
        assert.equal(healthRes.status, 200);
        const healthJson = await healthRes.json();
        assert.equal(healthJson.ok, true);

        // 3. Blocked server/config file protection
        const blockedRes = await fetch(`${baseUrl}/server.mjs`);
        assert.equal(blockedRes.status, 404);

        // 4. Path traversal defense
        const traversalRes = await fetch(`${baseUrl}/..%2F..%2Fetc%2Fpasswd`);
        assert.ok([400, 403, 404].includes(traversalRes.status));

        // 5. Inquiry API rejects wrong Content-Type
        const wrongTypeRes = await fetch(`${baseUrl}/api/inquiry`, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: "hello"
        });
        assert.equal(wrongTypeRes.status, 415);

        // 6. Inquiry API rejects invalid fields
        const invalidRes = await fetch(`${baseUrl}/api/inquiry`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName: "A", email: "bad", brief: "short" })
        });
        assert.equal(invalidRes.status, 400);
        const invalidJson = await invalidRes.json();
        assert.equal(invalidJson.ok, false);
        assert.ok(invalidJson.errors.email);

        // 7. Inquiry API accepts valid confidential inquiry
        const validRes = await fetch(`${baseUrl}/api/inquiry`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullName: "Jordan Ellis",
                email: "jordan@elliscapital.com",
                phone: "203-555-0188",
                mandateType: "Commercial / Multifamily Acquisition",
                assetClass: "Healthcare / Specialized",
                market: "Fairfield County",
                valueBand: "$3M - $10M",
                brief: "Seeking off-market adaptive reuse or healthcare properties in Fairfield and New Haven Counties.",
                requestNda: true
            })
        });
        assert.equal(validRes.status, 200);
        const validJson = await validRes.json();
        assert.equal(validJson.ok, true);
        assert.match(validJson.referenceId, /^CR-\d{4}-[0-9A-F]{6}$/);

        process.stdout.write("PASS HTTP security headers, traversal defense, and /api/inquiry tests\n");
    } finally {
        await new Promise((resolve) => server.close(() => resolve(undefined)));
    }
}

const mode = process.argv[2] || "--all";

if (mode === "--syntax") {
    checkSyntax();
} else if (mode === "--lint") {
    checkLintAndSecurity();
} else {
    checkSyntax();
    checkLintAndSecurity();
    await checkServerAndApi();
}
