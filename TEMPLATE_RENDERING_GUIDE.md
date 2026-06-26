# Safhat Template Rendering Guide

This guide explains how Safhat renders templates, shows fields in the create page, saves user designs, and handles interactive features like feelings and RSVP.

## 1. Template Files

Each template is built from three main files:

```text
template.json
index.html
style.css
```

In Firestore, a template document can point to these files:

```json
{
  "templateJsonUrl": "https://raw.githubusercontent.com/.../template.json",
  "htmlUrl": "https://raw.githubusercontent.com/.../index.html",
  "cssUrl": "https://raw.githubusercontent.com/.../style.css",
  "assetsBaseUrl": "https://raw.githubusercontent.com/.../main"
}
```

Safhat loads these files, then merges the data from `template.json` into the Firestore template data.

## 2. template.json

`template.json` tells Safhat what inputs to show in the create page.

Example:

```json
{
  "id": "birthday-congratulations-1",
  "name": "تهنئة يوم الميلاد",
  "html": "index.html",
  "css": "style.css",
  "fields": [
    {
      "key": "personName",
      "label": "اسم الشخص",
      "type": "text",
      "defaultValue": "محمد",
      "required": true
    }
  ],
  "features": {
    "feelings": {
      "enabled": true,
      "approvalMode": "manual",
      "preventDuplicate": true,
      "rateLimitMinutes": 5
    }
  }
}
```

Each field needs a unique `key`. This key is used later as a variable in the HTML:

```html
{{personName}}
```

## 3. Create Page Flow

When the user opens the create page:

1. Safhat loads the template document from Firestore.
2. Safhat loads `template.json`, `index.html`, and `style.css`.
3. Safhat reads the `fields` array.
4. Safhat creates a `values` object from field defaults and user input.
5. Safhat renders the preview using `values`.

Example `values` object:

```json
{
  "personName": "محمد",
  "age": "1",
  "message": "نحتفل معكم بأجمل يوم"
}
```

The create form is generated from field types:

```json
{ "type": "text" }
{ "type": "textarea" }
{ "type": "image" }
{ "type": "icon" }
{ "type": "names" }
{ "type": "colors" }
{ "type": "repeater" }
```

## 4. HTML Variables

In `index.html`, use variables like this:

```html
<h1>{{personName}}</h1>
<p>{{message}}</p>
<img src="{{personeImage}}" alt="{{personName}}" />
```

Safhat replaces them with the user data:

```html
<h1>محمد</h1>
<p>نحتفل معكم بأجمل يوم</p>
<img src="uploaded-image-url" alt="محمد" />
```

For array fields like `names`, Safhat joins the values using the field separator.

Example:

```json
{
  "key": "names",
  "type": "names",
  "separator": " و "
}
```

If values are:

```json
["محمد", "سارة"]
```

The rendered result is:

```text
محمد و سارة
```

## 5. CSS Rendering

Safhat removes the original stylesheet link:

```html
<link rel="stylesheet" href="style.css" />
```

Then it injects the CSS directly into the final rendered HTML:

```html
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <style>
      /* template CSS here */
    </style>
  </head>
  <body>
    <!-- rendered template body here -->
  </body>
</html>
```

## 6. Asset Paths

If your template uses local assets:

```html
<img src="assets/images/bg.png" />
```

or:

```css
background-image: url("assets/images/bg.png");
```

Safhat rewrites them using `assetsBaseUrl`.

Example:

```text
assets/images/bg.png
```

becomes:

```text
https://raw.githubusercontent.com/.../main/assets/images/bg.png
```

## 7. Preview Rendering

For preview, Safhat calls:

```ts
renderer.render(template, values)
```

The renderer does this:

1. Extracts the body content from `index.html`.
2. Removes stylesheet links.
3. Rewrites asset paths.
4. Replaces `{{variables}}`.
5. Renders loops like `{{#each items}}`.
6. Applies color variables.
7. Applies font controls.
8. Applies section visibility rules.
9. Returns full HTML.
10. Shows it inside an iframe using `srcdoc`.

## 8. Saving a Design

When the user clicks save, Safhat saves a document in:

```text
userDesigns/{designId}
```

Example saved design:

```json
{
  "templateId": "birthday-congratulations-1",
  "typeId": "congratulations",
  "categoryId": "birthday",
  "title": "تهنئة محمد",
  "values": {
    "personName": "محمد",
    "age": "1",
    "message": "نحتفل معكم بأجمل يوم"
  },
  "features": {
    "feelings": {
      "enabled": true,
      "approvalMode": "manual",
      "preventDuplicate": true,
      "rateLimitMinutes": 5
    }
  },
  "status": "published"
}
```

Important: Safhat does not save the full rendered HTML/CSS inside each design. It saves:

```text
templateId
values
features
settings
```

Then it renders the template again whenever the design is opened.

## 9. Public Design View

When someone opens a public design link:

1. Safhat loads `userDesigns/{designId}`.
2. Safhat reads `templateId`.
3. Safhat loads the template files again.
4. Safhat renders the template with saved `values`.
5. Safhat injects interactive feature scripts if features are enabled.
6. Safhat displays the final HTML inside an iframe.

## 10. Interactive Features

Interactive features do not save directly from the template HTML. The template iframe sends messages to the Angular parent page using:

```js
window.parent.postMessage(...)
```

Angular receives the message, validates it, and saves to Firestore.

### Feelings Feature

To support feelings/messages, declare the feature in `template.json`:

```json
{
  "features": {
    "feelings": {
      "enabled": true,
      "approvalMode": "manual",
      "preventDuplicate": true,
      "rateLimitMinutes": 5,
      "title": "شارك مشاعرك",
      "description": "اكتب رسالة جميلة"
    }
  }
}
```

Your HTML must include these data attributes:

```html
<section data-feature="feelings">
  <input data-feeling-name type="text" placeholder="اسمك" />

  <textarea data-feeling-message placeholder="اكتب رسالتك"></textarea>

  <button type="button" data-send-feeling>
    إرسال الرسالة
  </button>

  <p data-feeling-result></p>

  <div data-feelings-list></div>
</section>
```

Important: the send button must have:

```html
data-send-feeling
```

and should be:

```html
type="button"
```

Do not use only `type="submit"` without `data-send-feeling`, because Safhat listens for clicks on:

```css
[data-send-feeling]
```

Feelings are saved here:

```text
userDesigns/{designId}/feelings/{feelingId}
```

### RSVP Feature

To support RSVP, declare it in `template.json`:

```json
{
  "features": {
    "rsvp": {
      "enabled": true,
      "preventDuplicate": true,
      "nameRequired": false,
      "title": "هل ستحضر؟",
      "description": "يسعدنا معرفة حضورك"
    }
  }
}
```

Your HTML must include:

```html
<section data-feature="rsvp">
  <input data-rsvp-name type="text" placeholder="اسمك" />

  <button type="button" data-rsvp-status="attending">
    سأحضر
  </button>

  <button type="button" data-rsvp-status="not_attending">
    لن أحضر
  </button>

  <button type="button" data-rsvp-status="maybe">
    لم أقرر بعد
  </button>

  <p data-rsvp-message></p>
</section>
```

RSVP responses are saved here:

```text
userDesigns/{designId}/rsvps/{guestId}
```

## 11. Conditional Visibility

You can show/hide fields based on another field.

Example:

```json
{
  "key": "showIcon",
  "label": "إظهار الأيقونة",
  "type": "select",
  "defaultValue": "yes",
  "options": [
    { "label": "نعم", "value": "yes" },
    { "label": "لا", "value": "no" }
  ]
}
```

Then another field can depend on it:

```json
{
  "key": "icon",
  "label": "الأيقونة",
  "type": "icon",
  "visibleWhen": {
    "field": "showIcon",
    "equals": "yes"
  },
  "requiredWhen": {
    "field": "showIcon",
    "equals": "yes"
  }
}
```

You can also use the value in HTML classes:

```html
<main class="show-icon-{{showIcon}}">
```

Then in CSS:

```css
.show-icon-no .icon {
  display: none;
}
```

## 12. Design Controls

Design controls are field-level customization controls that appear in the design tab.

### Font For One Field

Example:

```json
{
  "key": "personName",
  "label": "اسم الشخص",
  "type": "text",
  "designControls": {
    "font": {
      "enabled": true,
      "label": "خط اسم الشخص",
      "selector": ".person-name"
    }
  }
}
```

The selector must match the HTML:

```html
<h1 class="person-name">{{personName}}</h1>
```

Safhat stores field font choices inside:

```json
{
  "__fieldFonts": {
    "personName": {
      "id": "marhey",
      "nameAr": "مرحي",
      "family": "Marhey",
      "cssUrl": "https://fonts.googleapis.com/css2?family=Marhey:wght@300..700&display=swap"
    }
  }
}
```

### General Design Font

Safhat stores the general design font inside:

```json
{
  "__designFont": {
    "id": "tajawal",
    "nameAr": "تجوال",
    "family": "Tajawal",
    "cssUrl": "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap"
  }
}
```

Field fonts override the general design font.

## 13. Colors

Single color field:

```json
{
  "key": "primaryColor",
  "label": "اللون الرئيسي",
  "type": "color",
  "defaultValue": "#7c3aed"
}
```

Multiple colors field:

```json
{
  "key": "themeColors",
  "label": "ألوان التصميم",
  "type": "colors",
  "defaultValue": {
    "primary": "#7c3aed",
    "accent": "#f97316"
  },
  "options": [
    { "label": "الرئيسي", "value": "primary" },
    { "label": "التمييز", "value": "accent" }
  ]
}
```

Safhat injects CSS variables, so your CSS can use:

```css
.card {
  color: var(--primary);
  border-color: var(--theme-colors-accent);
}
```

## 14. Loops And Lists

For repeated data, use `repeater` fields in `template.json`.

Example:

```json
{
  "key": "services",
  "label": "الخدمات",
  "type": "repeater",
  "itemFields": [
    { "key": "title", "label": "العنوان", "type": "text", "required": true },
    { "key": "description", "label": "الوصف", "type": "textarea" }
  ]
}
```

In HTML:

```html
{{#each services}}
  <article>
    <h3>{{title}}</h3>
    <p>{{description}}</p>
  </article>
{{/each}}
```

## 15. Recommended Template Folder Structure

For each template project, use:

```text
template-name/
  template.json
  index.html
  style.css
  assets/
    images/
      bg.png
  preview/
    1.png
    2.png
    3.png
```

Preview images are used on the home page/template cards.

## 16. Template Builder Checklist

When building another project to generate templates, make sure it outputs:

- `template.json`
- `index.html`
- `style.css`
- `assets/`
- `preview/`

And make sure:

- Every editable text/image/color has a field in `template.json`.
- Every field key is used in HTML as `{{key}}`.
- Interactive features use the exact `data-*` attributes.
- Features are declared in `template.json`.
- Design controls include valid selectors.
- Local assets use paths like `assets/images/file.png`.
- Preview images are named in order: `1.png`, `2.png`, `3.png`.

## 17. Common Mistakes

### Feelings button does not work

Wrong:

```html
<button type="submit">إرسال</button>
```

Correct:

```html
<button type="button" data-send-feeling>إرسال</button>
```

### Field font does not change

Wrong selector:

```json
"selector": ".names"
```

But HTML:

```html
<h1 class="hero-names">{{names}}</h1>
```

Correct:

```json
"selector": ".hero-names"
```

### Image does not load

Use:

```html
<img src="assets/images/photo.png" />
```

Make sure Firestore has:

```json
{
  "assetsBaseUrl": "https://raw.githubusercontent.com/.../main"
}
```

### Feature exists in HTML but not active

You must also declare it in `template.json`:

```json
{
  "features": {
    "feelings": {
      "enabled": true
    }
  }
}
```

