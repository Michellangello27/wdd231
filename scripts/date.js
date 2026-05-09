// Footer year
//const yearSpan = document.getElementById("year");
//if (yearSpan) {
//  yearSpan.textContent = new Date().getFullYear();
//}

//const lastMod = document.getElementById("lastModified");
//if (lastMod) {
//  lastMod.textContent = `Last updated: ${document.lastModified}`;
//}

const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

const today = new Date();

currentYear.textContent = today.getFullYear();

lastModified.textContent = `Last Modified: ${document.lastModified}`;