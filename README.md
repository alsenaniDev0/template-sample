# Safhat template starter kit

`index.html`, `builder.html`, `style.css`, `copy.js`, and `builder.js` are the field-schema reference plus a visual `template.json` builder. The two scripts below make the reference practical when you build a new dynamic template.

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
