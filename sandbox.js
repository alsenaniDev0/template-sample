const sandboxEditors = {
    json: document.getElementById("sandbox-json"),
    html: document.getElementById("sandbox-html"),
    css: document.getElementById("sandbox-css"),
    mock: document.getElementById("sandbox-mock"),
    validation: document.getElementById("sandbox-validation"),
    preview: document.getElementById("sandbox-preview"),
    autosaveStatus: document.querySelector("[data-autosave-status]"),
    project: document.querySelector("[data-template-project]"),
    projectStatus: document.querySelector("[data-project-status]")
};

const SANDBOX_STORAGE_KEY = "safhat-template-sandbox:v1";

let lastRenderedHtml = "";
let projectLoadToken = 0;

const sandboxDemo = {
    json: {
        id: "sandbox-invitation",
        name: "Sandbox Invitation",
        version: "1.0.0",
        schemaVersion: "1.0.0",
        type: "invitation",
        language: "ar",
        direction: "rtl",
        html: "index.html",
        css: "style.css",
        assetsBaseUrl: "",
        fields: [
            {
                key: "title",
                label: "العنوان",
                type: "text",
                formTab: "data",
                required: true,
                defaultValue: "ندعوكم لحضور مناسبتنا",
                maxLength: 80
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
                designControls: {
                    font: {
                        enabled: true,
                        label: "خط أسماء العروسين",
                        selector: ".hero-names"
                    }
                }
            },
            {
                key: "eventDate",
                label: "تاريخ المناسبة",
                type: "date",
                formTab: "data",
                defaultValue: "2026-12-31"
            },
            {
                key: "location",
                label: "الموقع",
                type: "map",
                formTab: "data",
                defaultValue: "Riyadh, Saudi Arabia"
            },
            {
                key: "buttonUrl",
                label: "رابط الزر",
                type: "url",
                formTab: "data",
                defaultValue: "https://example.com",
                patternMessage: "الرابط يجب أن يبدأ بـ http أو https",
                pattern: "^https?:\\/\\/.+"
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
            }
        }
    },
    html: `<main class="invitation-template">
    <section class="hero">
        <span class="eyebrow">دعوة خاصة</span>
        <h1>{{title}}</h1>
        <p class="hero-names">{{names}}</p>
        <p class="event-meta">{{eventDate}} · {{location}}</p>
        <a class="main-button" href="{{buttonUrl}}">فتح الرابط</a>
    </section>
</main>`,
    css: `.invitation-template {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 32px;
    color: #2f1f19;
    background: radial-gradient(circle at top, #fff7ed, #fdf2f8);
    font-family: Cairo, sans-serif;
}

.hero {
    width: min(720px, 100%);
    padding: 42px;
    border-radius: 34px;
    text-align: center;
    background: rgba(255, 255, 255, 0.82);
    box-shadow: 0 24px 80px rgba(124, 58, 237, 0.16);
}

.eyebrow {
    color: #be185d;
    font-weight: 900;
}

h1 {
    margin: 14px 0;
    font-size: clamp(34px, 7vw, 68px);
}

.hero-names {
    margin: 0;
    color: #7c3aed;
    font-size: clamp(30px, 6vw, 58px);
    font-weight: 900;
}

.event-meta {
    color: #6b7280;
    font-weight: 700;
}

.main-button {
    display: inline-flex;
    margin-top: 18px;
    padding: 13px 22px;
    border-radius: 999px;
    color: #ffffff;
    background: #7c3aed;
    font-weight: 900;
}`
};

const featureHelpers = {
    feelings: {
        label: "Feelings section",
        json: {
            enabled: true,
            approvalMode: "manual",
            preventDuplicate: true,
            rateLimitMinutes: 5,
            title: "شارك مشاعرك",
            description: "اكتب رسالة جميلة لأصحاب الدعوة"
        },
        html: `<section class="feelings-section" data-feature="feelings" data-approval-mode="manual"
    data-prevent-duplicate="true" data-rate-limit-minutes="5">
    <div class="feelings-header">
        <span class="feelings-icon">💌</span>
        <div>
            <h2>شارك مشاعرك</h2>
            <p>اكتب رسالة جميلة لهذا الشخص الجميل</p>
        </div>
    </div>

    <div class="interaction-card">
        <p class="feeling-notice" data-feeling-notice>
            تنبيه: رسالتك لن تظهر مباشرة، وستحتاج موافقة صاحب التصميم قبل نشرها للزوار.
        </p>

        <div class="form-group">
            <label for="feelingName">اسمك</label>
            <input id="feelingName" class="interaction-input" type="text" placeholder="اكتب اسمك"
                maxlength="60" data-feeling-name />
        </div>

        <div class="form-group">
            <label for="feelingMessage">رسالتك</label>
            <textarea id="feelingMessage" class="interaction-textarea" placeholder="اكتب تهنئتك هنا..."
                maxlength="220" rows="4" data-feeling-message></textarea>
        </div>

        <button type="button" class="interaction-submit" data-send-feeling>
            إرسال الرسالة
        </button>

        <p class="interaction-message" data-feeling-result></p>
    </div>

    <div class="feelings-list" data-feelings-list></div>
</section>

<script>
    (function () {
        var feelingsSection = document.querySelector('[data-feature="feelings"]');
        if (!feelingsSection) return;

        var notice = feelingsSection.querySelector('[data-feeling-notice]');
        if (!notice) return;

        function updateFeelingNotice() {
            var approvalMode = feelingsSection.getAttribute('data-approval-mode');

            if (!approvalMode || approvalMode.indexOf('{{') === 0) {
                approvalMode = 'manual';
            }

            if (approvalMode === 'auto') {
                notice.textContent = 'رسالتك ستظهر مباشرة بعد الإرسال.';
            } else {
                notice.textContent = 'تنبيه: رسالتك لن تظهر مباشرة، وستحتاج موافقة صاحب التصميم قبل نشرها للزوار.';
            }
        }

        updateFeelingNotice();

        var observer = new MutationObserver(updateFeelingNotice);

        observer.observe(feelingsSection, {
            attributes: true,
            attributeFilter: ['data-approval-mode']
        });
    })();
</script>`,
        css: `.feelings-section {
    margin-top: 26px;
    padding: 28px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.88);
    border: 1px solid rgba(124, 58, 237, 0.14);
}

.feelings-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;
}

.feelings-icon {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: #fef3c7;
    font-size: 26px;
}

.interaction-card {
    display: grid;
    gap: 14px;
    padding: 18px;
    border-radius: 22px;
    background: #ffffff;
}

.form-group {
    display: grid;
    gap: 8px;
}

.interaction-input,
.interaction-textarea {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 12px 14px;
    font: inherit;
}

.interaction-submit {
    border: 0;
    border-radius: 999px;
    padding: 13px 18px;
    color: #ffffff;
    background: #7c3aed;
    font-weight: 800;
}

.feeling-notice,
.interaction-message {
    margin: 0;
    color: #6b7280;
    line-height: 1.7;
}`
    },
    rsvp: {
        label: "RSVP section",
        json: {
            enabled: true,
            preventDuplicate: true,
            nameRequired: false,
            title: "هل ستحضر؟",
            description: "يسعدنا معرفة حضورك للمناسبة"
        },
        html: `<section class="rsvp-section" data-feature="rsvp">
    <div class="section-heading">
        <span>تأكيد الحضور</span>
        <h2>هل ستشاركنا هذه المناسبة؟</h2>
        <p>يسعدنا معرفة حضورك للمناسبة</p>
    </div>

    <div class="interaction-card">
        <input class="interaction-input" type="text" placeholder="اكتب اسمك" maxlength="60" data-rsvp-name>

        <div class="rsvp-options">
            <button type="button" class="rsvp-option attending" data-rsvp-status="attending">
                <span>✅</span>
                <strong>سأحضر</strong>
            </button>

            <button type="button" class="rsvp-option not-attending" data-rsvp-status="not_attending">
                <span>❎</span>
                <strong>لن أحضر</strong>
            </button>

            <button type="button" class="rsvp-option maybe" data-rsvp-status="maybe">
                <span>❓</span>
                <strong>لم أقرر بعد</strong>
            </button>
        </div>

        <p class="interaction-message" data-rsvp-message></p>
    </div>
</section>`,
        css: `.rsvp-section {
    margin-top: 26px;
    padding: 28px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.88);
    border: 1px solid rgba(22, 163, 74, 0.14);
}

.rsvp-section .section-heading {
    text-align: center;
    margin-bottom: 18px;
}

.rsvp-section .section-heading span {
    display: inline-flex;
    margin-bottom: 8px;
    color: #16a34a;
    font-weight: 900;
}

.rsvp-section .section-heading h2 {
    margin: 0;
    font-size: clamp(24px, 5vw, 42px);
}

.rsvp-section .section-heading p {
    margin: 8px 0 0;
    color: #6b7280;
    line-height: 1.7;
}

.rsvp-section .interaction-card {
    display: grid;
    gap: 14px;
    padding: 18px;
    border-radius: 22px;
    background: #ffffff;
}

.rsvp-section .form-group {
    display: grid;
    gap: 8px;
}

.rsvp-section .interaction-input {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 12px 14px;
    font: inherit;
}

.rsvp-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.rsvp-option {
    flex: 1 1 150px;
    display: grid;
    gap: 6px;
    justify-items: center;
    border: 0;
    border-radius: 18px;
    padding: 16px;
    color: #0f172a;
    background: #f8fafc;
    font-weight: 800;
}

.rsvp-option span {
    font-size: 24px;
}

.rsvp-option.attending {
    background: #dcfce7;
}

.rsvp-option.not-attending {
    background: #fee2e2;
}

.rsvp-option.maybe {
    background: #fef3c7;
}

.rsvp-section .interaction-message {
    margin: 0;
    color: #6b7280;
    line-height: 1.7;
}`
    }
};

function pretty(value) {
    return JSON.stringify(value, null, 2);
}

function setAutosaveStatus(message, tone = "ok") {
    if (!sandboxEditors.autosaveStatus) return;

    sandboxEditors.autosaveStatus.textContent = message;
    sandboxEditors.autosaveStatus.classList.toggle("warn", tone === "warn");
}

function currentSandboxTab() {
    return document.querySelector("[data-sandbox-tab].active")?.dataset.sandboxTab || "json";
}

function setActiveSandboxTab(tab) {
    const nextTab = ["json", "html", "css", "mock"].includes(tab) ? tab : "json";

    document.querySelectorAll("[data-sandbox-tab]").forEach((button) => {
        const isActive = button.dataset.sandboxTab === nextTab;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-selected", String(isActive));
    });

    document.querySelectorAll("[data-sandbox-panel]").forEach((panel) => {
        const isActive = panel.dataset.sandboxPanel === nextTab;
        panel.classList.toggle("active", isActive);
        panel.hidden = !isActive;
    });

    saveSandboxState();
}

function sandboxState() {
    return {
        json: sandboxEditors.json.value,
        html: sandboxEditors.html.value,
        css: sandboxEditors.css.value,
        mock: sandboxEditors.mock.value,
        selectedProject: sandboxEditors.project?.value || "",
        activeTab: currentSandboxTab(),
        savedAt: new Date().toISOString()
    };
}

function saveSandboxState() {
    try {
        localStorage.setItem(SANDBOX_STORAGE_KEY, JSON.stringify(sandboxState()));
        setAutosaveStatus("Autosaved locally");
    } catch (error) {
        setAutosaveStatus(`Autosave blocked: ${error.message}`, "warn");
    }
}

function restoreSandboxState() {
    try {
        const raw = localStorage.getItem(SANDBOX_STORAGE_KEY);
        if (!raw) return false;

        const saved = JSON.parse(raw);
        sandboxEditors.json.value = saved.json || "";
        sandboxEditors.html.value = saved.html || "";
        sandboxEditors.css.value = saved.css || "";
        sandboxEditors.mock.value = saved.mock || "";
        if (sandboxEditors.project) sandboxEditors.project.value = saved.selectedProject || "";
        setActiveSandboxTab(saved.activeTab || "json");
        setAutosaveStatus("Restored autosaved work");
        return true;
    } catch (error) {
        setAutosaveStatus(`Could not restore autosave: ${error.message}`, "warn");
        return false;
    }
}

function safeParseJson(text, label, issues) {
    try {
        return JSON.parse(text || "{}");
    } catch (error) {
        issues.errors.push(`${label} JSON is invalid: ${error.message}`);
        return null;
    }
}

function helperBlock(kind, name, content) {
    return `${kind === "html" ? "<!--" : "/*"} sandbox-helper:${name}:start ${kind === "html" ? "-->" : "*/"}
${content}
${kind === "html" ? "<!--" : "/*"} sandbox-helper:${name}:end ${kind === "html" ? "-->" : "*/"}`;
}

function removeHelperBlock(source, kind, name) {
    const start = kind === "html" ? `<!-- sandbox-helper:${name}:start -->` : `/* sandbox-helper:${name}:start */`;
    const end = kind === "html" ? `<!-- sandbox-helper:${name}:end -->` : `/* sandbox-helper:${name}:end */`;
    const pattern = new RegExp(`\\n?${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}\\n?`, "g");
    return source.replace(pattern, "\n").trim();
}

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyFeatureHelper(name, enabled) {
    const helper = featureHelpers[name];
    if (!helper) return;

    const issues = { errors: [], warnings: [] };
    const template = safeParseJson(sandboxEditors.json.value, "template.json", issues) || {};

    template.features = template.features || {};

    if (enabled) {
        template.features[name] = {
            ...helper.json,
            ...(typeof template.features[name] === "object" ? template.features[name] : {}),
            enabled: true
        };
        sandboxEditors.html.value = `${removeHelperBlock(sandboxEditors.html.value, "html", name)}

${helperBlock("html", name, helper.html)}`.trim();
        sandboxEditors.css.value = `${removeHelperBlock(sandboxEditors.css.value, "css", name)}

${helperBlock("css", name, helper.css)}`.trim();
    } else {
        delete template.features[name];
        if (!Object.keys(template.features).length) delete template.features;
        sandboxEditors.html.value = removeHelperBlock(sandboxEditors.html.value, "html", name);
        sandboxEditors.css.value = removeHelperBlock(sandboxEditors.css.value, "css", name);
    }

    sandboxEditors.json.value = pretty(template);
    generateMockData();
    renderSandbox();
}

function defaultValueForField(field) {
    if (field.defaultValue !== undefined) return field.defaultValue;

    if (field.type === "names") {
        return field.maxItems === 2 ? ["محمد", "سارة"] : ["محمد"];
    }

    if (field.type === "list") return ["عنصر أول", "عنصر ثاني"];

    if (field.type === "repeater") {
        if (Array.isArray(field.defaultValue)) return field.defaultValue;
        return [
            Object.fromEntries((field.itemFields || []).map((item) => [item.key, defaultValueForField(item)]))
        ];
    }

    if (field.type === "date") return "2026-12-31";
    if (field.type === "time") return "20:00";
    if (field.type === "color") return "#7c3aed";
    if (field.type === "colors") return field.defaultValue || { primary: "#7c3aed", accent: "#f97316" };
    if (field.type === "image") return "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";
    if (field.type === "url") return field.pattern && !field.pattern.includes("#") ? "https://example.com" : "#";
    if (field.type === "youtube") return "https://youtu.be/dQw4w9WgXcQ";
    if (field.type === "map") return "Riyadh, Saudi Arabia";
    if (field.options?.length) return field.options[0].value;

    return field.placeholder || field.label || field.key || "";
}

function generateMockData() {
    const issues = { errors: [], warnings: [] };
    const template = safeParseJson(sandboxEditors.json.value, "template.json", issues);
    if (!template) {
        writeValidation(issues);
        return;
    }

    const mock = {};
    const fieldFonts = {};

    (template.fields || []).forEach((field) => {
        mock[field.key] = defaultValueForField(field);

        if (field.type === "map") {
            mock[`${field.key}Url`] = `https://maps.google.com/?q=${encodeURIComponent(mock[field.key] || "")}`;
        }

        if (field.designControls?.font?.enabled) {
            fieldFonts[field.key] = {
                id: "marhey",
                nameAr: "مرحي",
                family: "Marhey",
                cssUrl: "https://fonts.googleapis.com/css2?family=Marhey:wght@300..700&display=swap"
            };
        }
    });

    mock.__designFont = {
        id: "tajawal",
        nameAr: "تجوال",
        family: "Tajawal",
        cssUrl: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap"
    };

    if (Object.keys(fieldFonts).length) {
        mock.__fieldFonts = fieldFonts;
    }

    sandboxEditors.mock.value = pretty(mock);
}

function validateSandbox() {
    const issues = { errors: [], warnings: [], success: [] };
    const template = safeParseJson(sandboxEditors.json.value, "template.json", issues);
    const mock = safeParseJson(sandboxEditors.mock.value, "mock data", issues) || {};
    const html = sandboxEditors.html.value || "";
    const css = sandboxEditors.css.value || "";

    if (!template) {
        writeValidation(issues);
        return issues;
    }

    ["id", "name", "version", "html", "css"].forEach((key) => {
        if (!template[key]) issues.errors.push(`Missing template.${key}`);
    });

    if (!Array.isArray(template.fields)) {
        issues.errors.push("template.fields must be an array.");
    }

    const fieldKeys = new Set();
    const implicitKeys = new Set();

    (template.fields || []).forEach((field, index) => {
        if (!field.key) issues.errors.push(`Field #${index + 1} is missing key.`);
        if (field.key && fieldKeys.has(field.key)) issues.errors.push(`Duplicate field key: ${field.key}`);
        if (field.key) fieldKeys.add(field.key);

        if (!field.label) issues.warnings.push(`${field.key || `Field #${index + 1}`} is missing label.`);
        if (!field.type) issues.errors.push(`${field.key || `Field #${index + 1}`} is missing type.`);

        if (field.type === "map" && field.key) implicitKeys.add(`${field.key}Url`);

        if (field.required && isEmptyValue(mock[field.key])) {
            issues.errors.push(`${field.key} is required but mock data is empty.`);
        }

        if (field.pattern && mock[field.key] !== undefined && mock[field.key] !== "") {
            try {
                const regex = new RegExp(field.pattern);
                if (!regex.test(String(mock[field.key]))) {
                    issues.errors.push(`${field.key} does not match pattern: ${field.patternMessage || field.pattern}`);
                }
            } catch (error) {
                issues.errors.push(`${field.key} has invalid regex pattern: ${error.message}`);
            }
        }
    });

    const knownKeys = new Set([...fieldKeys, ...implicitKeys]);
    const variableRoots = extractTemplateVariables(html);
    variableRoots.forEach((key) => {
        if (!knownKeys.has(key) && key !== "this") {
            issues.warnings.push(`HTML uses {{${key}}} but no matching field exists.`);
        }
    });

    (template.fields || []).forEach((field) => {
        if (field.key && !html.includes(`{{${field.key}}}`) && !html.includes(`{{#each ${field.key}}}`)) {
            issues.warnings.push(`${field.key} field is not used in HTML.`);
        }
    });

    Object.entries(template.features || {}).forEach(([key, feature]) => {
        if (feature?.enabled && !html.includes(`data-feature="${key}"`)) {
            issues.warnings.push(`Feature "${key}" is enabled but HTML has no data-feature="${key}" block.`);
        }
    });

    (template.fields || []).forEach((field) => {
        const selector = field.designControls?.font?.selector;
        if (field.designControls?.font?.enabled && selector && !html.includes(selector.replace(/^[.#]/, ""))) {
            issues.warnings.push(`${field.key} has designControls.font.selector "${selector}" but the HTML may not contain that selector.`);
        }
    });

    if ((html.includes("assets/") || css.includes("assets/")) && !template.assetsBaseUrl) {
        issues.warnings.push("Local assets are used. In production Safhat rewrites them with assetsBaseUrl; add assetsBaseUrl to test exact URLs.");
    }

    validateFeatureBlock("feelings", html, issues, [
        "data-feeling-name",
        "data-feeling-message",
        "data-send-feeling",
        "data-feeling-result",
        "data-feelings-list"
    ]);

    validateFeatureBlock("rsvp", html, issues, [
        "data-rsvp-name",
        "data-rsvp-status",
        "data-rsvp-message"
    ]);

    if (!css.trim()) issues.warnings.push("CSS is empty.");
    if (!html.trim()) issues.errors.push("HTML is empty.");

    if (!issues.errors.length && !issues.warnings.length) {
        issues.success.push("Template sandbox checks passed.");
    }

    writeValidation(issues);
    return issues;
}

function validateFeatureBlock(name, html, issues, requiredMarkers) {
    if (!html.includes(`data-feature="${name}"`)) return;

    requiredMarkers.forEach((marker) => {
        if (!html.includes(marker)) {
            issues.warnings.push(`${name} feature block is missing ${marker}.`);
        }
    });
}

function extractTemplateVariables(html) {
    const roots = new Set();
    const variableRegex = /\{\{\s*([#/^]?\s*[\w.]+)\s*\}\}/g;
    let match;

    while ((match = variableRegex.exec(html))) {
        const raw = match[1].trim();
        if (raw.startsWith("/") || raw.startsWith("#each")) continue;
        roots.add(raw.split(".")[0]);
    }

    const eachRegex = /\{\{\s*#each\s+([\w.]+)\s*\}\}/g;
    while ((match = eachRegex.exec(html))) {
        roots.add(match[1].split(".")[0]);
    }

    return roots;
}

function isEmptyValue(value) {
    if (value === undefined || value === null) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    return false;
}

function writeValidation(issues) {
    const groups = [
        ["errors", "Errors"],
        ["warnings", "Warnings"],
        ["success", "Passed"]
    ];

    sandboxEditors.validation.innerHTML = groups
        .filter(([key]) => issues[key]?.length)
        .map(([key, label]) => `
            <div class="validation-group ${key}">
                <strong>${label}</strong>
                <ul>
                    ${issues[key].map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
            </div>
        `).join("") || `<div class="validation-group success"><strong>Ready</strong><ul><li>No checks yet.</li></ul></div>`;
}

function renderSandbox() {
    const issues = validateSandbox();
    const template = safeParseJson(sandboxEditors.json.value, "template.json", { errors: [], warnings: [] });
    const mock = safeParseJson(sandboxEditors.mock.value, "mock data", { errors: [], warnings: [] }) || {};
    const direction = template?.direction || "rtl";
    const language = template?.language || "ar";
    const preparedHtml = prepareTemplateHtml(sandboxEditors.html.value, template);
    const renderedBody = renderTemplate(preparedHtml.body, mock, template);
    const css = buildRenderedCss(sandboxEditors.css.value || "", mock, template);

    lastRenderedHtml = `<!DOCTYPE html>
<html lang="${escapeAttribute(language)}" dir="${escapeAttribute(direction)}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css}</style>
</head>
<body>
${renderedBody}
</body>
</html>`;

    sandboxEditors.preview.srcdoc = lastRenderedHtml;
    saveSandboxState();

    return issues;
}

function renderTemplate(html, data, template) {
    let output = html;

    output = output.replace(/\{\{\s*#each\s+([\w.]+)\s*\}\}([\s\S]*?)\{\{\s*\/each\s*\}\}/g, (_, key, inner) => {
        const value = getValue(data, key);
        if (!Array.isArray(value)) return "";

        const field = (template?.fields || []).find((item) => item.key === key);
        const separator = field?.separator || "";

        return value.map((item) => {
            if (typeof item === "object" && item !== null) {
                return inner.replace(/\{\{\s*([\w.]+|this)\s*\}\}/g, (match, itemKey) => {
                    if (itemKey === "this") return escapeHtml(String(item));
                    return escapeHtml(String(getValue(item, itemKey) ?? ""));
                });
            }

            return inner.replace(/\{\{\s*this\s*\}\}/g, escapeHtml(String(item)));
        }).join(separator);
    });

    output = output.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
        const value = getValue(data, key);
        if (Array.isArray(value)) {
            const field = (template?.fields || []).find((item) => item.key === key);
            return escapeHtml(value.join(field?.separator || ", "));
        }

        if (typeof value === "object" && value !== null) return escapeHtml(JSON.stringify(value));
        return escapeHtml(String(value ?? ""));
    });

    return output;
}

function prepareTemplateHtml(html, template) {
    const withoutStylesheets = String(html || "").replace(/<link\b[^>]*rel=["']?stylesheet["']?[^>]*>/gi, "");
    const bodyMatch = withoutStylesheets.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
    const body = bodyMatch ? bodyMatch[1] : withoutStylesheets;

    return {
        body: rewriteAssetPaths(body, sandboxAssetBaseUrl(template))
    };
}

function buildRenderedCss(css, data, template) {
    const assetSafeCss = rewriteAssetPaths(css, sandboxAssetBaseUrl(template));
    const variableCss = buildColorVariableCss(data, template);
    const fontCss = buildFontCss(data, template);

    return [fontCss, variableCss, assetSafeCss].filter(Boolean).join("\n\n");
}

function sandboxAssetBaseUrl(template) {
    if (template?.assetsBaseUrl) return template.assetsBaseUrl;

    const folder = sandboxEditors.project?.value;
    return folder ? `../${encodeURIComponent(folder)}` : "";
}

function rewriteAssetPaths(source, assetsBaseUrl) {
    if (!assetsBaseUrl) return source;

    const base = String(assetsBaseUrl).replace(/\/+$/, "");

    return String(source || "")
        .replace(/\b(src|href)=["'](assets\/[^"']+)["']/g, (_, attr, assetPath) => `${attr}="${base}/${assetPath}"`)
        .replace(/url\((["']?)(assets\/[^"')]+)\1\)/g, (_, quote, assetPath) => `url("${base}/${assetPath}")`);
}

function buildColorVariableCss(data, template) {
    const declarations = [];

    (template?.fields || []).forEach((field) => {
        if (!field.key) return;

        if (field.type === "color") {
            const value = data[field.key] || field.defaultValue;
            if (value) declarations.push(`--${kebabCase(field.key)}: ${value};`);
        }

        if (field.type === "colors") {
            const values = data[field.key] || field.defaultValue || {};
            Object.entries(values).forEach(([key, value]) => {
                if (value) declarations.push(`--${kebabCase(field.key)}-${kebabCase(key)}: ${value};`);
            });
        }
    });

    return declarations.length ? `:root {\n  ${declarations.join("\n  ")}\n}` : "";
}

function buildFontCss(data, template) {
    const imports = [];
    const rules = [];
    const designFont = data.__designFont;

    if (designFont?.cssUrl) imports.push(`@import url("${designFont.cssUrl}");`);
    if (designFont?.family) rules.push(`body { font-family: "${designFont.family}", sans-serif; }`);

    const fieldFonts = data.__fieldFonts || {};
    (template?.fields || []).forEach((field) => {
        const fontControl = field.designControls?.font;
        const selectedFont = fieldFonts[field.key];
        if (!fontControl?.enabled || !fontControl.selector || !selectedFont?.family) return;

        if (selectedFont.cssUrl) imports.push(`@import url("${selectedFont.cssUrl}");`);
        rules.push(`${fontControl.selector} { font-family: "${selectedFont.family}", sans-serif; }`);
    });

    return [...new Set(imports)].concat(rules).join("\n");
}

function kebabCase(value) {
    return String(value || "")
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

function getValue(source, path) {
    return String(path).split(".").reduce((current, part) => current?.[part], source);
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

function syncFeatureHelperChecks() {
    const template = safeParseJson(sandboxEditors.json.value, "template.json", { errors: [], warnings: [] });

    document.querySelectorAll("[data-feature-helper]").forEach((input) => {
        input.checked = Boolean(template?.features?.[input.dataset.featureHelper]?.enabled);
    });
}

function populateTemplateProjects() {
    const projects = Array.isArray(window.SAFHAT_TEMPLATE_PROJECTS)
        ? window.SAFHAT_TEMPLATE_PROJECTS
        : [];

    if (!sandboxEditors.project) return;

    projects.forEach((project) => {
        const option = document.createElement("option");
        option.value = project.folder;
        option.textContent = project.name === project.folder
            ? project.folder
            : `${project.name} — ${project.folder}`;
        sandboxEditors.project.appendChild(option);
    });

    if (sandboxEditors.projectStatus) {
        sandboxEditors.projectStatus.textContent = projects.length
            ? `${projects.length} projects available. Selecting one replaces the current editors.`
            : "No projects found. Run node template-sample/refresh-template-projects.mjs from the templates folder.";
        sandboxEditors.projectStatus.classList.toggle("warn", !projects.length);
    }
}

async function loadTemplateProject(folder) {
    if (!folder) return;

    const project = (window.SAFHAT_TEMPLATE_PROJECTS || []).find((item) => item.folder === folder);
    if (!project) {
        setAutosaveStatus(`Project not found: ${folder}`, "warn");
        return;
    }

    const loadToken = ++projectLoadToken;
    let files = project;

    if (sandboxEditors.projectStatus) {
        sandboxEditors.projectStatus.textContent = `Loading ${folder}…`;
        sandboxEditors.projectStatus.classList.remove("warn");
    }

    if (window.location.protocol !== "file:") {
        try {
            files = await fetchTemplateProject(folder);
        } catch (error) {
            files = project;
            console.warn(`Could not read the latest ${folder} files; using the catalog snapshot.`, error);
        }
    }

    if (loadToken !== projectLoadToken || sandboxEditors.project.value !== folder) return;

    sandboxEditors.json.value = files.json;
    sandboxEditors.html.value = files.html;
    sandboxEditors.css.value = files.css;
    setActiveSandboxTab("json");
    syncFeatureHelperChecks();
    generateMockData();
    renderSandbox();
    setAutosaveStatus(`Loaded ${project.folder}`);

    if (sandboxEditors.projectStatus) {
        sandboxEditors.projectStatus.textContent = `Loaded ${files.files.html}, ${files.files.css}, and template.json from ${project.folder}.`;
        sandboxEditors.projectStatus.classList.remove("warn");
    }
}

async function fetchTemplateProject(folder) {
    const base = `../${encodeURIComponent(folder)}`;
    const jsonResponse = await fetch(`${base}/template.json`, { cache: "no-store" });
    if (!jsonResponse.ok) throw new Error(`template.json returned ${jsonResponse.status}`);

    const json = await jsonResponse.text();
    const template = JSON.parse(json);
    const htmlFile = template.html || "index.html";
    const cssFile = template.css || "style.css";
    const encodeFilePath = (path) => String(path).split("/").map(encodeURIComponent).join("/");

    const [htmlResponse, cssResponse] = await Promise.all([
        fetch(`${base}/${encodeFilePath(htmlFile)}`, { cache: "no-store" }),
        fetch(`${base}/${encodeFilePath(cssFile)}`, { cache: "no-store" })
    ]);

    if (!htmlResponse.ok) throw new Error(`${htmlFile} returned ${htmlResponse.status}`);
    if (!cssResponse.ok) throw new Error(`${cssFile} returned ${cssResponse.status}`);

    return {
        json,
        html: await htmlResponse.text(),
        css: await cssResponse.text(),
        files: { html: htmlFile, css: cssFile }
    };
}

function loadDemo() {
    if (sandboxEditors.project) sandboxEditors.project.value = "";
    sandboxEditors.json.value = pretty(sandboxDemo.json);
    sandboxEditors.html.value = sandboxDemo.html;
    sandboxEditors.css.value = sandboxDemo.css;
    setActiveSandboxTab("json");
    applyFeatureHelper("feelings", true);
    syncFeatureHelperChecks();
    generateMockData();
    renderSandbox();
}

function copyRenderedHtml(button) {
    const oldText = button.innerText;

    function markCopied() {
        button.innerText = "Copied";
        button.classList.add("copied");
        setTimeout(() => {
            button.innerText = oldText;
            button.classList.remove("copied");
        }, 1200);
    }

    function markFailed() {
        button.innerText = "Copy failed";
        setTimeout(() => {
            button.innerText = oldText;
        }, 1200);
    }

    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(lastRenderedHtml).then(markCopied).catch(() => {
            if (fallbackCopy(lastRenderedHtml)) markCopied();
            else markFailed();
        });
        return;
    }

    if (fallbackCopy(lastRenderedHtml)) markCopied();
    else markFailed();
}

function fallbackCopy(text) {
    const fallback = document.createElement("textarea");
    fallback.value = text;
    fallback.setAttribute("readonly", "");
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    document.body.appendChild(fallback);
    fallback.select();

    let copied = false;
    try {
        copied = document.execCommand("copy");
    } catch {
        copied = false;
    }

    fallback.remove();
    return copied;
}

document.addEventListener("click", (event) => {
    const tabButton = event.target.closest("[data-sandbox-tab]");
    if (tabButton) {
        setActiveSandboxTab(tabButton.dataset.sandboxTab);
        return;
    }

    const actionButton = event.target.closest("[data-sandbox-action]");
    if (!actionButton) return;

    const action = actionButton.dataset.sandboxAction;
    if (action === "load-demo") loadDemo();
    if (action === "validate") validateSandbox();
    if (action === "render") renderSandbox();
    if (action === "generate-mock") {
        generateMockData();
        renderSandbox();
    }
    if (action === "copy-preview-html") copyRenderedHtml(actionButton);
});

document.addEventListener("change", (event) => {
    const projectSelect = event.target.closest("[data-template-project]");
    if (projectSelect) {
        loadTemplateProject(projectSelect.value);
        return;
    }

    const helperToggle = event.target.closest("[data-feature-helper]");
    if (helperToggle) {
        applyFeatureHelper(helperToggle.dataset.featureHelper, helperToggle.checked);
        saveSandboxState();
    }
});

["json", "html", "css", "mock"].forEach((key) => {
    sandboxEditors[key].addEventListener("input", () => {
        if (key === "json") syncFeatureHelperChecks();
        window.clearTimeout(sandboxEditors[key]._sandboxTimer);
        setAutosaveStatus("Saving...");
        sandboxEditors[key]._sandboxTimer = window.setTimeout(renderSandbox, 350);
    });
});

populateTemplateProjects();

if (restoreSandboxState()) {
    syncFeatureHelperChecks();
    renderSandbox();
} else {
    loadDemo();
}
