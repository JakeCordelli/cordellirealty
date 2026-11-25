// @ts-check

import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateInquiryPayload } from "./assets/validation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = __dirname;

const MAX_BODY_BYTES = 16 * 1024;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_REQUESTS = 10;

/** @type {Record<string, string>} */
const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".txt": "text/plain; charset=utf-8"
};

const CSP_HEADER = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://photos.zillowstatic.com https://m1.cbhomes.com",
    "connect-src 'self'",
    "base-uri 'self'",
    "form-action 'self' mailto:",
    "frame-ancestors 'none'"
].join("; ");

/** @type {Map<string, number[]>} */
const rateBuckets = new Map();

/**
 * Applies standard production security headers to every response.
 * @param {http.ServerResponse} res
 */
function applySecurityHeaders(res) {
    res.setHeader("Content-Security-Policy", CSP_HEADER);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
}

/**
 * Sends a structured JSON response.
 * @param {http.ServerResponse} res
 * @param {number} statusCode
 * @param {Record<string, unknown>} payload
 */
function sendJson(res, statusCode, payload) {
    applySecurityHeaders(res);
    res.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
    });
    res.end(JSON.stringify(payload));
}

/**
 * Checks per-IP sliding window rate limit for API endpoints.
 * @param {string} clientKey
 * @returns {boolean}
 */
function checkRateLimit(clientKey) {
    const now = Date.now();
    const recent = (rateBuckets.get(clientKey) || []).filter((ts) => now - ts < RATE_WINDOW_MS);
    if (recent.length >= RATE_MAX_REQUESTS) {
        rateBuckets.set(clientKey, recent);
        return false;
    }
    recent.push(now);
    rateBuckets.set(clientKey, recent);
    return true;
}

/**
 * Reads a bounded UTF-8 request body.
 * @param {http.IncomingMessage} req
 * @returns {Promise<string>}
 */
function readBoundedBody(req) {
    return new Promise((resolve, reject) => {
        /** @type {Buffer[]} */
        const chunks = [];
        let total = 0;

        req.on("data", (chunk) => {
            const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            total += buf.length;
            if (total > MAX_BODY_BYTES) {
                reject(Object.assign(new Error("Payload too large"), { code: "PAYLOAD_TOO_LARGE" }));
                req.destroy();
                return;
            }
            chunks.push(buf);
        });

        req.on("end", () => {
            resolve(Buffer.concat(chunks).toString("utf8"));
        });

        req.on("error", (err) => {
            reject(err);
        });
    });
}

/**
 * Handles POST /api/inquiry with validation, sanitization, and rate limiting.
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
async function handleInquiryPost(req, res) {
    const contentType = String(req.headers["content-type"] || "").toLowerCase();
    if (!contentType.includes("application/json")) {
        sendJson(res, 415, {
            ok: false,
            message: "Content-Type must be application/json."
        });
        return;
    }

    const clientIp = String(req.socket.remoteAddress || "unknown");
    if (!checkRateLimit(clientIp)) {
        sendJson(res, 429, {
            ok: false,
            message: "Rate limit exceeded. Please try again later or call 203.856.4317."
        });
        return;
    }

    let rawBody = "";
    try {
        rawBody = await readBoundedBody(req);
    } catch (err) {
        const code = err && typeof err === "object" && "code" in err ? err.code : "";
        if (code === "PAYLOAD_TOO_LARGE") {
            sendJson(res, 413, { ok: false, message: "Request body exceeds maximum allowed size." });
            return;
        }
        sendJson(res, 400, { ok: false, message: "Unable to read request body." });
        return;
    }

    /** @type {unknown} */
    let parsed;
    try {
        parsed = JSON.parse(rawBody);
    } catch {
        sendJson(res, 400, { ok: false, message: "Invalid JSON payload." });
        return;
    }

    const validation = validateInquiryPayload(parsed);

    if (validation.isSpam) {
        sendJson(res, 200, {
            ok: true,
            referenceId: `CR-${new Date().getUTCFullYear()}-000000`,
            receivedAt: new Date().toISOString()
        });
        return;
    }

    if (!validation.valid) {
        sendJson(res, 400, {
            ok: false,
            message: "Please correct the highlighted inquiry fields.",
            errors: validation.errors
        });
        return;
    }

    const referenceId = `CR-${new Date().getUTCFullYear()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    sendJson(res, 200, {
        ok: true,
        referenceId,
        receivedAt: new Date().toISOString(),
        recipient: "Jake@CordelliRealty.com"
    });
}

/**
 * Resolves and serves static files safely within ROOT_DIR.
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {string} pathname
 */
async function serveStatic(req, res, pathname) {
    let decodedPath;
    try {
        decodedPath = decodeURIComponent(pathname);
    } catch {
        applySecurityHeaders(res);
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Bad Request");
        return;
    }

    const relativeTarget = decodedPath === "/" ? "index.html" : decodedPath.replace(/^\/+/, "");

    // Block hidden files, server scripts, and config files from static HTTP serving
    const firstSegment = relativeTarget.split("/")[0] || "";
    const blockedFiles = new Set([
        "server.mjs",
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "_headers",
        "about.md"
    ]);
    if (
        firstSegment.startsWith(".") ||
        firstSegment === "scripts" ||
        firstSegment === "node_modules" ||
        blockedFiles.has(relativeTarget)
    ) {
        applySecurityHeaders(res);
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not Found");
        return;
    }

    const resolvedPath = path.resolve(ROOT_DIR, relativeTarget);
    if (!resolvedPath.startsWith(ROOT_DIR + path.sep) && resolvedPath !== path.join(ROOT_DIR, "index.html")) {
        applySecurityHeaders(res);
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
    }

    try {
        const stats = await fsp.stat(resolvedPath);
        if (!stats.isFile()) {
            applySecurityHeaders(res);
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Not Found");
            return;
        }

        const ext = path.extname(resolvedPath).toLowerCase();
        const mime = MIME_TYPES[ext] || "application/octet-stream";
        const cacheControl =
            ext === ".html"
                ? "no-cache"
                : ext === ".webp" || ext === ".png" || ext === ".jpg" || ext === ".jpeg"
                  ? "public, max-age=86400"
                  : "public, max-age=3600";

        applySecurityHeaders(res);
        res.writeHead(200, {
            "Content-Type": mime,
            "Content-Length": stats.size,
            "Cache-Control": cacheControl
        });

        if (req.method === "HEAD") {
            res.end();
            return;
        }

        const stream = fs.createReadStream(resolvedPath);
        stream.on("error", () => {
            if (!res.headersSent) {
                res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            }
            res.end("Internal Server Error");
        });
        stream.pipe(res);
    } catch {
        applySecurityHeaders(res);
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not Found");
    }
}

/**
 * Creates the Cordelli Realty HTTP server instance.
 * @returns {http.Server}
 */
export function createAppServer() {
    return http.createServer(async (req, res) => {
        const method = req.method || "GET";
        const host = req.headers.host || "127.0.0.1";
        let urlObj;
        try {
            urlObj = new URL(req.url || "/", `http://${host}`);
        } catch {
            applySecurityHeaders(res);
            res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Bad Request");
            return;
        }

        if (urlObj.pathname === "/api/health" && (method === "GET" || method === "HEAD")) {
            sendJson(res, 200, {
                ok: true,
                service: "cordellirealty",
                timestamp: new Date().toISOString()
            });
            return;
        }

        if (urlObj.pathname === "/api/inquiry") {
            if (method !== "POST") {
                applySecurityHeaders(res);
                res.writeHead(405, {
                    "Content-Type": "application/json; charset=utf-8",
                    Allow: "POST"
                });
                res.end(JSON.stringify({ ok: false, message: "Method Not Allowed" }));
                return;
            }
            await handleInquiryPost(req, res);
            return;
        }

        if (method !== "GET" && method !== "HEAD") {
            applySecurityHeaders(res);
            res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Method Not Allowed");
            return;
        }

        await serveStatic(req, res, urlObj.pathname);
    });
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    const port = Number(process.env.PORT || 4173);
    const host = process.env.HOST || "127.0.0.1";
    const server = createAppServer();
    server.listen(port, host, () => {
        process.stdout.write(`Cordelli Realty server listening on http://${host}:${port}\n`);
    });
}
