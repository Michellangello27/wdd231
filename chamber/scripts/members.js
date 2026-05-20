/* ............  BUSINESS DIRECTORY  ................... */

const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

const membersUrl = "data/members.json";

let membersData = [];


/* ..............  FETCH MEMBERS  .................. */

async function loadMembers() {
    if (!membersContainer) return;

    try {
        const response = await fetch(membersUrl);

        if (!response.ok) {
            throw new Error("Unable to fetch members data.");
        }

        const data = await response.json();

        membersData = data.members;

        displayGridMembers();

    } catch (error) {
        console.error("Members fetch error:", error);

        membersContainer.innerHTML = `
            <p>Unable to load business directory at this time.</p>
        `;
    }
}


/* ................  MEMBERSHIP LABEL  .................. */

function getMembershipLabel(level) {
    switch (level) {
        case 1:
            return "Non-Profit";
        case 2:
            return "Silver";
        case 3:
            return "Gold";
        default:
            return "Non-Profit";
    }
}


/* ..............  GRID VIEW  ............... */

function displayGridMembers() {
    membersContainer.innerHTML = "";
    membersContainer.classList.add("grid");
    membersContainer.classList.remove("list");

    membersData.forEach(member => {
        const card = document.createElement("article");
        card.classList.add("member-card");

        const membershipLabel = getMembershipLabel(member.membership);

        card.innerHTML = `
            <img 
            src="${member.image}" 
            alt="${member.name}"
            loading="lazy"
            decoding="async"
            width="400"
            height="250">

           <h3>${member.name}</h3>
            <p>${member.description}</p>

            <p>
                <strong>Address:</strong><br>
                ${member.address}
            </p>

            <p>
                <strong>Phone:</strong><br>
                ${member.phone}
            </p>

            <p>
                <strong>Membership:</strong><br>
                ${membershipLabel}
            </p>

            <a href="${member.website}"
               target="_blank"
               rel="noopener noreferrer">
               Visit Website
            </a>
        `;

        membersContainer.appendChild(card);
    });
}


/* .............  LIST VIEW  ............. */

function displayListMembers() {
    membersContainer.innerHTML = "";
    membersContainer.classList.add("list");
    membersContainer.classList.remove("grid");

    membersData.forEach(member => {
        const row = document.createElement("article");
        row.classList.add("member-card");

        const membershipLabel = getMembershipLabel(member.membership);

        row.innerHTML = `
            <h3>${member.name}</h3>

            <p>${member.address}</p>

            <p>${member.phone}</p>

            <p>${membershipLabel}</p>

            <p>
                <a href="${member.website}"
                   target="_blank"
                   rel="noopener noreferrer">
                   Visit Website
                </a>
            </p>
        `;

        membersContainer.appendChild(row);
    });
}


/* ...............  TOGGLE  ............ */

function setupViewToggle() {
    if (!gridButton || !listButton) return;

    gridButton.addEventListener("click", () => {
        displayGridMembers();

        gridButton.classList.add("active-view");
        listButton.classList.remove("active-view");
    });

    listButton.addEventListener("click", () => {
        displayListMembers();

        listButton.classList.add("active-view");
        gridButton.classList.remove("active-view");
    });
}


/* .............   INIT  ............ */

function initializeDirectory() {
    if (!membersContainer) return;  

    gridButton.classList.add("active-view");

    setupViewToggle();
    loadMembers();
}

initializeDirectory();