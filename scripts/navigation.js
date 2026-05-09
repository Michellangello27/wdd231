// Toggle mobile navigation
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-navigation");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");

    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", !isExpanded);
    menuButton.textContent = isExpanded ? "☰" : "✕";
});