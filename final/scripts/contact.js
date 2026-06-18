const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

const cleanValue = (formData, fieldName) => String(formData.get(fieldName) ?? "").trim();

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        if (!contactForm.checkValidity()) {
            event.preventDefault();
            formStatus.textContent = "Please complete the required fields before sending your message.";
            contactForm.reportValidity();
            return;
        }

        const formData = new FormData(contactForm);
        const firstName = cleanValue(formData, "firstName");
        const lastName = cleanValue(formData, "lastName");
        const visitorName = `${firstName} ${lastName}`.trim();
        const visitorEmail = cleanValue(formData, "email");
        const favoriteTemple = cleanValue(formData, "favoriteTemple");

        try {
            localStorage.setItem("visitorName", visitorName);
            localStorage.setItem("visitorEmail", visitorEmail);
            localStorage.setItem("favoriteTemple", favoriteTemple);
        } catch (error) {
            console.warn("Visitor preferences could not be saved in local storage.", error);
        }
    });

    contactForm.addEventListener("input", () => {
        if (formStatus) {
            formStatus.textContent = "";
        }
    });
}
