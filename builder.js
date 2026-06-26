const FIELD_BLUEPRINTS = [
    {
        type: "text",
        title: "Text",
        description: "Short titles, names, labels, badges.",
        defaults: {
            key: "title",
            label: "العنوان",
            required: true,
            defaultValue: "عنوان الصفحة",
            placeholder: "اكتب العنوان",
            minLength: 2,
            maxLength: 80,
            trim: true,
            sanitize: true,
            formTab: "data",
            group: "main",
            width: "full"
        }
    },
    {
        type: "textarea",
        title: "Textarea",
        description: "Messages, descriptions, bios.",
        defaults: {
            key: "message",
            label: "النص",
            required: true,
            defaultValue: "اكتب النص هنا",
            placeholder: "اكتب النص",
            rows: 4,
            minLength: 5,
            maxLength: 300,
            trim: true,
            sanitize: true,
            formTab: "data",
            group: "main",
            width: "full"
        }
    },
    {
        type: "select",
        title: "Select",
        description: "One choice from a dropdown.",
        defaults: {
            key: "themeMode",
            label: "نمط التصميم",
            required: true,
            defaultValue: "light",
            options: [
                { label: "فاتح", value: "light" },
                { label: "داكن", value: "dark" },
                { label: "فاخر", value: "premium" }
            ],
            formTab: "design",
            group: "appearance",
            width: "half"
        }
    },
    {
        type: "radio",
        title: "Radio",
        description: "Few visible choices.",
        defaults: {
            key: "templateMode",
            label: "نوع القالب",
            required: true,
            defaultValue: "personal",
            options: [
                { label: "شخصي", value: "personal" },
                { label: "شركة", value: "company" },
                { label: "مناسبة", value: "event" }
            ],
            formTab: "data",
            group: "mode",
            width: "full"
        }
    },
    {
        type: "color",
        title: "Color",
        description: "Theme and section colors.",
        defaults: {
            key: "primaryColor",
            label: "اللون الأساسي",
            required: true,
            defaultValue: "#2563eb",
            formTab: "design",
            group: "colors",
            width: "half"
        }
    },
    {
        type: "font",
        title: "Font",
        description: "User-selectable font family.",
        defaults: {
            key: "fontFamily",
            label: "الخط",
            required: true,
            defaultValue: "Cairo",
            options: [
                { label: "Cairo", value: "Cairo" },
                { label: "Tajawal", value: "Tajawal" },
                { label: "Inter", value: "Inter" }
            ],
            formTab: "design",
            group: "typography",
            width: "half"
        }
    },
    {
        type: "icon",
        title: "Icon",
        description: "Emoji or icon choices.",
        defaults: {
            key: "mainIcon",
            label: "الأيقونة",
            required: false,
            defaultValue: "✨",
            options: [
                { label: "Sparkles", value: "✨" },
                { label: "Heart", value: "🤍" },
                { label: "Star", value: "⭐" }
            ],
            formTab: "design",
            group: "decorations",
            width: "half"
        }
    },
    {
        type: "image",
        title: "Image",
        description: "Hero, gallery, avatar, logo.",
        defaults: {
            key: "heroImage",
            label: "الصورة الرئيسية",
            required: false,
            defaultValue: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            accept: "image/*",
            maxSizeMb: 5,
            formTab: "design",
            group: "images",
            width: "full"
        }
    },
    {
        type: "url",
        title: "URL",
        description: "Links and buttons.",
        defaults: {
            key: "buttonUrl",
            label: "رابط الزر",
            required: false,
            defaultValue: "#",
            placeholder: "https://example.com",
            pattern: "^(#|https?:\\/\\/.+)$",
            formTab: "data",
            group: "actions",
            width: "full"
        }
    },
    {
        type: "map",
        title: "Map",
        description: "Location and generated map URL.",
        defaults: {
            key: "location",
            label: "الموقع",
            required: false,
            defaultValue: "Riyadh, Saudi Arabia",
            placeholder: "اكتب الموقع",
            hint: "Use {{location}} for the name and {{locationUrl}} for the clickable map link.",
            formTab: "data",
            group: "location",
            width: "full"
        }
    },
    {
        type: "youtube",
        title: "YouTube",
        description: "Video URL or embed.",
        defaults: {
            key: "youtubeUrl",
            label: "رابط يوتيوب",
            required: false,
            defaultValue: "",
            placeholder: "https://youtube.com/watch?v=...",
            formTab: "data",
            group: "video",
            width: "full"
        }
    },
    {
        type: "date",
        title: "Date",
        description: "Event dates and deadlines.",
        defaults: {
            key: "eventDate",
            label: "تاريخ المناسبة",
            required: false,
            defaultValue: "2026-12-31",
            formTab: "data",
            group: "date-time",
            width: "half"
        }
    },
    {
        type: "time",
        title: "Time",
        description: "Event time.",
        defaults: {
            key: "eventTime",
            label: "وقت المناسبة",
            required: false,
            defaultValue: "20:00",
            formTab: "data",
            group: "date-time",
            width: "half"
        }
    },
    {
        type: "list",
        title: "List",
        description: "Tags, skills, highlights.",
        defaults: {
            key: "highlights",
            label: "النقاط المهمة",
            required: false,
            defaultValue: ["تصميم جميل", "سهل التعديل", "متجاوب"],
            minItems: 1,
            maxItems: 6,
            formTab: "data",
            group: "lists",
            width: "full"
        }
    },
    {
        type: "names",
        title: "Names",
        description: "People names and invitees.",
        defaults: {
            key: "names",
            label: "أسماء العروسين",
            required: true,
            placeholder: "مثال: محمد",
            minItems: 2,
            maxItems: 2,
            separator: " و ",
            formTab: "data",
            group: "people",
            width: "full",
            designControls: {
                font: {
                    enabled: true,
                    label: "خط أسماء العروسين",
                    selector: ".hero-names"
                }
            }
        }
    },
    {
        type: "repeater",
        title: "Repeater",
        description: "Cards, timeline, services.",
        defaults: {
            key: "items",
            label: "العناصر",
            required: false,
            minItems: 1,
            maxItems: 6,
            itemLabelField: "title",
            addButtonLabel: "إضافة عنصر",
            defaultValue: [
                {
                    title: "عنوان العنصر",
                    description: "وصف قصير"
                }
            ],
            itemFields: [
                {
                    key: "title",
                    label: "العنوان",
                    type: "text",
                    required: true,
                    maxLength: 80
                },
                {
                    key: "description",
                    label: "الوصف",
                    type: "textarea",
                    required: true,
                    maxLength: 220
                }
            ],
            formTab: "data",
            group: "repeaters",
            width: "full"
        }
    }
];

const FEATURE_BLUEPRINTS = [
    {
        key: "feelings",
        label: "Messages",
        description: "Guest messages, feelings, wishes.",
        defaults: {
            enabled: true,
            approvalMode: "manual",
            preventDuplicate: true,
            rateLimitMinutes: 5,
            title: "شارك مشاعرك",
            description: "اكتب رسالة جميلة لأصحاب الدعوة"
        }
    },
    {
        key: "rsvp",
        label: "RSVP",
        description: "Visitor attendance response.",
        defaults: {
            enabled: true,
            preventDuplicate: true,
            title: "هل ستحضر؟",
            description: "يسعدنا معرفة حضورك للمناسبة"
        }
    },
    {
        key: "animations",
        label: "Animations",
        description: "Entrance effects and motion controls.",
        defaults: {
            enabled: true,
            entrance: "fade-up",
            durationMs: 700,
            once: true
        }
    },
    {
        key: "music",
        label: "Music",
        description: "Background audio or sound URL support.",
        defaults: {
            enabled: true,
            autoplay: false,
            loop: true,
            title: "الموسيقى"
        }
    },
    {
        key: "countdown",
        label: "Countdown",
        description: "Timer to date/time.",
        defaults: {
            enabled: true,
            title: "باقي على المناسبة",
            targetField: "eventDate",
            showDays: true,
            showHours: true,
            showMinutes: true
        }
    },
    {
        key: "gallery",
        label: "Gallery",
        description: "Extra image collection.",
        defaults: {
            enabled: true,
            title: "معرض الصور",
            maxItems: 12
        }
    },
    {
        key: "map",
        label: "Map",
        description: "Location/map interaction.",
        defaults: {
            enabled: true,
            title: "الموقع",
            sourceField: "location"
        }
    },
    {
        key: "sharing",
        label: "Sharing",
        description: "Social sharing buttons.",
        defaults: {
            enabled: true,
            title: "شارك الدعوة",
            channels: ["whatsapp", "x", "copyLink"]
        }
    },
    {
        key: "guestNames",
        label: "Guest names",
        description: "Personalized invitee names.",
        defaults: {
            enabled: true,
            title: "المدعوون",
            maxItems: 20
        }
    }
];

const OPTION_TYPES = new Set(["select", "radio", "font", "icon"]);
const ARRAY_DEFAULT_TYPES = new Set(["list", "names"]);
const FORM_TABS = ["data", "design", "features", "settings", "media", "content"];
const PATTERN_PRESETS = [
    {
        key: "url",
        label: "URL http/https",
        pattern: "^https?:\\/\\/.+",
        message: "الرابط يجب أن يبدأ بـ http أو https"
    },
    {
        key: "numbers",
        label: "Numbers only",
        pattern: "^\\d+$",
        message: "هذا الحقل يقبل أرقام فقط"
    },
    {
        key: "arabic",
        label: "Arabic letters",
        pattern: "^[\\u0600-\\u06FF\\s]+$",
        message: "هذا الحقل يقبل حروف عربية فقط"
    },
    {
        key: "english",
        label: "English letters",
        pattern: "^[A-Za-z\\s]+$",
        message: "هذا الحقل يقبل حروف إنجليزية فقط"
    }
];

const state = {
    fields: [],
    customFeatures: {},
    nextFieldId: 1,
    openFieldId: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const metadataInputs = {
    id: $("#builder-id"),
    name: $("#builder-name"),
    version: $("#builder-version"),
    type: $("#builder-type"),
    language: $("#builder-language"),
    direction: $("#builder-direction"),
    html: $("#builder-html"),
    css: $("#builder-css")
};

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function slugify(value, fallback = "field") {
    const cleaned = String(value || "")
        .trim()
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return cleaned || fallback;
}

function camelKey(value, fallback = "field") {
    const slug = slugify(value, fallback);
    return slug.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());
}

function fieldLabel(type) {
    return FIELD_BLUEPRINTS.find((item) => item.type === type)?.title || type;
}

function uniqueKey(baseKey, ownId = null) {
    const base = camelKey(baseKey || "field");
    let key = base;
    let index = 2;

    while (state.fields.some((field) => field._id !== ownId && field.key === key)) {
        key = `${base}${index}`;
        index += 1;
    }

    return key;
}

function normalizeField(field) {
    const type = field.type || "text";
    const normalized = {
        ...clone(field),
        _id: state.nextFieldId++,
        type,
        key: field.key || uniqueKey(type),
        label: field.label || fieldLabel(type)
    };

    return normalized;
}

function addField(type, overrides = {}) {
    const blueprint = FIELD_BLUEPRINTS.find((item) => item.type === type) || FIELD_BLUEPRINTS[0];
    const field = normalizeField({
        type: blueprint.type,
        ...clone(blueprint.defaults),
        ...clone(overrides)
    });

    field.key = uniqueKey(field.key, field._id);
    state.fields.push(field);
    state.openFieldId = field._id;
    renderFields();
    updateOutput();
}

function conditionControlLabel(controlKey, sourceField) {
    if (controlKey.startsWith("show")) {
        return `إظهار ${sourceField.label || sourceField.key || "الحقل"}`;
    }

    return `تفعيل ${sourceField.label || sourceField.key || controlKey}`;
}

function ensureConditionControllerField(sourceFieldId, conditionKey) {
    const key = camelKey(conditionKey || "", "showField");
    if (!key) return null;

    const existing = state.fields.find((field) => field.key === key);
    if (existing) return existing;

    const sourceIndex = state.fields.findIndex((field) => field._id === sourceFieldId);
    const sourceField = state.fields[sourceIndex];
    if (!sourceField) return null;

    const controllerField = normalizeField({
        key,
        label: conditionControlLabel(key, sourceField),
        type: "select",
        formTab: sourceField.formTab || "design",
        group: sourceField.group || "visibility",
        required: true,
        defaultValue: "yes",
        options: [
            {
                label: "نعم",
                value: "yes"
            },
            {
                label: "لا",
                value: "no"
            }
        ],
        width: "half"
    });

    state.fields.splice(Math.max(sourceIndex, 0), 0, controllerField);
    state.openFieldId = sourceField._id;
    return controllerField;
}

function addCommonFields() {
    [
        ["text", { key: "eyebrow", label: "النص الصغير", defaultValue: "دعوة خاصة", maxLength: 40, order: 1 }],
        ["text", { key: "title", label: "العنوان", defaultValue: "عنوان القالب", order: 2 }],
        ["textarea", { key: "message", label: "الرسالة", defaultValue: "اكتب رسالة جميلة هنا", order: 3 }],
        ["date", { key: "eventDate", label: "التاريخ", order: 4 }],
        ["time", { key: "eventTime", label: "الوقت", order: 5 }],
        ["map", { key: "location", label: "الموقع", order: 6 }],
        ["text", { key: "buttonLabel", label: "نص الزر", defaultValue: "افتح الرابط", order: 7 }],
        ["url", { key: "buttonUrl", label: "رابط الزر", defaultValue: "#", order: 8 }]
    ].forEach(([type, overrides]) => addField(type, overrides));
}

function renderFieldPicker() {
    const picker = $("[data-field-picker]");
    if (!picker) return;

    picker.innerHTML = FIELD_BLUEPRINTS.map((blueprint) => `
        <button class="field-picker-card" type="button" data-add-field="${blueprint.type}">
            <strong>${blueprint.title}</strong>
            <span>${blueprint.description}</span>
            <code>${blueprint.type}</code>
        </button>
    `).join("");
}

function renderFeatureToggles() {
    const target = $("[data-feature-toggles]");
    if (!target) return;

    target.innerHTML = FEATURE_BLUEPRINTS.map(({ key, label, description }) => `
        <label class="feature-toggle">
            <input type="checkbox" data-feature-key="${key}">
            <span>
                <strong>${label}</strong>
                <small>${description}</small>
            </span>
        </label>
    `).join("");
}

function valueToInput(value) {
    if (value === undefined || value === null) return "";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
}

function optionsToText(options = []) {
    return options
        .map((option) => `${option.label ?? option.value ?? ""}|${option.value ?? option.label ?? ""}`)
        .join("\n");
}

function parseLooseValue(value, type) {
    const text = String(value ?? "").trim();

    if (!text) {
        return ARRAY_DEFAULT_TYPES.has(type) ? [] : "";
    }

    if (ARRAY_DEFAULT_TYPES.has(type)) {
        if (text.startsWith("[") || text.startsWith("{")) {
            try {
                return JSON.parse(text);
            } catch {
                return text.split(",").map((item) => item.trim()).filter(Boolean);
            }
        }

        return text.split(",").map((item) => item.trim()).filter(Boolean);
    }

    if (text.startsWith("[") || text.startsWith("{")) {
        try {
            return JSON.parse(text);
        } catch {
            return value;
        }
    }

    return value;
}

function parseOptions(text) {
    return String(text || "")
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [label, value] = line.split("|").map((part) => part.trim());
            return {
                label: label || value,
                value: value || label
            };
        });
}

function fieldHasFontDesignControl(field) {
    return Boolean(field.designControls?.font?.enabled);
}

function renderFields() {
    const target = $("[data-selected-fields]");
    if (!target) return;

    if (!state.fields.length) {
        target.innerHTML = `
            <div class="empty-builder-state">
                <strong>No fields yet</strong>
                <p>Add fields from the panel above, or import an existing template.json.</p>
            </div>
        `;
        return;
    }

    target.innerHTML = state.fields.map((field, index) => {
        const hasVisibleWhen = Boolean(field.visibleWhen);
        const hasRequiredWhen = Boolean(field.requiredWhen);
        const hasOptions = OPTION_TYPES.has(field.type);
        const isRepeater = field.type === "repeater";
        const isNames = field.type === "names";
        const isOpen = state.openFieldId === field._id;
        const hasFontDesignControl = fieldHasFontDesignControl(field);
        const hasPatternValidation = Boolean(field.pattern || field.patternMessage);
        const defaultLabel = ARRAY_DEFAULT_TYPES.has(field.type) || isRepeater ? "Default value JSON / comma list" : "Default value";
        const summaryParts = [
            field.key ? `key: ${field.key}` : "",
            field.formTab ? `tab: ${field.formTab}` : "",
            field.group ? `group: ${field.group}` : "",
            field.required ? "required" : "optional",
            hasPatternValidation ? "regex" : "",
            hasFontDesignControl ? "font design" : "",
            hasVisibleWhen || hasRequiredWhen ? "has rules" : ""
        ].filter(Boolean);

        return `
            <article class="field-editor ${isOpen ? "is-open" : ""}" data-field-id="${field._id}">
                <div class="field-editor-head">
                    <button class="field-summary-button" type="button" data-field-action="toggle" aria-expanded="${isOpen}">
                        <span class="accordion-chevron">${isOpen ? "−" : "+"}</span>
                        <span class="field-summary-text">
                            <span class="field-type-pill">${field.type}</span>
                            <strong>${field.label || field.key || field.type}</strong>
                            <small>${summaryParts.join(" · ")}</small>
                        </span>
                    </button>
                    <div class="field-editor-actions">
                        <button type="button" data-field-action="up" ${index === 0 ? "disabled" : ""}>↑</button>
                        <button type="button" data-field-action="down" ${index === state.fields.length - 1 ? "disabled" : ""}>↓</button>
                        <button type="button" data-field-action="duplicate">Duplicate</button>
                        <button type="button" data-field-action="remove" title="Remove this field">Remove field</button>
                    </div>
                </div>

                <div class="field-editor-body" ${isOpen ? "" : "hidden"}>
                <div class="builder-form-grid compact">
                    <label>
                        <span>Key</span>
                        <input data-field-prop="key" value="${escapeAttribute(field.key)}">
                    </label>
                    <label>
                        <span>Label</span>
                        <input data-field-prop="label" value="${escapeAttribute(field.label)}">
                    </label>
                    <label>
                        <span>Type</span>
                        <input value="${escapeAttribute(field.type)}" readonly>
                    </label>
                    <label>
                        <span>Tab</span>
                        <select data-field-prop="formTab">
                            ${field.formTab && !FORM_TABS.includes(field.formTab) ? `<option value="${escapeAttribute(field.formTab)}" selected>${escapeHtml(field.formTab)}</option>` : ""}
                            ${FORM_TABS.map((tab) => `<option value="${tab}" ${field.formTab === tab ? "selected" : ""}>${tab}</option>`).join("")}
                        </select>
                    </label>
                    <label>
                        <span>Group</span>
                        <input data-field-prop="group" value="${escapeAttribute(field.group || "")}" placeholder="main">
                    </label>
                    <label>
                        <span>Width</span>
                        <select data-field-prop="width">
                            ${["full", "half", "third"].map((width) => `<option value="${width}" ${field.width === width ? "selected" : ""}>${width}</option>`).join("")}
                        </select>
                    </label>
                    <label>
                        <span>Order</span>
                        <input data-field-prop="order" type="number" value="${escapeAttribute(field.order ?? index + 1)}">
                    </label>
                    <label>
                        <span>Placeholder</span>
                        <input data-field-prop="placeholder" value="${escapeAttribute(field.placeholder || "")}">
                    </label>
                    <label class="wide">
                        <span>Hint</span>
                        <input data-field-prop="hint" value="${escapeAttribute(field.hint || "")}">
                    </label>
                    <label class="wide">
                        <span>${defaultLabel}</span>
                        <textarea data-field-prop="defaultValue" rows="2">${escapeHtml(valueToInput(field.defaultValue))}</textarea>
                    </label>
                    <label>
                        <span>Min length/items</span>
                        <input data-field-prop="min" type="number" value="${escapeAttribute(field.minLength ?? field.minItems ?? "")}">
                    </label>
                    <label>
                        <span>Max length/items</span>
                        <input data-field-prop="max" type="number" value="${escapeAttribute(field.maxLength ?? field.maxItems ?? "")}">
                    </label>
                    ${isNames ? `
                        <label>
                            <span>Separator</span>
                            <input data-field-prop="separator" value="${escapeAttribute(field.separator || "")}" placeholder=" و ">
                        </label>
                    ` : ""}
                    <label class="check-row">
                        <input data-field-prop="required" type="checkbox" ${field.required ? "checked" : ""}>
                        <span>Required</span>
                    </label>
                    <label class="check-row">
                        <input data-field-prop="sanitize" type="checkbox" ${field.sanitize ? "checked" : ""}>
                        <span>Sanitize</span>
                    </label>
                    <label class="check-row">
                        <input data-field-prop="trim" type="checkbox" ${field.trim ? "checked" : ""}>
                        <span>Trim</span>
                    </label>

                    ${hasOptions ? `
                        <label class="wide">
                            <span>Options, one per line: Label|value</span>
                            <textarea data-field-prop="options" rows="4">${escapeHtml(optionsToText(field.options))}</textarea>
                        </label>
                    ` : ""}

                    ${isRepeater ? `
                        <label>
                            <span>Item label field</span>
                            <input data-field-prop="itemLabelField" value="${escapeAttribute(field.itemLabelField || "")}">
                        </label>
                        <label>
                            <span>Add button label</span>
                            <input data-field-prop="addButtonLabel" value="${escapeAttribute(field.addButtonLabel || "")}">
                        </label>
                        <label class="wide">
                            <span>itemFields JSON</span>
                            <textarea data-field-prop="itemFields" rows="6">${escapeHtml(valueToInput(field.itemFields || []))}</textarea>
                        </label>
                    ` : ""}
                </div>

                <details class="validation-editor" ${hasPatternValidation ? "open" : ""}>
                    <summary>Validation pattern</summary>
                    <div class="validation-grid">
                        <label class="wide">
                            <span>Regex pattern</span>
                            <input data-field-prop="pattern" value="${escapeAttribute(field.pattern || "")}" placeholder="^https?:\\/\\/.+">
                        </label>
                        <label class="wide">
                            <span>Pattern message</span>
                            <input data-field-prop="patternMessage" value="${escapeAttribute(field.patternMessage || "")}" placeholder="الرابط يجب أن يبدأ بـ http أو https">
                        </label>
                        <div class="pattern-presets">
                            <span>Quick presets</span>
                            <div>
                                ${PATTERN_PRESETS.map((preset) => `
                                    <button type="button" data-pattern-preset="${preset.key}">${preset.label}</button>
                                `).join("")}
                                <button class="ghost-button" type="button" data-pattern-clear>Clear pattern</button>
                            </div>
                        </div>
                    </div>
                </details>

                <details class="design-controls-editor" ${hasFontDesignControl ? "open" : ""}>
                    <summary>Design controls</summary>
                    <div class="design-controls-grid">
                        <label class="check-row">
                            <input data-design-control-toggle="font" type="checkbox" ${hasFontDesignControl ? "checked" : ""}>
                            <span>Enable font control for this field</span>
                        </label>
                        <label>
                            <span>Font control label</span>
                            <input data-design-control-prop="font.label" value="${escapeAttribute(field.designControls?.font?.label || `خط ${field.label || field.key || "الحقل"}`)}" placeholder="خط أسماء العروسين">
                        </label>
                        <label>
                            <span>CSS selector</span>
                            <input data-design-control-prop="font.selector" value="${escapeAttribute(field.designControls?.font?.selector || "")}" placeholder=".hero-names">
                        </label>
                    </div>
                </details>

                <details class="condition-editor" ${hasVisibleWhen || hasRequiredWhen ? "open" : ""}>
                    <summary>Show / hide and required rules</summary>
                    <div class="condition-grid">
                        <label class="check-row">
                            <input data-condition-toggle="visibleWhen" type="checkbox" ${hasVisibleWhen ? "checked" : ""}>
                            <span>Show only when</span>
                        </label>
                        <label>
                            <span>Field key</span>
                            <input data-condition-prop="visibleWhen.field" value="${escapeAttribute(field.visibleWhen?.field || "")}" placeholder="showHeroImage">
                        </label>
                        <label>
                            <span>Equals</span>
                            <input data-condition-prop="visibleWhen.equals" value="${escapeAttribute(field.visibleWhen?.equals ?? "")}" placeholder="yes">
                        </label>

                        <label class="check-row">
                            <input data-condition-toggle="requiredWhen" type="checkbox" ${hasRequiredWhen ? "checked" : ""}>
                            <span>Required only when</span>
                        </label>
                        <label>
                            <span>Field key</span>
                            <input data-condition-prop="requiredWhen.field" value="${escapeAttribute(field.requiredWhen?.field || "")}" placeholder="showHeroImage">
                        </label>
                        <label>
                            <span>Equals</span>
                            <input data-condition-prop="requiredWhen.equals" value="${escapeAttribute(field.requiredWhen?.equals ?? "")}" placeholder="yes">
                        </label>
                        <div class="condition-helper">
                            <span>Need the control field too?</span>
                            <button type="button" data-field-action="create-condition-select">Create missing yes/no select</button>
                        </div>
                    </div>
                </details>
                </div>
            </article>
        `;
    }).join("");
}

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function escapeAttribute(value = "") {
    return escapeHtml(value).replaceAll('"', "&quot;");
}

function cleanObject(object) {
    return Object.fromEntries(
        Object.entries(object).filter(([, value]) => {
            if (value === undefined || value === null || value === "") return false;
            if (Array.isArray(value) && value.length === 0) return false;
            if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return false;
            return true;
        })
    );
}

function outputField(field) {
    const { _id, ...plain } = clone(field);
    const min = plain.min;
    const max = plain.max;
    delete plain.min;
    delete plain.max;

    if (min !== undefined && min !== "") {
        if (ARRAY_DEFAULT_TYPES.has(plain.type) || plain.type === "repeater") plain.minItems = Number(min);
        else plain.minLength = Number(min);
    }

    if (max !== undefined && max !== "") {
        if (ARRAY_DEFAULT_TYPES.has(plain.type) || plain.type === "repeater") plain.maxItems = Number(max);
        else plain.maxLength = Number(max);
    }

    if (!plain.required) delete plain.required;
    if (!plain.sanitize) delete plain.sanitize;
    if (!plain.trim) delete plain.trim;

    return cleanObject(plain);
}

function selectedFeatures() {
    const features = { ...state.customFeatures };

    $$("[data-feature-key]").forEach((input) => {
        const key = input.dataset.featureKey;
        const blueprint = FEATURE_BLUEPRINTS.find((item) => item.key === key);
        const defaults = clone(blueprint?.defaults || { enabled: true });
        const existing = typeof features[key] === "object" && features[key] !== null ? features[key] : {};

        if (input.checked) {
            features[key] = {
                ...defaults,
                ...existing,
                enabled: true
            };
        } else if (features[key]?.enabled === true) {
            delete features[key];
        }
    });

    return features;
}

function buildTemplateJson() {
    const template = {
        id: slugify(metadataInputs.id?.value || "my-template", "my-template"),
        name: metadataInputs.name?.value || "My Template",
        version: metadataInputs.version?.value || "1.0.0",
        schemaVersion: "1.0.0",
        type: metadataInputs.type?.value || "custom",
        language: metadataInputs.language?.value || "ar",
        direction: metadataInputs.direction?.value || "rtl",
        html: metadataInputs.html?.value || "index.html",
        css: metadataInputs.css?.value || "style.css",
        fields: state.fields.map(outputField)
    };

    const features = cleanObject(selectedFeatures());
    if (Object.keys(features).length) {
        template.features = features;
    }

    return template;
}

function validateBuilderJson(template) {
    const errors = [];
    const keys = new Set();

    if (!template.id) errors.push("Template ID is required.");
    if (!template.name) errors.push("Template name is required.");
    if (!template.fields.length) errors.push("Add at least one field.");

    template.fields.forEach((field, index) => {
        if (!field.key) errors.push(`Field #${index + 1} is missing a key.`);
        if (field.key && keys.has(field.key)) errors.push(`Duplicate field key: ${field.key}`);
        if (field.key) keys.add(field.key);
        if (!field.label) errors.push(`${field.key || `Field #${index + 1}`} is missing a label.`);
        if (OPTION_TYPES.has(field.type) && !field.options?.length) errors.push(`${field.key} needs options.`);
        if (field.type === "repeater" && !field.itemFields?.length) errors.push(`${field.key} needs itemFields.`);
    });

    return errors;
}

function updateStatus(errors) {
    const status = $("[data-builder-status]");
    if (!status) return;

    if (!errors.length) {
        status.className = "builder-status ok";
        status.textContent = "Valid preview — ready to copy";
        return;
    }

    status.className = "builder-status warn";
    status.textContent = errors.join(" ");
}

function updateOutput() {
    const output = $("#builder-json-output");
    if (!output) return;

    const template = buildTemplateJson();
    output.textContent = JSON.stringify(template, null, 2);
    updateStatus(validateBuilderJson(template));
}

function updateFieldFromInput(input) {
    const editor = input.closest("[data-field-id]");
    if (!editor) return;

    const field = state.fields.find((item) => item._id === Number(editor.dataset.fieldId));
    if (!field) return;

    const prop = input.dataset.fieldProp;
    const conditionProp = input.dataset.conditionProp;
    const designControlProp = input.dataset.designControlProp;

    if (prop) {
        if (prop === "required" || prop === "sanitize" || prop === "trim") {
            field[prop] = input.checked;
        } else if (prop === "key") {
            field.key = camelKey(input.value, field.type);
        } else if (prop === "defaultValue") {
            field.defaultValue = parseLooseValue(input.value, field.type);
        } else if (prop === "options") {
            field.options = parseOptions(input.value);
        } else if (prop === "itemFields") {
            try {
                field.itemFields = JSON.parse(input.value || "[]");
            } catch {
                field.itemFields = [];
            }
        } else if (prop === "min" || prop === "max") {
            if (prop === "min") {
                delete field.minLength;
                delete field.minItems;
            } else {
                delete field.maxLength;
                delete field.maxItems;
            }
            field[prop] = input.value === "" ? "" : Number(input.value);
        } else if (prop === "order") {
            field.order = input.value === "" ? "" : Number(input.value);
        } else {
            field[prop] = input.value;
        }
    }

    if (conditionProp) {
        const [conditionName, conditionKey] = conditionProp.split(".");
        const value = conditionKey === "field" ? camelKey(input.value, "showField") : input.value;
        field[conditionName] = field[conditionName] || {};
        field[conditionName][conditionKey] = value;
        if (conditionKey === "field") input.value = value;
    }

    if (designControlProp) {
        const [controlName, controlKey] = designControlProp.split(".");
        field.designControls = field.designControls || {};
        field.designControls[controlName] = field.designControls[controlName] || { enabled: true };
        field.designControls[controlName].enabled = true;
        field.designControls[controlName][controlKey] = input.value;

        const toggle = editor.querySelector(`[data-design-control-toggle="${controlName}"]`);
        if (toggle) toggle.checked = true;
    }

    updateOutput();
}

function updateDesignControlToggle(input) {
    const editor = input.closest("[data-field-id]");
    const field = state.fields.find((item) => item._id === Number(editor?.dataset.fieldId));
    if (!field) return;

    const controlName = input.dataset.designControlToggle;

    if (input.checked) {
        field.designControls = field.designControls || {};
        field.designControls[controlName] = {
            enabled: true,
            label: field.designControls?.[controlName]?.label || `خط ${field.label || field.key || "الحقل"}`,
            selector: field.designControls?.[controlName]?.selector || ""
        };
    } else if (field.designControls?.[controlName]) {
        delete field.designControls[controlName];

        if (!Object.keys(field.designControls).length) {
            delete field.designControls;
        }
    }

    renderFields();
    updateOutput();
}

function applyPatternPreset(button) {
    const editor = button.closest("[data-field-id]");
    const field = state.fields.find((item) => item._id === Number(editor?.dataset.fieldId));
    if (!field) return;

    const preset = PATTERN_PRESETS.find((item) => item.key === button.dataset.patternPreset);
    if (!preset) return;

    field.pattern = preset.pattern;
    field.patternMessage = preset.message;
    renderFields();
    updateOutput();
}

function clearPatternValidation(button) {
    const editor = button.closest("[data-field-id]");
    const field = state.fields.find((item) => item._id === Number(editor?.dataset.fieldId));
    if (!field) return;

    delete field.pattern;
    delete field.patternMessage;
    renderFields();
    updateOutput();
}

function ensureControllerFromConditionInput(input) {
    const editor = input.closest("[data-field-id]");
    const fieldId = Number(editor?.dataset.fieldId);
    const field = state.fields.find((item) => item._id === fieldId);

    if (!field || !input.dataset.conditionProp?.endsWith(".field") || !input.value.trim()) {
        return;
    }

    ensureConditionControllerField(fieldId, input.value);
    renderFields();
    updateOutput();
}

function updateConditionToggle(input) {
    const editor = input.closest("[data-field-id]");
    const field = state.fields.find((item) => item._id === Number(editor?.dataset.fieldId));
    if (!field) return;

    const conditionName = input.dataset.conditionToggle;

    if (input.checked) {
        field[conditionName] = field[conditionName] || { field: "", equals: "" };
    } else {
        delete field[conditionName];
    }

    renderFields();
    updateOutput();
}

function handleFieldAction(button) {
    const editor = button.closest("[data-field-id]");
    const fieldId = Number(editor?.dataset.fieldId);
    const index = state.fields.findIndex((field) => field._id === fieldId);
    if (index < 0) return;

    const field = state.fields[index];
    const action = button.dataset.fieldAction;

    if (action === "toggle") {
        state.openFieldId = state.openFieldId === fieldId ? null : fieldId;
        renderFields();
        return;
    }

    if (action === "create-condition-select") {
        const hasAnyCondition = Boolean(field.visibleWhen || field.requiredWhen);
        const conditionKey = field.visibleWhen?.field || field.requiredWhen?.field || `show${field.key.charAt(0).toUpperCase()}${field.key.slice(1)}`;
        const key = camelKey(conditionKey, "showField");

        if (!hasAnyCondition) {
            field.visibleWhen = { field: key, equals: "yes" };
        }

        if (field.visibleWhen) {
            field.visibleWhen.field = field.visibleWhen.field || key;
            field.visibleWhen.equals = field.visibleWhen.equals || "yes";
        }

        if (field.requiredWhen) {
            field.requiredWhen.field = field.requiredWhen.field || key;
            field.requiredWhen.equals = field.requiredWhen.equals || "yes";
        }

        ensureConditionControllerField(fieldId, key);
        renderFields();
        updateOutput();
        return;
    }

    if (action === "remove") {
        const nextOpenFieldId = state.fields[index + 1]?._id ?? state.fields[index - 1]?._id ?? null;
        state.fields.splice(index, 1);
        if (state.openFieldId === fieldId) {
            state.openFieldId = nextOpenFieldId;
        }
    }

    if (action === "duplicate") {
        const copyField = normalizeField(clone(state.fields[index]));
        copyField.key = uniqueKey(copyField.key, copyField._id);
        state.fields.splice(index + 1, 0, copyField);
        state.openFieldId = copyField._id;
    }

    if (action === "up" && index > 0) {
        [state.fields[index - 1], state.fields[index]] = [state.fields[index], state.fields[index - 1]];
    }

    if (action === "down" && index < state.fields.length - 1) {
        [state.fields[index + 1], state.fields[index]] = [state.fields[index], state.fields[index + 1]];
    }

    renderFields();
    updateOutput();
}

function importTemplateJson(jsonText) {
    const parsed = JSON.parse(jsonText);

    metadataInputs.id.value = parsed.id || "";
    metadataInputs.name.value = parsed.name || "";
    metadataInputs.version.value = parsed.version || "1.0.0";
    metadataInputs.type.value = parsed.type || "";
    metadataInputs.language.value = parsed.language || "ar";
    metadataInputs.direction.value = parsed.direction || "rtl";
    metadataInputs.html.value = parsed.html || "index.html";
    metadataInputs.css.value = parsed.css || "style.css";

    state.fields = Array.isArray(parsed.fields) ? parsed.fields.map(normalizeField) : [];
    state.openFieldId = state.fields[0]?._id ?? null;
    state.customFeatures = parsed.features && typeof parsed.features === "object" ? clone(parsed.features) : {};

    $$("[data-feature-key]").forEach((input) => {
        input.checked = Boolean(parsed.features?.[input.dataset.featureKey]?.enabled ?? parsed.features?.[input.dataset.featureKey]);
    });

    renderFields();
    updateOutput();
}

function resetBuilder() {
    metadataInputs.id.value = "my-template";
    metadataInputs.name.value = "My Template";
    metadataInputs.version.value = "1.0.0";
    metadataInputs.type.value = "custom";
    metadataInputs.language.value = "ar";
    metadataInputs.direction.value = "rtl";
    metadataInputs.html.value = "index.html";
    metadataInputs.css.value = "style.css";
    state.fields = [];
    state.customFeatures = {};
    state.openFieldId = null;
    $$("[data-feature-key]").forEach((input) => {
        input.checked = false;
    });
    renderFields();
    updateOutput();
}

function demoTemplate() {
    return JSON.stringify({
        id: "modern-invitation",
        name: "Modern Invitation",
        version: "1.0.0",
        schemaVersion: "1.0.0",
        type: "invitation",
        language: "ar",
        direction: "rtl",
        html: "index.html",
        css: "style.css",
        fields: [
            {
                key: "title",
                label: "العنوان",
                type: "text",
                required: true,
                defaultValue: "ندعوكم لحضور مناسبتنا",
                maxLength: 80,
                formTab: "data",
                group: "main",
                order: 1
            },
            {
                key: "names",
                label: "أسماء العروسين",
                type: "names",
                placeholder: "مثال: محمد",
                minItems: 2,
                required: true,
                separator: " و ",
                maxItems: 2,
                formTab: "data",
                group: "people",
                order: 2,
                designControls: {
                    font: {
                        enabled: true,
                        label: "خط أسماء العروسين",
                        selector: ".hero-names"
                    }
                }
            },
            {
                key: "showHeroImage",
                label: "إظهار الصورة",
                type: "select",
                defaultValue: "yes",
                options: [
                    { label: "نعم", value: "yes" },
                    { label: "لا", value: "no" }
                ],
                formTab: "design",
                group: "images",
                order: 3
            },
            {
                key: "heroImage",
                label: "الصورة الرئيسية",
                type: "image",
                visibleWhen: {
                    field: "showHeroImage",
                    equals: "yes"
                },
                formTab: "design",
                group: "images",
                order: 4
            }
        ],
        features: {
            feelings: {
                enabled: true,
                approvalMode: "manual",
                preventDuplicate: true,
                rateLimitMinutes: 5,
                title: "شارك مشاعرك",
                description: "اكتب رسالة جميلة لأصحاب الدعوة"
            },
            rsvp: {
                enabled: true,
                preventDuplicate: true,
                title: "هل ستحضر؟",
                description: "يسعدنا معرفة حضورك للمناسبة"
            },
            countdown: {
                enabled: true,
                title: "باقي على المناسبة",
                targetField: "eventDate",
                showDays: true,
                showHours: true,
                showMinutes: true
            }
        }
    }, null, 2);
}

async function copyTextFromButton(button) {
    const targetId = button.getAttribute("data-copy");
    const target = document.getElementById(targetId);
    if (!target) return;

    const text = target.value ?? target.textContent ?? target.innerText;
    const oldText = button.innerText;

    try {
        await navigator.clipboard.writeText(text);
        button.innerText = "Copied";
        button.classList.add("copied");
    } catch {
        const fallback = document.createElement("textarea");
        fallback.value = text;
        fallback.setAttribute("readonly", "");
        fallback.style.position = "fixed";
        fallback.style.opacity = "0";
        document.body.appendChild(fallback);
        fallback.select();

        try {
            document.execCommand("copy");
            button.innerText = "Copied";
            button.classList.add("copied");
        } catch {
            button.innerText = "Copy failed";
        }

        fallback.remove();
    }

    setTimeout(() => {
        button.innerText = oldText;
        button.classList.remove("copied");
    }, 1200);
}

function bindBuilder() {
    renderFieldPicker();
    renderFeatureToggles();
    renderFields();

    Object.values(metadataInputs).forEach((input) => {
        input?.addEventListener("input", updateOutput);
        input?.addEventListener("change", updateOutput);
    });

    document.addEventListener("click", (event) => {
        const copyButton = event.target.closest("[data-copy]");
        if (copyButton) copyTextFromButton(copyButton);

        const fieldPickerButton = event.target.closest("[data-add-field]");
        if (fieldPickerButton) addField(fieldPickerButton.dataset.addField);

        const commonButton = event.target.closest("[data-add-common-fields]");
        if (commonButton) addCommonFields();

        const clearFieldsButton = event.target.closest("[data-clear-fields]");
        if (clearFieldsButton) {
            state.fields = [];
            state.openFieldId = null;
            renderFields();
            updateOutput();
        }

        const fieldActionButton = event.target.closest("[data-field-action]");
        if (fieldActionButton) handleFieldAction(fieldActionButton);

        const patternPresetButton = event.target.closest("[data-pattern-preset]");
        if (patternPresetButton) applyPatternPreset(patternPresetButton);

        const patternClearButton = event.target.closest("[data-pattern-clear]");
        if (patternClearButton) clearPatternValidation(patternClearButton);

        const importButton = event.target.closest("[data-import-json]");
        if (importButton) {
            try {
                importTemplateJson($("#builder-import").value);
            } catch (error) {
                updateStatus([`Import failed: ${error.message}`]);
            }
        }

        const demoButton = event.target.closest("[data-load-demo-json]");
        if (demoButton) {
            $("#builder-import").value = demoTemplate();
            importTemplateJson($("#builder-import").value);
        }

        const resetButton = event.target.closest("[data-builder-reset]");
        if (resetButton) resetBuilder();
    });

    document.addEventListener("input", (event) => {
        const fieldInput = event.target.closest("[data-field-prop], [data-condition-prop], [data-design-control-prop]");
        if (fieldInput) updateFieldFromInput(fieldInput);
    });

    document.addEventListener("change", (event) => {
        const fieldInput = event.target.closest("[data-field-prop], [data-condition-prop], [data-design-control-prop]");
        if (fieldInput) {
            updateFieldFromInput(fieldInput);
            ensureControllerFromConditionInput(fieldInput);
        }

        const designControlToggle = event.target.closest("[data-design-control-toggle]");
        if (designControlToggle) updateDesignControlToggle(designControlToggle);

        const conditionToggle = event.target.closest("[data-condition-toggle]");
        if (conditionToggle) updateConditionToggle(conditionToggle);

        const featureToggle = event.target.closest("[data-feature-key]");
        if (featureToggle) updateOutput();
    });

    addCommonFields();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindBuilder);
} else {
    bindBuilder();
}
