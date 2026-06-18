const parameters = new URLSearchParams(window.location.search);

const getParameter = (name) => {
    const value = parameters.get(name);
    return value?.trim() || "Not provided";
};

const firstName = getParameter("firstName");
const lastName = getParameter("lastName");
const fullName = [firstName, lastName]
    .filter((value) => value !== "Not provided")
    .join(" ") || "Not provided";

const submittedValues = {
    "#submitted-name": fullName,
    "#submitted-email": getParameter("email"),
    "#submitted-country": getParameter("country"),
    "#submitted-temple": getParameter("favoriteTemple"),
    "#submitted-message": getParameter("message")
};

Object.entries(submittedValues).forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
    }
});

const visitorGreeting = document.querySelector("#visitor-greeting");

if (visitorGreeting) {
    visitorGreeting.textContent = firstName === "Not provided" ? "Friend" : firstName;
}
