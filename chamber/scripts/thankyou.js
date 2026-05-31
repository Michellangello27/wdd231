/* ............. THANK YOU PAGE ............. */

const params = new URLSearchParams(window.location.search);
const timestamp = params.get("timestamp");

document.querySelector("#firstName").textContent =
    params.get("firstName") || "Not provided";

document.querySelector("#lastName").textContent =
    params.get("lastName") || "Not provided";

document.querySelector("#organizationTitle").textContent =
    params.get("organizationTitle") || "Not provided";
    
document.querySelector("#email").textContent =
    params.get("email") || "Not provided";

document.querySelector("#phone").textContent =
    params.get("phone") || "Not provided";

document.querySelector("#organization").textContent =
    params.get("organization") || "Not provided";

document.querySelector("#membership").textContent =
    params.get("membershipLevel") || "Not provided";

document.querySelector("#timestamp").textContent =
    timestamp
        ? new Date(timestamp).toLocaleString()
        : "Not provided"; 