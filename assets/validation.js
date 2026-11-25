// @ts-check

/**
 * @typedef {Object} InquiryPayload
 * @property {string} fullName
 * @property {string} email
 * @property {string} [phone]
 * @property {string} mandateType
 * @property {string} assetClass
 * @property {string} [market]
 * @property {string} [valueBand]
 * @property {string} brief
 * @property {boolean} [requestNda]
 * @property {string} [assetReference]
 * @property {string} [companyWebsite]
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid
 * @property {boolean} isSpam
 * @property {Record<string, string>} errors
 * @property {InquiryPayload} sanitized
 */

export const ALLOWED_MANDATE_TYPES = Object.freeze([
    "Off-Market Disposition",
    "Commercial / Multifamily Acquisition",
    "Broker Opinion of Value",
    "Confidential Listing Representation",
    "General Investment Advisory"
]);

export const ALLOWED_ASSET_CLASSES = Object.freeze([
    "Multifamily (2-20+ Units)",
    "Healthcare / Specialized",
    "Commercial / Mixed-Use",
    "Portfolio / Land",
    "Luxury Residential"
]);

export const ALLOWED_VALUE_BANDS = Object.freeze([
    "Under $1M",
    "$1M - $3M",
    "$3M - $10M",
    "$10M+",
    "Undisclosed"
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[0-9+().\-\s]{7,24}$/;

/**
 * Strips control characters (preserving newlines in multiline text) and trims.
 * @param {unknown} value
 * @param {{ multiline?: boolean, maxLength?: number }} [options]
 * @returns {string}
 */
export function sanitizeText(value, options = {}) {
    const { multiline = false, maxLength = 200 } = options;
    const raw = typeof value === "string" ? value : "";
    const cleaned = multiline
        ? raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n/g, "\n")
        : raw.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ");
    return cleaned.trim().slice(0, maxLength);
}

/**
 * Validates and sanitizes a confidential brokerage inquiry payload.
 * @param {unknown} input
 * @returns {ValidationResult}
 */
export function validateInquiryPayload(input) {
    const record = input && typeof input === "object" ? /** @type {Record<string, unknown>} */ (input) : {};

    /** @type {InquiryPayload} */
    const sanitized = {
        fullName: sanitizeText(record.fullName, { maxLength: 100 }),
        email: sanitizeText(record.email, { maxLength: 160 }).toLowerCase(),
        phone: sanitizeText(record.phone, { maxLength: 30 }),
        mandateType: sanitizeText(record.mandateType, { maxLength: 80 }),
        assetClass: sanitizeText(record.assetClass, { maxLength: 80 }),
        market: sanitizeText(record.market, { maxLength: 100 }),
        valueBand: sanitizeText(record.valueBand, { maxLength: 40 }) || "Undisclosed",
        brief: sanitizeText(record.brief, { multiline: true, maxLength: 2000 }),
        requestNda: Boolean(record.requestNda),
        assetReference: sanitizeText(record.assetReference, { maxLength: 140 }),
        companyWebsite: sanitizeText(record.companyWebsite, { maxLength: 120 })
    };

    if (sanitized.companyWebsite.length > 0) {
        return {
            valid: false,
            isSpam: true,
            errors: {},
            sanitized
        };
    }

    /** @type {Record<string, string>} */
    const errors = {};

    if (sanitized.fullName.length < 2) {
        errors.fullName = "Please enter your full name or principal name (at least 2 characters).";
    }

    if (!EMAIL_PATTERN.test(sanitized.email)) {
        errors.email = "Please enter a valid email address for direct broker response.";
    }

    if (sanitized.phone && !PHONE_PATTERN.test(sanitized.phone)) {
        errors.phone = "Enter a valid phone number (digits, spaces, parentheses, or hyphens).";
    }

    if (!ALLOWED_MANDATE_TYPES.includes(sanitized.mandateType)) {
        errors.mandateType = "Please select a valid mandate type.";
    }

    if (!ALLOWED_ASSET_CLASSES.includes(sanitized.assetClass)) {
        errors.assetClass = "Please select an asset class.";
    }

    if (!ALLOWED_VALUE_BANDS.includes(sanitized.valueBand)) {
        errors.valueBand = "Please select an indicative value band.";
    }

    if (sanitized.brief.length < 15) {
        errors.brief = "Please include at least 15 characters describing the asset, mandate, or acquisition criteria.";
    }

    return {
        valid: Object.keys(errors).length === 0,
        isSpam: false,
        errors,
        sanitized
    };
}
