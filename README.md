# Safhat template starter kit

`index.html`, `builder.html`, `sandbox.html`, `style.css`, `copy.js`, `builder.js`, and `sandbox.js` are the field-schema reference plus tools for building and testing dynamic templates. `TEMPLATE_RENDERING_GUIDE.md` is the source of truth for how the real Safhat renderer works.

## Build or update template.json visually

Open `template-sample/builder.html` in your browser for the dedicated **Visual template.json Builder** page. The docs page links to it, but the builder has its own larger workspace and fixed JSON preview.

You can:

1. Select fields from all supported field types.
2. Expand/collapse selected field accordions to edit labels, keys, defaults, validation limits, tabs, groups, and order. New fields default mostly to `data` for content and `design` for visual controls.
3. Add custom regex validation with `pattern` and `patternMessage`, or use quick presets for URL, numbers-only, Arabic-only, and English-only.
4. Remove individual added fields or clear all fields.
5. Add `visibleWhen` and `requiredWhen` show/hide rules.
6. Toggle platform features like RSVP, messages, countdown, gallery, map, and music. Selected features generate full useful defaults, not only `{ "enabled": true }`.
7. Copy the live JSON preview directly into `template.json`.
8. Paste an existing `template.json`, import it, update it in the UI, then copy the new version.

## Test a full template in the sandbox

Open `template-sample/sandbox.html` when you want to test a complete template.

You can:

1. Select any template project in this workspace to automatically load its `template.json`, HTML, and CSS, or paste files manually.
2. Toggle between `template.json`, HTML, CSS, and mock data tabs in one clean editor area.
3. Autosave all sandbox data to localStorage so refreshes do not wipe your work.
4. Generate or edit mock data from your fields.
5. Validate required values, regex patterns, duplicate keys, HTML bindings, and feature blocks.
6. Render a live iframe preview with mock data in its own right-side preview panel.
7. Use feature helpers like Feelings and RSVP to inject the recommended JSON, HTML, CSS, and small JS snippets.

When template folders are added, removed, renamed, or edited, refresh the sandbox project catalog from the `templates` root:

```bash
node template-sample/refresh-template-projects.mjs
```

The command creates `template-projects.js`, an embedded browser-safe snapshot of the three files for every valid project. This lets the dropdown work even when `sandbox.html` is opened directly without a development server. When the page is served over HTTP, it reads the latest project files on every selection and uses the snapshot only as a fallback.

The sandbox follows the rendering guide: it extracts body content, removes stylesheet links, injects CSS, rewrites `assets/` paths when `assetsBaseUrl` exists, renders `{{variables}}` and `{{#each}}` loops, injects color variables, and previews `__designFont` / `__fieldFonts`.

## Create a template

Run this from the `templates` root folder:

```bash
node scaffold-template.mjs my-new-template --name "بطاقة مناسبة" --direction rtl --type invitation
```

It creates a sibling folder with three linked files:

```text
my-new-template/
├── template.json  # form fields and platform metadata
├── index.html     # presentation, using {{fieldKey}} bindings
└── style.css      # responsive design
```

Use `--output /full/path/to/folder` when the template should be created elsewhere.

## Validate before publishing

```bash
node validate-template.mjs ./my-new-template
```

The validator checks JSON parsing, required metadata, linked HTML/CSS files, duplicate field keys, supported field types, incomplete options/repeaters, and missing HTML/CSS bindings. Warnings do not stop publishing; errors do.

## Recommended authoring rules

1. Give each template a unique lowercase kebab-case ID, such as `modern-graduation-card`.
2. Keep the user form small: expose only the text, media, layout choices, and features people genuinely need to edit.
3. Use a matching key everywhere. A `title` field becomes `{{title}}`; repeater fields use `{{#each items}}`.
4. Add `maxLength`, defaults, and Arabic labels so the platform form stays friendly and layouts remain intact.
5. Use `visibleWhen` and `requiredWhen` to hide optional fields until they are relevant.
6. A `map` field named `location` provides the readable `{{location}}` and a clickable `{{locationUrl}}` value.
7. Use `designControls.font` inside a field when that specific field needs its own font picker, such as names or headings.
8. Test long Arabic and English content and a 360px-wide viewport before publishing.

The browser reference page includes all supported field shapes, condition examples, sections, features, and a complete JSON starter.
