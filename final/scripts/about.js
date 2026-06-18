"use strict";

const menuButton = document.querySelector("#menu-button");
const primaryNavigation = document.querySelector("#primary-navigation");

function setMenuState(isOpen) {
    if (!menuButton || !primaryNavigation) return;

    primaryNavigation.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    const icon = menuButton.querySelector("[aria-hidden='true']");
    if (icon) icon.textContent = isOpen ? "✕" : "☰";
}

if (menuButton && primaryNavigation) {
    menuButton.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
        setMenuState(isOpen);
    });

    primaryNavigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) setMenuState(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
            menuButton.focus();
        }
    });

    const desktopNavigation = window.matchMedia("(min-width: 960px)");
    desktopNavigation.addEventListener("change", (event) => {
        if (event.matches) setMenuState(false);
    });
}

const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent = `Last Modification: ${document.lastModified}`;
}
