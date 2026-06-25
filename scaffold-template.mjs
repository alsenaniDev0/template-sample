#!/usr/bin/env node

/**
 * Create a small, valid Safhat template in the templates directory.
 * Example: node scaffold-template.mjs graduation-card --name "بطاقة تخرج" --direction rtl
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const readOption = (name) => {
    const index = args.indexOf(name);
    return index === -1 ? undefined : args[index + 1];
};

const optionValueIndexes = new Set(
    ["--name", "--direction", "--language", "--type", "--output"]
        .map((name) => args.indexOf(name) + 1)
        .filter((index) => index > 0)
);
const folder = args.find((arg, index) => !arg.startsWith("-") && !optionValueIndexes.has(index));
const name = readOption("--name") ?? "New Template";
const direction = readOption("--direction") === "rtl" ? "rtl" : "ltr";
const language = readOption("--language") ?? (direction === "rtl" ? "ar" : "en");
const type = readOption("--type") ?? "card";
const output = readOption("--output");

if (!folder || args.includes("--help")) {
    console.log(`Usage: node scaffold-template.mjs <folder-name> [options]

Options:
  --name <name>          Template name shown in the platform
  --direction <rtl|ltr>  Page direction (default: ltr)
  --language <code>      Content language (default: ar for rtl, en for ltr)
  --type <type>          Template category (default: card)
  --output <path>        Exact destination folder (optional)`);
    process.exit(args.includes("--help") ? 0 : 1);
}

const slug = folder
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

if (!slug) {
    console.error("The folder name must contain at least one English letter or number.");
    process.exit(1);
}

const thisDirectory = path.dirname(fileURLToPath(import.meta.url));
const destination = output
    ? path.resolve(output)
    : path.resolve(thisDirectory, "..", slug);

try {
    await access(destination);
    console.error(`Stopped: ${destination} already exists. Choose another folder name or --output path.`);
    process.exit(1);
} catch {
    // A missing destination is exactly what we need.
}

const template = {
    id: slug,
    name,
    version: "1.0.0",
    type,
    language,
    direction,
    html: "index.html",
    css: "style.css",
    fields: [
        {
            key: "eyebrow",
            label: direction === "rtl" ? "النص العلوي" : "Eyebrow text",
            type: "text",
            required: false,
            defaultValue: direction === "rtl" ? "مناسبة خاصة" : "A special occasion",
            maxLength: 40
        },
        {
            key: "title",
            label: direction === "rtl" ? "العنوان" : "Title",
            type: "text",
            required: true,
            defaultValue: direction === "rtl" ? "عنوان القالب" : "Your template title",
            minLength: 2,
            maxLength: 80
        },
        {
            key: "message",
            label: direction === "rtl" ? "النص الرئيسي" : "Main message",
            type: "textarea",
            required: true,
            defaultValue: direction === "rtl" ? "اكتب رسالتك الجميلة هنا." : "Write your lovely message here.",
            minLength: 5,
            maxLength: 240
        },
        {
            key: "eventDate",
            label: direction === "rtl" ? "التاريخ" : "Date",
            type: "date",
            required: false
        },
        {
            key: "buttonLabel",
            label: direction === "rtl" ? "نص الزر" : "Button label",
            type: "text",
            required: false,
            defaultValue: direction === "rtl" ? "اعرف المزيد" : "Learn more",
            maxLength: 40
        },
        {
            key: "buttonUrl",
            label: direction === "rtl" ? "رابط الزر" : "Button URL",
            type: "url",
            required: false,
            defaultValue: "#",
            placeholder: "https://example.com"
        }
    ]
};

const html = `<!DOCTYPE html>
<html lang="${language}" dir="${direction}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="card">
    <p class="eyebrow">{{eyebrow}}</p>
    <h1 data-section="title">{{title}}</h1>
    <p class="message" data-section="message">{{message}}</p>
    <time>{{eventDate}}</time>
    <a class="button" href="{{buttonUrl}}">{{buttonLabel}}</a>
  </main>
</body>
</html>
`;

const css = `:root {
  --ink: #1e293b;
  --muted: #64748b;
  --surface: #ffffff;
  --accent: #6d28d9;
}

* { box-sizing: border-box; }

body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  margin: 0;
  padding: 24px;
  color: var(--ink);
  background: linear-gradient(135deg, #ede9fe, #eff6ff);
  font-family: Arial, sans-serif;
}

.card {
  width: min(100%, 620px);
  padding: clamp(32px, 7vw, 72px);
  text-align: center;
  border: 1px solid rgba(109, 40, 217, .14);
  border-radius: 28px;
  background: var(--surface);
  box-shadow: 0 24px 70px rgba(30, 41, 59, .12);
}

.eyebrow { margin: 0 0 14px; color: var(--accent); font-weight: 700; }
h1 { margin: 0; font-size: clamp(38px, 8vw, 68px); line-height: 1.05; }
.message { margin: 22px auto; color: var(--muted); font-size: 18px; line-height: 1.8; }
time { display: block; margin-bottom: 28px; font-weight: 700; }
.button { display: inline-block; padding: 14px 22px; border-radius: 999px; color: #fff; background: var(--accent); text-decoration: none; font-weight: 700; }
`;

await mkdir(destination, { recursive: true });
await Promise.all([
    writeFile(path.join(destination, "template.json"), `${JSON.stringify(template, null, 2)}\n`),
    writeFile(path.join(destination, "index.html"), html),
    writeFile(path.join(destination, "style.css"), css)
]);

console.log(`Created ${destination}`);
console.log(`Next: node ${path.join(thisDirectory, "validate-template.mjs")} ${destination}`);
