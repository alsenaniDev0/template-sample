async function copyFromButton(button) {
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

document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-copy]");
    if (button) copyFromButton(button);
});
