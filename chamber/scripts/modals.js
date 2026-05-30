/* ............. NP MEMBERSHIP ............. */

const npButton = document.querySelector("#open-np");
const npModal = document.querySelector("#np-modal");

/* ............. BRONZE MEMBERSHIP ............. */

const bronzeButton = document.querySelector("#open-bronze");
const bronzeModal = document.querySelector("#bronze-modal");

/* ............. SILVER MEMBERSHIP ............. */

const silverButton = document.querySelector("#open-silver");
const silverModal = document.querySelector("#silver-modal");

/* ............. GOLD MEMBERSHIP ............. */

const goldButton = document.querySelector("#open-gold");
const goldModal = document.querySelector("#gold-modal");


/* ............. OPEN MODALS ............. */

if (npButton && npModal) {
    npButton.addEventListener("click", () => {
        npModal.showModal();
    });
}

if (bronzeButton && bronzeModal) {
    bronzeButton.addEventListener("click", () => {
        bronzeModal.showModal();
    });
}

if (silverButton && silverModal) {
    silverButton.addEventListener("click", () => {
        silverModal.showModal();
    });
}

if (goldButton && goldModal) {
    goldButton.addEventListener("click", () => {
        goldModal.showModal();
    });
}


/* ............. CLOSE MODALS ............. */

const closeButtons = document.querySelectorAll(".close-modal");

closeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const dialog = button.closest("dialog");

        if (dialog) {
            dialog.close();
        }
    });
});


/* ............. CLICK OUTSIDE TO CLOSE ............. */

const dialogs = document.querySelectorAll("dialog");

dialogs.forEach(dialog => {
    dialog.addEventListener("click", event => {

        const rect = dialog.getBoundingClientRect();

        const isInside =
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width;

        if (!isInside) {
            dialog.close();
        }
    });
});