/* .......... DOM REFERENCES .......... */
const favoritesGrid = document.querySelector("#favorites-grid");
const emptyState = document.querySelector("#empty-state");
const filterButtons = document.querySelectorAll(".filter-btn");
const totalSaved = document.querySelector("#total-saved");
const operatingCount = document.querySelector("#operating-count");
const announcedCount = document.querySelector("#announced-count");
const favoriteDialog = document.querySelector("#favorite-dialog");
const dialogContent = document.querySelector("#dialog-content");
const closeDialog = document.querySelector("#close-dialog");

const FAVORITES_KEY = "walkingPurposeTempleFavorites";
let favoriteTemples = [];
let activeFilter = "all";

/* .......... LOAD FAVORITES .......... */
async function loadFavorites() {
    try {
        const response = await fetch("data/temples.json");

        if (!response.ok) {
            throw new Error("Unable to load temples.");
        }

        const temples = await response.json();
        const favoriteIds = getFavoriteIds();

        favoriteTemples = temples.filter((temple) => favoriteIds.includes(temple.id));
        updateStatistics(favoriteTemples);
        renderFavorites(favoriteTemples);
        setupEvents();
    } catch (error) {
        console.error("Favorites Error:", error);
        showEmptyState();
    }
}

function setupEvents() {
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.filter;
            updateActiveFilter(button);
            filterFavorites();
        });
    });

    closeDialog.addEventListener("click", () => favoriteDialog.close());

    favoriteDialog.addEventListener("click", (event) => {
        if (event.target === favoriteDialog) {
            favoriteDialog.close();
        }
    });
}

function getFavoriteIds() {
    try {
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
        console.error("Favorite Storage Error:", error);
        return [];
    }
}

function updateStatistics(temples) {
    totalSaved.textContent = temples.length;
    operatingCount.textContent = temples.filter((temple) => getStatusGroup(temple.status) === "operating").length;
    announcedCount.textContent = temples.filter((temple) => getStatusGroup(temple.status) === "announced").length;
}

function updateActiveFilter(activeButton) {
    filterButtons.forEach((button) => {
        const isActive = button === activeButton;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive.toString());
    });
}

/* .......... FILTER FAVORITES .......... */
function filterFavorites() {
    if (activeFilter === "all") {
        renderFavorites(favoriteTemples);
        return;
    }

    const filteredTemples = favoriteTemples.filter((temple) => getStatusGroup(temple.status) === activeFilter);
    renderFavorites(filteredTemples);
}

function getStatusGroup(status) {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus.includes("operating") || normalizedStatus.includes("renovation")) {
        return "operating";
    }

    if (normalizedStatus.includes("announced")) {
        return "announced";
    }

    return "other";
}

/* .......... RENDER FAVORITES .......... */
function renderFavorites(temples) {
    favoritesGrid.innerHTML = "";

    if (!temples.length) {
        showEmptyState(favoriteTemples.length === 0);
        return;
    }

    emptyState.hidden = true;

    const fragment = document.createDocumentFragment();

    temples.forEach((temple) => {
        fragment.appendChild(createFavoriteCard(temple));
    });

    favoritesGrid.appendChild(fragment);
}

function createFavoriteCard(temple) {
    const card = document.createElement("article");
    card.className = "favorite-card";

    card.innerHTML = `
        <div class="favorite-image">
            <img src="${temple.image}" alt="${temple.name}" loading="lazy" width="480" height="300">
        </div>
        <div class="favorite-content">
            <h3>${temple.name}</h3>
            <p class="favorite-location">${temple.city}, ${temple.country}</p>
            <span class="favorite-status status-${getStatusGroup(temple.status)}">${temple.status}</span>
            <p class="favorite-dedication"><strong>Dedicated:</strong> ${formatDedication(temple.dedication)}</p>
            <div class="favorite-actions">
                <button class="details-btn" type="button" data-id="${temple.id}">View Details</button>
                <button class="remove-btn" type="button" data-id="${temple.id}">Remove Favorite</button>
            </div>
        </div>
    `;

    const image = card.querySelector("img");
    image.addEventListener("error", () => {
        image.src = "images/temples/announced-temple.webp";
    }, { once: true });

    card.querySelector(".details-btn").addEventListener("click", () => openDetails(temple));
    card.querySelector(".remove-btn").addEventListener("click", () => removeFavorite(temple.id));

    return card;
}

function openDetails(temple) {
    dialogContent.innerHTML = `
        <div class="dialog-image">
            <img src="${temple.image}" alt="${temple.name}" width="760" height="320">
        </div>
        <div class="dialog-body">
            <h2 id="dialog-title">${temple.name}</h2>
            <p>${temple.city}, ${temple.country}</p>
            <span class="dialog-status status-${getStatusGroup(temple.status)}">${temple.status}</span>
            <p><strong>Dedicated:</strong> ${formatDedication(temple.dedication)}</p>
            <p><strong>Area:</strong> ${temple.area > 0 ? temple.area.toLocaleString() : "TBD"} sq ft</p>
            <p class="dialog-description">${temple.description}</p>
        </div>
    `;

    favoriteDialog.showModal();
}

function showEmptyState(isFavoritesEmpty = true) {
    favoritesGrid.innerHTML = "";
    emptyState.hidden = false;

    const title = emptyState.querySelector("h2");
    const message = emptyState.querySelector("p");
    const link = emptyState.querySelector(".explore-btn");

    if (isFavoritesEmpty) {
        title.innerHTML = "<span aria-hidden=\"true\">❤️</span> No Favorite Temples Yet";
        message.textContent = "Visit the Temples page and save your first temple.";
        link.hidden = false;
    } else {
        title.textContent = "No favorites match this filter";
        message.textContent = "Choose another filter to see your saved temples.";
        link.hidden = true;
    }
}

/* .......... REMOVE FAVORITE .......... */
function removeFavorite(templeId) {
    const updatedIds = getFavoriteIds().filter((id) => id !== templeId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedIds));

    favoriteTemples = favoriteTemples.filter((temple) => temple.id !== templeId);
    updateStatistics(favoriteTemples);
    filterFavorites();
}

function formatDedication(dedication) {
    if (!dedication || dedication === "TBD") {
        return "TBD";
    }

    const date = new Date(`${dedication}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return dedication;
    }

    return new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric"
    }).format(date);
}

loadFavorites();

