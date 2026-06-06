// ........ IMPORT PLACES DATA ...........

import { places } from "../data/places.mjs";


// ....... DOM REFERENCES ...........

const cardsContainer = document.querySelector("#discover-cards");
const visitMessage = document.querySelector("#visit-message");


// ........ DIALOG REFERENCES ...........

const dialog = document.querySelector("#place-dialog");

const dialogTitle = document.querySelector("#dialog-title");

const dialogImage = document.querySelector("#dialog-image");

const dialogAddress = document.querySelector("#dialog-address");

const dialogDetails = document.querySelector("#dialog-details");

const closeDialog = document.querySelector("#close-dialog");


// .......... CREATE DISCOVER CARDS .........

function displayPlaces(places) {

    places.forEach(place => {

        const card = document.createElement("article");
        card.classList.add("discover-card");


        // ........ PLACE TITLE ...........

        const title = document.createElement("h2");
        title.classList.add("card-name");
        title.textContent = place.name;


        // ......... PLACE IMAGE ...........

        const figure = document.createElement("figure");
        figure.classList.add("card-photo");

        const image = document.createElement("img");

        image.src = `images/${place.image}`;
        image.alt = place.name;
        image.width = 300;
        image.height = 200;
        image.loading = "lazy";

        figure.appendChild(image);


        // ........ PLACE ADDRESS ...........

        const address = document.createElement("address");
        address.classList.add("card-location");
        address.textContent = place.address;


        // ........ PLACE DESCRIPTION ...........

        const description = document.createElement("p");
        description.classList.add("card-description");
        description.textContent = place.description;


        // ........ MORE INFORMATION BUTTON ...........

        const button = document.createElement("button");
        button.classList.add("card-button");

        button.textContent = "Learn More";
        button.type = "button";


        // ........ OPEN PLACE DETAILS ...........

        button.addEventListener("click", () => {

            dialogTitle.textContent =
                place.name;

            dialogImage.src =
                `images/${place.image}`;

            dialogImage.alt =
                place.name;

            dialogAddress.textContent =
                place.address;

            dialogDetails.textContent =
                place.details;

            dialog.showModal();

        });


        // ........ BUILD CARD ...........

        card.appendChild(title);
        card.appendChild(figure);
        card.appendChild(address);
        card.appendChild(description);
        card.appendChild(button);

        cardsContainer.appendChild(card);

    });

}


// ........ DISPLAY PLACES ...........

displayPlaces(places);


// ........ CLOSE DIALOG ...........

closeDialog.addEventListener("click", () => {

    dialog.close();

});


// .......... VISITOR MESSAGE ...........

const millisecondsPerDay = 86400000;

const lastVisit = localStorage.getItem("lastVisit");

const currentVisit = Date.now();


// ........ FIRST VISIT ...........

if (!lastVisit) {

    visitMessage.textContent =
        "Welcome! Let us know if you have any questions.";

} else {

    const daysBetweenVisits = Math.floor(
        (currentVisit - Number(lastVisit)) / millisecondsPerDay
    );


    // ........ LESS THAN ONE DAY ...........

    if (daysBetweenVisits < 1) {

        visitMessage.textContent =
            "Back so soon! Awesome!";

    }

    // ........ ONE DAY OR MORE ...........

    else {

        visitMessage.textContent =
            `Your last visit was ${daysBetweenVisits} ${daysBetweenVisits === 1 ? "day" : "days"} ago.`;

    }
}


// ........ SAVE CURRENT VISIT ...........

localStorage.setItem(
    "lastVisit",
    currentVisit
);