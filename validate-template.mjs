#!/usr/bin/env node

/** Validate a Safhat template folder without installing any packages. */
import { readFile, access } from "node:fs/promises";
import path from "node:path";

const directory = process.argv[2];
if (!directory || process.argv.includes("--help")) {
    console.log("Usage: node validate-template.mjs <template-folder>");
    process.exit(directory ? 0 : 1);
}

const root = path.resolve(directory);
const errors = [];
const warnings = [];
const supportedTypes = new Set([
    "text", "textarea", "select", "radio", "color", "colors", "font", "icon", "image",
    "url", "map", "youtube", "date", "time", "list", "repeater", "names"
]);
const reservedVariables = new Set(["this", "number", "index", "key", "first", "last"]);

const error = (message) => errors.push(message);
const warn = (message) => warnings.push(message);

let template;
try {
    template = JSON.parse(await readFile(path.join(root, "template.json"), "utf8"));
} catch (cause) {
    error(`Could not read template.json: ${cause.message}`);
}

if (template) {
    for (const key of ["id", "name", "version", "html", "css", "fields"]) {
        if (template[key] === undefined || template[key] === "") error(`Missing required top-level property: ${key}`);
    }
    if (template.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(template.id)) {
        error("id must be lowercase kebab-case, for example: luxury-wedding-invite");
    }
    if (!Array.isArray(template.fields)) error("fields must be an array");
}

const verifyFields = (fields, label, knownKeys) => {
    if (!Array.isArray(fields)) return;
    const localKeys = new Set();
    fields.forEach((field, index) => {
        const location = `${label}[${index}]`;
        if (!field || typeof field !== "object") return error(`${location} must be an object`);
        if (!field.key) error(`${location} is missing key`);
        if (!field.label) warn(`${location} (${field.key ?? "unknown"}) has no user-facing label`);
        if (!field.type) error(`${location} (${field.key ?? "unknown"}) is missing type`);
        if (field.type && !supportedTypes.has(field.type)) error(`${location} uses unsupported type "${field.type}"`);
        if (field.key && !/^[A-Za-z][A-Za-z0-9_]*$/.test(field.key)) {
            error(`${location} key "${field.key}" must use camelCase letters, numbers, or underscores`);
        }
        if (field.key && localKeys.has(field.key)) error(`${label} has duplicate key "${field.key}"`);
        if (field.key) {
            localKeys.add(field.key);
            knownKeys.add(field.key);
        }
        if (["select", "radio", "icon"].includes(field.type) && (!Array.isArray(field.options) || !field.options.length)) {
            error(`${location} (${field.key}) needs a non-empty options array`);
        }
        if (field.type === "colors" && (!Array.isArray(field.options) || !field.options.length)) {
            error(`${location} (${field.key}) needs color options like [{ "label": "الرئيسي", "value": "primary" }]`);
        }
        if (field.type === "repeater") {
            if (!Array.isArray(field.itemFields) || !field.itemFields.length) error(`${location} (${field.key}) needs itemFields`);
            verifyFields(field.itemFields, `${location}.itemFields`, knownKeys);
        }
        if (field.designControls?.font?.enabled && !field.designControls.font.selector) {
            warn(`${location} (${field.key}) has designControls.font enabled but no selector`);
        }
        if (field.minLength && field.maxLength && field.minLength > field.maxLength) {
            error(`${location} has minLength greater than maxLength`);
        }
    });
};

const knownKeys = new Set();
if (template) verifyFields(template.fields, "fields", knownKeys);

// The platform's map value exposes the readable place name and a companion URL.
// A field named `location` can therefore render {{location}} and {{locationUrl}}.
if (template?.fields) {
    template.fields
        .filter((field) => field.type === "map" && field.key)
        .forEach((field) => knownKeys.add(`${field.key}Url`));
}

let source = "";
if (template?.html) {
    const htmlPath = path.resolve(root, template.html);
    if (!htmlPath.startsWith(`${root}${path.sep}`)) {
        error("html must point to a file inside the template folder");
    } else {
        try { source += await readFile(htmlPath, "utf8"); } catch { error(`HTML file not found: ${template.html}`); }
    }
}
if (template?.css) {
    const cssPath = path.resolve(root, template.css);
    if (!cssPath.startsWith(`${root}${path.sep}`)) {
        error("css must point to a file inside the template folder");
    } else {
        try { source += `\n${await readFile(cssPath, "utf8")}`; } catch { error(`CSS file not found: ${template.css}`); }
    }
}

const usedKeys = new Set();
const variablePattern = /{{\s*(?![#/!])([A-Za-z][A-Za-z0-9_]*)(?:\.[A-Za-z0-9_]+)?\s*}}/g;
for (const match of source.matchAll(variablePattern)) {
    const key = match[1];
    if (reservedVariables.has(key)) continue;
    usedKeys.add(key);
    if (!knownKeys.has(key)) error(`Variable {{${key}}} is used in HTML/CSS but no matching field exists`);
}

const eachPattern = /{{#each\s+([A-Za-z][A-Za-z0-9_]*)\s*}}/g;
for (const match of source.matchAll(eachPattern)) {
    const key = match[1];
    usedKeys.add(key);
    if (!knownKeys.has(key)) error(`Loop {{#each ${key}}} has no matching field`);
}
if (template?.fields) {
    template.fields.forEach((field) => {
        if (!field.key) return;

        if (field.type === "color" && source.includes(`--${toKebab(field.key)}`)) {
            usedKeys.add(field.key);
        }

        if (field.type === "colors" && source.includes(`--${toKebab(field.key)}-`)) {
            usedKeys.add(field.key);
        }
    });

    template.fields.forEach((field) => {
        if (field.key && !usedKeys.has(field.key) && field.type !== "repeater") {
            warn(`Field "${field.key}" is not used in HTML or CSS`);
        }
        const selector = field.designControls?.font?.selector;
        if (field.designControls?.font?.enabled && selector && !source.includes(selector.replace(/^[.#]/, ""))) {
            warn(`Field "${field.key}" has designControls.font.selector "${selector}" but it may not exist in HTML/CSS`);
        }
    });
}

function toKebab(value) {
    return String(value || "")
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

if (template?.features?.feelings?.enabled) {
    for (const marker of ["data-feature=\"feelings\"", "data-feeling-name", "data-feeling-message", "data-send-feeling", "data-feeling-result", "data-feelings-list"]) {
        if (!source.includes(marker)) warn(`Feelings feature is enabled but ${marker} is missing`);
    }
}

if (template?.features?.rsvp?.enabled) {
    for (const marker of ["data-feature=\"rsvp\"", "data-rsvp-name", "data-rsvp-status", "data-rsvp-message"]) {
        if (!source.includes(marker)) warn(`RSVP feature is enabled but ${marker} is missing`);
    }
}

if (source.includes("assets/") && !template?.assetsBaseUrl) {
    warn("Local assets are used. Safhat rewrites them with assetsBaseUrl; add assetsBaseUrl for production templates.");
}

for (const message of errors) console.error(`ERROR: ${message}`);
for (const message of warnings) console.warn(`WARNING: ${message}`);
console.log(`\nChecked ${root}: ${errors.length} error(s), ${warnings.length} warning(s).`);
process.exitCode = errors.length ? 1 : 0;
