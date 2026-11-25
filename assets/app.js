// @ts-check

import {
    ADVISORY_CAPABILITIES,
    EXECUTION_PROTOCOL,
    FIRM_INFO,
    HERO_EXECUTIONS,
    LEADERSHIP_CREDENTIALS,
    REVIEWS,
    TRANSACTIONS
} from "./data.js";
import { validateInquiryPayload } from "./validation.js";

/**
 * Escapes arbitrary strings before HTML interpolation.
 * @param {unknown} value
 * @returns {string}
 */
function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/**
 * Ensures an external link uses an explicit http/https protocol.
 * @param {string | undefined} url
 * @returns {boolean}
 */
function isSafeHttpUrl(url) {
    if (!url) return false;
    try {
        const parsed = new URL(url, window.location.origin);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
        return false;
    }
}

/**
 * Formats currency totals compactly for ledger tabs and readouts.
 * @param {number} amount
 * @param {boolean} [monthly]
 * @returns {string}
 */
function formatCompactCurrency(amount, monthly = false) {
    let out;
    if (amount >= 1_000_000) {
        out = `$${(amount / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
    } else if (amount >= 1_000) {
        out = `$${(amount / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    } else {
        out = `$${Math.round(amount).toLocaleString("en-US")}`;
    }
    return monthly ? `${out}/mo` : out;
}

/**
 * Computes CSS class suffix for a transaction status badge.
 * @param {import('./data.js').ListingStatus} status
 * @returns {string}
 */
function getStatusClass(status) {
    if (status === "FOR SALE") return "status-pill--for-sale";
    if (status === "UNDER CONTRACT") return "status-pill--under-contract";
    if (status === "SOLD") return "status-pill--sold";
    return "status-pill--off-market";
}

/**
 * Renders the dynamic telemetry strip from verified transaction records.
 */
function renderTelemetryMetrics() {
    const activeSales = TRANSACTIONS.filter(
        (tx) => tx.status === "FOR SALE" || tx.status === "UNDER CONTRACT"
    );
    const closedSales = TRANSACTIONS.filter((tx) => tx.status === "SOLD");
    const activeVolume = activeSales.reduce((sum, tx) => sum + tx.numericPrice, 0);
    const closedVolume = closedSales.reduce((sum, tx) => sum + tx.numericPrice, 0);

    const activeEl = document.getElementById("metric-active-volume");
    const activeNoteEl = document.getElementById("metric-active-note");
    const closedEl = document.getElementById("metric-closed-volume");
    const closedNoteEl = document.getElementById("metric-closed-note");

    if (activeEl) activeEl.textContent = formatCompactCurrency(activeVolume);
    if (activeNoteEl) {
        activeNoteEl.textContent = `${activeSales.length} active & under-contract multifamily offerings`;
    }
    if (closedEl) closedEl.textContent = formatCompactCurrency(closedVolume);
    if (closedNoteEl) {
        closedNoteEl.textContent = `Across ${closedSales.length} documented Connecticut sales`;
    }
}

/**
 * Renders and wires the hero tactical execution switcher.
 * @param {(txId: string) => void} openDossierById
 */
function initHeroTacticalDisplay(openDossierById) {
    const codeEl = document.getElementById("tactical-code");
    const classEl = document.getElementById("tactical-classification");
    const imgEl = /** @type {HTMLImageElement | null} */ (document.getElementById("tactical-image"));
    const coordsEl = document.getElementById("tactical-coords");
    const priceEl = document.getElementById("tactical-price");
    const titleEl = document.getElementById("tactical-title");
    const locEl = document.getElementById("tactical-location");
    const specsEl = document.getElementById("tactical-specs");
    const repEl = document.getElementById("tactical-rep");
    const summaryEl = document.getElementById("tactical-summary");
    const inspectBtn = document.getElementById("tactical-inspect");
    const switcher = document.getElementById("tactical-switcher");

    if (!switcher) return;

    let activeIndex = 0;

    /** @param {number} index */
    function renderExecution(index) {
        const exec = HERO_EXECUTIONS[index];
        if (!exec) return;
        activeIndex = index;

        if (codeEl) codeEl.textContent = exec.code;
        if (classEl) classEl.textContent = exec.classification;
        if (imgEl) {
            imgEl.src = exec.mediaSrc;
            imgEl.alt = exec.alt;
        }
        if (coordsEl) coordsEl.textContent = exec.coordinates;
        if (priceEl) priceEl.textContent = exec.headlineMetric;
        if (titleEl) titleEl.textContent = exec.title;
        if (locEl) locEl.textContent = exec.location;
        if (specsEl) specsEl.textContent = exec.secondaryMetric;
        if (repEl) repEl.textContent = exec.representation;
        if (summaryEl) summaryEl.textContent = exec.summary;
        if (inspectBtn) {
            inspectBtn.dataset.txId = exec.transactionId || "";
        }

        switcher?.querySelectorAll(".tactical-tab").forEach((btn, idx) => {
            const isActive = idx === activeIndex;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-selected", String(isActive));
        });
    }

    const romanNumerals = ["I", "II", "III"];
    switcher.innerHTML = HERO_EXECUTIONS.map(
        (exec, idx) => `
            <button
                type="button"
                class="tactical-tab${idx === 0 ? " is-active" : ""}"
                role="tab"
                aria-selected="${idx === 0 ? "true" : "false"}"
                data-exec-index="${idx}"
            >
                <span class="tactical-tab-code">Plate ${romanNumerals[idx] || idx + 1} · ${escapeHtml(exec.headlineMetric)}</span>
                <span class="tactical-tab-label">${escapeHtml(exec.title)}</span>
            </button>
        `
    ).join("");

    switcher.addEventListener("click", (event) => {
        const target = /** @type {HTMLElement | null} */ (event.target);
        const button = target?.closest("button[data-exec-index]");
        if (!button) return;
        const idx = Number(button.getAttribute("data-exec-index"));
        if (Number.isInteger(idx)) renderExecution(idx);
    });

    inspectBtn?.addEventListener("click", () => {
        const txId = inspectBtn.dataset.txId;
        if (txId) openDossierById(txId);
    });

    renderExecution(0);
}

/**
 * Renders Advisory Capabilities, Execution Protocol, CT Footprint, and Leadership Credentials.
 */
function renderStaticSections() {
    const capGrid = document.getElementById("capabilities-grid");
    if (capGrid) {
        capGrid.innerHTML = ADVISORY_CAPABILITIES.map(
            (item) => `
                <article class="capability-card">
                    <div class="capability-meta">
                        <span class="capability-code">${escapeHtml(item.code)}</span>
                        <span class="capability-tag">${escapeHtml(item.tag)}</span>
                    </div>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.description)}</p>
                </article>
            `
        ).join("");
    }

    const protocolEl = document.getElementById("protocol-steps");
    if (protocolEl) {
        protocolEl.innerHTML = EXECUTION_PROTOCOL.map(
            (step) => `
                <article class="protocol-step">
                    <div>
                        <div class="protocol-phase">${escapeHtml(step.phase)}</div>
                        <div class="protocol-code">${escapeHtml(step.code)}</div>
                    </div>
                    <div>
                        <h3>${escapeHtml(step.title)}</h3>
                        <p>${escapeHtml(step.detail)}</p>
                    </div>
                </article>
            `
        ).join("");
    }

    const marketGrid = document.getElementById("market-footprint-grid");
    if (marketGrid) {
        /** @type {Map<string, { municipality: string, county: string, count: number }>} */
        const counts = new Map();
        for (const tx of TRANSACTIONS) {
            const existing = counts.get(tx.municipality);
            if (existing) {
                existing.count += 1;
            } else {
                counts.set(tx.municipality, {
                    municipality: tx.municipality,
                    county: tx.county,
                    count: 1
                });
            }
        }
        const sortedMarkets = Array.from(counts.values())
            .sort((a, b) => b.count - a.count || a.municipality.localeCompare(b.municipality))
            .slice(0, 8);

        marketGrid.innerHTML = sortedMarkets
            .map(
                (m) => `
                    <div class="market-chip">
                        <div>
                            <span class="market-chip-name">${escapeHtml(m.municipality)}</span>
                            <span class="market-chip-county">${escapeHtml(m.county)}</span>
                        </div>
                        <span class="market-chip-count">${m.count} ${m.count === 1 ? "Record" : "Records"}</span>
                    </div>
                `
            )
            .join("");
    }

    const credList = document.getElementById("credentials-list");
    if (credList) {
        credList.innerHTML = LEADERSHIP_CREDENTIALS.map(
            (cred) => `
                <div class="credential-row">
                    <div class="credential-index">${escapeHtml(cred.index)}</div>
                    <div class="credential-title">${escapeHtml(cred.title)}</div>
                    <div class="credential-detail">${escapeHtml(cred.detail)}</div>
                </div>
            `
        ).join("");
    }
}

/**
 * Initializes the filterable deal ledger and interactive Asset Dossier dialog.
 * @param {(tx: import('./data.js').TransactionItem) => void} prefillInquiry
 */
function initDealLedger(prefillInquiry) {
    const filterContainer = document.getElementById("deal-filter-tabs");
    const summaryBar = document.getElementById("ledger-summary-bar");
    const grid = document.getElementById("deal-grid");
    const dialog = /** @type {HTMLDialogElement | null} */ (document.getElementById("dossier-dialog"));
    const dialogClose = document.getElementById("dossier-close");
    const dialogContent = document.getElementById("dossier-content");

    if (!filterContainer || !grid) {
        return { openDossierById: () => {} };
    }

    const groups = {
        "investment": {
            label: "Commercial & Investment",
            note: "Commercial healthcare, multi-building compounds, and active multifamily investment offerings.",
            monthly: false,
            items: TRANSACTIONS.filter((tx) => tx.isInvestment).sort((a, b) => b.numericPrice - a.numericPrice)
        },
        "active": {
            label: "Active Pipeline",
            note: "Current Connecticut multifamily properties for sale or under contract.",
            monthly: false,
            items: TRANSACTIONS.filter(
                (tx) => tx.status === "FOR SALE" || tx.status === "UNDER CONTRACT"
            ).sort((a, b) => b.numericPrice - a.numericPrice)
        },
        "closed": {
            label: "Closed Sales",
            note: "Documented commercial, multifamily, and residential closings sorted by sale price.",
            monthly: false,
            items: TRANSACTIONS.filter((tx) => tx.status === "SOLD").sort(
                (a, b) => b.numericPrice - a.numericPrice
            )
        },
        "leasing": {
            label: "Leasing",
            note: "Active and completed landlord representation across Connecticut submarkets.",
            monthly: true,
            items: TRANSACTIONS.filter((tx) => tx.category === "rental")
        }
    };

    /** @type {keyof typeof groups} */
    let activeKey = "investment";

    const fallbackSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 10.5 12 4l9 6.5"></path><path d="M5.5 9.5V20h13V9.5"></path><path d="M10 20v-5.5h4V20"></path></svg>`;

    /** @param {import('./data.js').TransactionItem} tx */
    function openDossier(tx) {
        if (!dialog || !dialogContent) return;

        const overAskingMarkup =
            tx.status === "SOLD" && typeof tx.askingPrice === "number" && tx.numericPrice > tx.askingPrice
                ? `<div class="deal-over-asking">Closed +$${(tx.numericPrice - tx.askingPrice).toLocaleString("en-US")} above asking (+${(((tx.numericPrice - tx.askingPrice) / tx.askingPrice) * 100).toFixed(2)}%)</div>`
                : "";

        const externalBtn = isSafeHttpUrl(tx.listingUrl)
            ? `<a class="btn btn--secondary" href="${escapeHtml(tx.listingUrl)}" target="_blank" rel="noopener noreferrer">View Public Listing Record</a>`
            : "";

        dialogContent.innerHTML = `
            <div class="dossier-media">
                <img src="${escapeHtml(tx.mediaSrc)}" alt="${escapeHtml(tx.alt)}" referrerpolicy="no-referrer">
            </div>
            <div class="dossier-body">
                <div class="dossier-head">
                    <div>
                        <div class="telemetry-eyebrow">${escapeHtml(tx.status)}${tx.isOffMarket ? " · OFF-MARKET" : ""}</div>
                        <h3>${escapeHtml(tx.street)}</h3>
                        <div class="deal-locality">${escapeHtml(tx.locality)}${tx.coordinates ? ` · ${escapeHtml(tx.coordinates)}` : ""}</div>
                    </div>
                    <div class="dossier-price">${escapeHtml(tx.price)}</div>
                </div>
                ${overAskingMarkup}
                <div class="dossier-specs">${escapeHtml(tx.specs.join("  ·  "))}  ·  Represented: ${escapeHtml(tx.represented)}</div>
                <p class="dossier-desc">${escapeHtml(tx.description)}</p>
                <div class="dossier-actions">
                    <button type="button" class="btn btn--primary" id="dossier-inquire-btn">Inquire About Similar Mandate</button>
                    ${externalBtn}
                </div>
            </div>
        `;

        const img = dialogContent.querySelector("img");
        img?.addEventListener("error", () => {
            img.remove();
        });

        const inquireBtn = document.getElementById("dossier-inquire-btn");
        inquireBtn?.addEventListener("click", () => {
            dialog.close();
            prefillInquiry(tx);
        });

        dialog.showModal();
    }

    /** @param {string} txId */
    function openDossierById(txId) {
        const found = TRANSACTIONS.find((tx) => tx.id === txId);
        if (found) openDossier(found);
    }

    function renderFilterTabs() {
        filterContainer.innerHTML = Object.entries(groups)
            .map(([key, group]) => {
                const total = group.items.reduce((sum, tx) => sum + tx.numericPrice, 0);
                const isActive = key === activeKey;
                return `
                    <button
                        type="button"
                        class="filter-tab${isActive ? " is-active" : ""}"
                        role="tab"
                        aria-selected="${isActive ? "true" : "false"}"
                        data-group="${escapeHtml(key)}"
                    >
                        <span>${escapeHtml(group.label)} (${group.items.length})</span>
                        <span class="filter-tab-vol">${escapeHtml(formatCompactCurrency(total, group.monthly))}</span>
                    </button>
                `;
            })
            .join("");
    }

    function renderCards() {
        const group = groups[activeKey];
        const total = group.items.reduce((sum, tx) => sum + tx.numericPrice, 0);

        if (summaryBar) {
            summaryBar.innerHTML = `
                <span><strong>${escapeHtml(group.label)}</strong> — ${escapeHtml(group.note)}</span>
                <span>Aggregate Volume · <strong>${escapeHtml(formatCompactCurrency(total, group.monthly))}</strong> (${group.items.length} ${group.items.length === 1 ? "Asset" : "Assets"})</span>
            `;
        }

        grid.innerHTML = group.items
            .map((tx, idx) => {
                const statusClass = getStatusClass(tx.status);
                const overAsking =
                    tx.status === "SOLD" && typeof tx.askingPrice === "number" && tx.numericPrice > tx.askingPrice
                        ? `<div class="deal-over-asking">+$${(tx.numericPrice - tx.askingPrice).toLocaleString("en-US")} above asking (+${(((tx.numericPrice - tx.askingPrice) / tx.askingPrice) * 100).toFixed(2)}%)</div>`
                        : "";

                const offMarketPill = tx.isOffMarket
                    ? `<span class="status-pill status-pill--off-market">Off-Market</span>`
                    : "";

                return `
                    <article class="deal-card">
                        <div class="deal-media-mat">
                            <div class="deal-media">
                                <div class="deal-media-fallback">
                                    ${fallbackSvg}
                                    <span>${escapeHtml(tx.municipality)}, CT</span>
                                </div>
                                <img
                                    src="${escapeHtml(tx.mediaSrc)}"
                                    alt="${escapeHtml(tx.alt)}"
                                    loading="${idx < 3 ? "eager" : "lazy"}"
                                    decoding="async"
                                    referrerpolicy="no-referrer"
                                >
                                <div class="deal-media-keyline" aria-hidden="true"></div>
                                <div class="deal-badges">
                                    <span class="status-pill ${statusClass}">${escapeHtml(tx.status)}</span>
                                    ${offMarketPill}
                                </div>
                            </div>
                        </div>
                        <div class="deal-body">
                            <div class="deal-top">
                                <div>
                                    <h3 class="deal-street">${escapeHtml(tx.street)}</h3>
                                    <div class="deal-locality">${escapeHtml(tx.locality)}</div>
                                </div>
                                <div class="deal-price">${escapeHtml(tx.price)}</div>
                            </div>
                            ${overAsking}
                            <div class="deal-specs">${escapeHtml(tx.specs.join("  ·  "))}</div>
                            <p class="deal-description">${escapeHtml(tx.description)}</p>
                            <div class="deal-actions">
                                <span class="deal-rep">Represented · ${escapeHtml(tx.represented)}</span>
                                <button type="button" class="deal-action-btn" data-dossier-id="${escapeHtml(tx.id)}">
                                    Memorandum →
                                </button>
                            </div>
                        </div>
                    </article>
                `;
            })
            .join("");

        grid.querySelectorAll(".deal-media img").forEach((img) => {
            img.addEventListener("error", () => {
                img.remove();
            });
        });
    }

    filterContainer.addEventListener("click", (event) => {
        const target = /** @type {HTMLElement | null} */ (event.target);
        const btn = target?.closest("button[data-group]");
        if (!btn) return;
        const nextKey = btn.getAttribute("data-group");
        if (nextKey && Object.prototype.hasOwnProperty.call(groups, nextKey)) {
            activeKey = /** @type {keyof typeof groups} */ (nextKey);
            renderFilterTabs();
            renderCards();
        }
    });

    grid.addEventListener("click", (event) => {
        const target = /** @type {HTMLElement | null} */ (event.target);
        const btn = target?.closest("button[data-dossier-id]");
        if (!btn) return;
        const txId = btn.getAttribute("data-dossier-id");
        if (txId) openDossierById(txId);
    });

    dialogClose?.addEventListener("click", () => dialog?.close());
    dialog?.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });

    renderFilterTabs();
    renderCards();

    return { openDossierById };
}

/**
 * Initializes the verified client reviews carousel with keyboard and touch support.
 */
function initReviewsCarousel() {
    const track = document.getElementById("review-track");
    const dotsWrap = document.getElementById("review-dots");
    const prevBtn = document.getElementById("review-prev");
    const nextBtn = document.getElementById("review-next");
    const shell = document.getElementById("reviews-panel");

    if (!track || !dotsWrap) return;

    track.innerHTML = REVIEWS.map(
        (rev, idx) => `
            <article class="review-slide" role="group" aria-roledescription="slide" aria-label="Review ${idx + 1} of ${REVIEWS.length}" aria-hidden="${idx === 0 ? "false" : "true"}">
                <blockquote class="review-quote">“${escapeHtml(rev.quote)}”</blockquote>
                <div class="review-meta">
                    <div>
                        <span class="review-author">${escapeHtml(rev.author)}</span>
                        <span class="review-role">${escapeHtml(rev.role)}</span>
                    </div>
                    <span class="review-source">${escapeHtml(rev.source)} · 5.0 ★</span>
                </div>
            </article>
        `
    ).join("");

    dotsWrap.innerHTML = REVIEWS.map(
        (_, idx) => `
            <button
                type="button"
                class="review-dot${idx === 0 ? " is-active" : ""}"
                role="tab"
                aria-selected="${idx === 0 ? "true" : "false"}"
                aria-label="Show client review ${idx + 1}"
                data-review-idx="${idx}"
            ></button>
        `
    ).join("");

    const slides = Array.from(track.querySelectorAll(".review-slide"));
    const dots = Array.from(dotsWrap.querySelectorAll(".review-dot"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let activeIdx = 0;
    /** @type {number | null} */
    let timer = null;

    /** @param {number} idx */
    function show(idx) {
        activeIdx = (idx + slides.length) % slides.length;
        track.style.transform = `translateX(-${activeIdx * 100}%)`;
        slides.forEach((slide, i) => slide.setAttribute("aria-hidden", String(i !== activeIdx)));
        dots.forEach((dot, i) => {
            dot.classList.toggle("is-active", i === activeIdx);
            dot.setAttribute("aria-selected", String(i === activeIdx));
        });
    }

    function stopAuto() {
        if (timer !== null) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    function startAuto() {
        stopAuto();
        if (reducedMotion.matches || document.hidden) return;
        timer = window.setInterval(() => show(activeIdx + 1), 7500);
    }

    prevBtn?.addEventListener("click", () => {
        show(activeIdx - 1);
        startAuto();
    });

    nextBtn?.addEventListener("click", () => {
        show(activeIdx + 1);
        startAuto();
    });

    dotsWrap.addEventListener("click", (event) => {
        const target = /** @type {HTMLElement | null} */ (event.target);
        const dot = target?.closest("button[data-review-idx]");
        if (!dot) return;
        show(Number(dot.getAttribute("data-review-idx")));
        startAuto();
    });

    shell?.addEventListener("mouseenter", stopAuto);
    shell?.addEventListener("mouseleave", startAuto);
    shell?.addEventListener("focusin", stopAuto);
    shell?.addEventListener("focusout", startAuto);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopAuto();
        else startAuto();
    });

    show(0);
    startAuto();
}

/**
 * Formats a clean mailto + copyable mandate summary for static-host handoff.
 * @param {import('./validation.js').InquiryPayload} payload
 * @param {string} referenceCode
 */
function buildMandateDispatch(payload, referenceCode) {
    const lines = [
        `CORDELLI REALTY — CONFIDENTIAL MANDATE BRIEF (${referenceCode})`,
        `Principal / Contact: ${payload.fullName}`,
        `Email: ${payload.email}`,
        payload.phone ? `Phone: ${payload.phone}` : null,
        `Mandate Type: ${payload.mandateType}`,
        `Asset Class: ${payload.assetClass}`,
        payload.market ? `Target Submarket: ${payload.market}` : null,
        `Indicative Value Band: ${payload.valueBand}`,
        payload.assetReference ? `Referenced Asset: ${payload.assetReference}` : null,
        `Mutual NDA Requested: ${payload.requestNda ? "Yes" : "No"}`,
        "",
        "Brief:",
        payload.brief
    ].filter((line) => line !== null);

    const bodyText = lines.join("\n");
    const subject = `Confidential Inquiry [${referenceCode}] — ${payload.mandateType}`;
    const mailtoHref = `mailto:${encodeURIComponent(FIRM_INFO.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    return { bodyText, mailtoHref };
}

/**
 * Initializes the confidential inquiry form with shared client/server validation.
 */
function initConfidentialForm() {
    const form = /** @type {HTMLFormElement | null} */ (document.getElementById("confidential-form"));
    const submitBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById("inquiry-submit"));
    const statusBox = document.getElementById("form-status");
    const briefInput = /** @type {HTMLTextAreaElement | null} */ (document.getElementById("field-brief"));
    const charCounter = document.getElementById("brief-counter");
    const assetRefInput = /** @type {HTMLInputElement | null} */ (document.getElementById("field-asset-ref"));

    if (!form || !statusBox) {
        return { prefillInquiry: () => {} };
    }

    const fieldMap = {
        fullName: /** @type {HTMLInputElement | null} */ (document.getElementById("field-fullName")),
        email: /** @type {HTMLInputElement | null} */ (document.getElementById("field-email")),
        phone: /** @type {HTMLInputElement | null} */ (document.getElementById("field-phone")),
        mandateType: /** @type {HTMLSelectElement | null} */ (document.getElementById("field-mandateType")),
        assetClass: /** @type {HTMLSelectElement | null} */ (document.getElementById("field-assetClass")),
        market: /** @type {HTMLInputElement | null} */ (document.getElementById("field-market")),
        valueBand: /** @type {HTMLSelectElement | null} */ (document.getElementById("field-valueBand")),
        brief: briefInput
    };

    function updateCounter() {
        if (!briefInput || !charCounter) return;
        charCounter.textContent = `${briefInput.value.length} / 2000`;
    }

    briefInput?.addEventListener("input", updateCounter);
    updateCounter();

    /** @param {Record<string, string>} errors */
    function renderFieldErrors(errors) {
        Object.entries(fieldMap).forEach(([key, el]) => {
            if (!el) return;
            const errEl = document.getElementById(`error-${key}`);
            const msg = errors[key] || "";
            el.setAttribute("aria-invalid", msg ? "true" : "false");
            if (errEl) errEl.textContent = msg;
        });
    }

    /**
     * @param {'success' | 'error'} kind
     * @param {string} title
     * @param {string} body
     * @param {string} [actionsMarkup]
     */
    function showStatus(kind, title, body, actionsMarkup = "") {
        statusBox.className = `form-status is-visible form-status--${kind}`;
        statusBox.innerHTML = `
            <div class="form-status-title">${escapeHtml(title)}</div>
            <p class="form-status-body">${escapeHtml(body)}</p>
            ${actionsMarkup ? `<div class="form-status-actions">${actionsMarkup}</div>` : ""}
        `;
    }

    /** @param {import('./data.js').TransactionItem} tx */
    function prefillInquiry(tx) {
        if (assetRefInput) {
            assetRefInput.value = `${tx.street}, ${tx.municipality} (${tx.price})`;
        }
        if (fieldMap.market) {
            fieldMap.market.value = `${tx.municipality}, CT`;
        }
        if (fieldMap.assetClass) {
            if (tx.category === "commercial") fieldMap.assetClass.value = "Healthcare / Specialized";
            else if (tx.category === "multifamily") fieldMap.assetClass.value = "Multifamily (2-20+ Units)";
            else fieldMap.assetClass.value = "Luxury Residential";
        }
        if (briefInput && briefInput.value.trim().length === 0) {
            briefInput.value = `Requesting confidential details or comparable opportunities related to ${tx.street}, ${tx.municipality} (${tx.price}).`;
            updateCounter();
        }
        const inquirySection = document.getElementById("inquiry");
        inquirySection?.scrollIntoView({ behavior: "smooth" });
        window.setTimeout(() => fieldMap.fullName?.focus(), 350);
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const rawPayload = {
            fullName: String(formData.get("fullName") ?? ""),
            email: String(formData.get("email") ?? ""),
            phone: String(formData.get("phone") ?? ""),
            mandateType: String(formData.get("mandateType") ?? ""),
            assetClass: String(formData.get("assetClass") ?? ""),
            market: String(formData.get("market") ?? ""),
            valueBand: String(formData.get("valueBand") ?? ""),
            brief: String(formData.get("brief") ?? ""),
            requestNda: formData.get("requestNda") === "on",
            assetReference: String(formData.get("assetReference") ?? ""),
            companyWebsite: String(formData.get("companyWebsite") ?? "")
        };

        const validation = validateInquiryPayload(rawPayload);
        renderFieldErrors(validation.errors);

        if (validation.isSpam) {
            showStatus(
                "success",
                "TRANSMISSION ACKNOWLEDGED",
                "Your inquiry has been processed."
            );
            form.reset();
            updateCounter();
            return;
        }

        if (!validation.valid) {
            const firstInvalidKey = Object.keys(validation.errors)[0];
            if (firstInvalidKey && firstInvalidKey in fieldMap) {
                const key = /** @type {keyof typeof fieldMap} */ (firstInvalidKey);
                fieldMap[key]?.focus();
            }
            showStatus(
                "error",
                "VALIDATION REQUIRED",
                "Please review the highlighted fields before transmitting your confidential inquiry."
            );
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "TRANSMITTING...";
        }

        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 6500);

        try {
            const response = await fetch("/api/inquiry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(validation.sanitized),
                signal: controller.signal
            });

            window.clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                const ref = typeof data?.referenceId === "string" ? data.referenceId : "CR-LOGGED";
                const dispatch = buildMandateDispatch(validation.sanitized, ref);
                showStatus(
                    "success",
                    `Confidential Brief Logged · ${ref}`,
                    `Received directly for broker-owner Jake Cordelli (${FIRM_INFO.email}). Expect a direct response without intermediary handoff.`,
                    `<a class="btn btn--secondary" href="${escapeHtml(dispatch.mailtoHref)}">Send Copy via Email</a>
                     <button type="button" class="btn btn--ghost" id="copy-brief-btn">Copy Structured Brief</button>`
                );
                document.getElementById("copy-brief-btn")?.addEventListener("click", async (e) => {
                    const btn = /** @type {HTMLButtonElement} */ (e.currentTarget);
                    try {
                        await navigator.clipboard.writeText(dispatch.bodyText);
                        btn.textContent = "COPIED TO CLIPBOARD";
                    } catch {
                        btn.textContent = "USE EMAIL BUTTON";
                    }
                });
                form.reset();
                updateCounter();
                return;
            }

            if (response.status === 400) {
                const data = await response.json().catch(() => ({}));
                if (data?.errors && typeof data.errors === "object") {
                    renderFieldErrors(data.errors);
                }
                showStatus(
                    "error",
                    "VALIDATION ERROR",
                    typeof data?.message === "string"
                        ? data.message
                        : "Please verify all required fields and try again."
                );
                return;
            }

            if (response.status === 429) {
                showStatus(
                    "error",
                    "TRANSMISSION RATE LIMIT",
                    `Too many recent submissions from this address. Please call or text Jake directly at ${FIRM_INFO.phoneDisplay}.`
                );
                return;
            }

            // Static hosting (e.g., GitHub Pages returning 404/405 for POST /api/inquiry)
            throw new Error("STATIC_FALLBACK");
        } catch {
            window.clearTimeout(timeoutId);
            const staticRef = `CR-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
            const dispatch = buildMandateDispatch(validation.sanitized, staticRef);
            showStatus(
                "success",
                `Confidential Brief Prepared · ${staticRef}`,
                `Your structured mandate brief passed validation and is ready for direct dispatch to Jake Cordelli at ${FIRM_INFO.email} or ${FIRM_INFO.phoneDisplay}.`,
                `<a class="btn btn--primary" href="${escapeHtml(dispatch.mailtoHref)}">Dispatch via Email Client</a>
                 <button type="button" class="btn btn--secondary" id="copy-brief-btn">Copy Mandate Brief</button>`
            );
            document.getElementById("copy-brief-btn")?.addEventListener("click", async (e) => {
                const btn = /** @type {HTMLButtonElement} */ (e.currentTarget);
                try {
                    await navigator.clipboard.writeText(dispatch.bodyText);
                    btn.textContent = "COPIED TO CLIPBOARD";
                } catch {
                    btn.textContent = "SELECT EMAIL DISPATCH";
                }
            });
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Transmit Confidential Inquiry";
            }
        }
    });

    return { prefillInquiry };
}

/**
 * Initializes mobile navigation drawer.
 */
function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const drawer = document.getElementById("mobile-drawer");
    if (!toggle || !drawer) return;

    function closeDrawer() {
        drawer.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
        const nextState = !drawer.classList.contains("is-open");
        drawer.classList.toggle("is-open", nextState);
        toggle.setAttribute("aria-expanded", String(nextState));
    });

    drawer.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeDrawer);
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeDrawer();
    });
}

function init() {
    const yearEl = document.getElementById("footer-year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    renderTelemetryMetrics();
    renderStaticSections();
    initMobileNav();
    const { prefillInquiry } = initConfidentialForm();
    const { openDossierById } = initDealLedger(prefillInquiry);
    initHeroTacticalDisplay(openDossierById);
    initReviewsCarousel();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
