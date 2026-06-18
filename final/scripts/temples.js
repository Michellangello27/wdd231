const templeGrid = document.querySelector("#temple-grid");
const searchInput = document.querySelector("#search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyState = document.querySelector("#temple-empty");
const templeDialog = document.querySelector("#temple-dialog");
const dialogContent = document.querySelector("#dialog-content");
const closeDialog = document.querySelector("#close-dialog");
const totalTemples = document.querySelector("#total-temples");
const operatingCount = document.querySelector("#operating-count");
const constructionCount = document.querySelector("#construction-count");
const announcedCount = document.querySelector("#announced-count");

const FAVORITES_KEY = "walkingPurposeTempleFavorites";

let allTemples = [];
let activeFilter = "all";
let favoriteTempleIds = getFavoriteTempleIds();

async function initializeTemples() {
    try {
        const response = await fetch("data/temples.json");

        if (!response.ok) {
            throw new Error("Unable to load temple data.");
        }

        allTemples = await response.json();
        updateStatistics(allTemples);
        renderTemples(allTemples);
        setupEvents();
    } catch (error) {
        console.error("Temple Explorer Error:", error);
        showLoadError();
    }
}

function setupEvents() {
    searchInput.addEventListener("input", applyFilters);

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.filter;
            updateActiveFilter(button);
            applyFilters();
        });
    });

    closeDialog.addEventListener("click", () => templeDialog.close());

    templeDialog.addEventListener("click", (event) => {
        if (event.target === templeDialog) {
            templeDialog.close();
        }
    });
}

function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredTemples = allTemples.filter((temple) => {
        const matchesFilter = activeFilter === "all" || getStatusGroup(temple.status) === activeFilter;
        const matchesSearch = [temple.name, temple.city, temple.country, temple.status, temple.description]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm);

        return matchesFilter && matchesSearch;
    });

    renderTemples(filteredTemples);
}

function updateActiveFilter(activeButton) {
    filterButtons.forEach((button) => {
        const isActive = button === activeButton;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive.toString());
    });
}

function getStatusGroup(status) {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus.includes("operating") || normalizedStatus.includes("renovation")) {
        return "operating";
    }

    if (normalizedStatus.includes("construction")) {
        return "construction";
    }

    if (normalizedStatus.includes("announced")) {
        return "announced";
    }

    return "all";
}

function updateStatistics(temples) {
    totalTemples.textContent = temples.length;
    operatingCount.textContent = temples.filter((temple) => getStatusGroup(temple.status) === "operating").length;
    constructionCount.textContent = temples.filter((temple) => getStatusGroup(temple.status) === "construction").length;
    announcedCount.textContent = temples.filter((temple) => getStatusGroup(temple.status) === "announced").length;
}

function renderTemples(temples) {
    templeGrid.innerHTML = "";
    emptyState.hidden = temples.length > 0;

    const fragment = document.createDocumentFragment();

    temples.forEach((temple) => {
        fragment.appendChild(createTempleCard(temple));
    });

    templeGrid.appendChild(fragment);
}

function createTempleCard(temple) {
    const card = document.createElement("article");
    card.className = "temple-card";

    const isFavorite = favoriteTempleIds.includes(temple.id);

    card.innerHTML = `
        <div class="temple-image">
            <img src="${temple.image}" alt="${temple.name}" loading="lazy" width="480" height="300">
        </div>
        <div class="temple-content">
            <div class="temple-card-header">
                <h3>${temple.name}</h3>
                <span class="temple-status status-${getStatusGroup(temple.status)}">${temple.status}</span>
            </div>
            <p class="temple-location"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${temple.city}, ${temple.country}</p>
            <p class="temple-dedication"><strong>Dedicated:</strong> ${formatDedication(temple.dedication)}</p>
            <div class="temple-actions">
                <button class="favorite-btn${isFavorite ? " saved" : ""}" type="button" data-id="${temple.id}" aria-pressed="${isFavorite}" aria-label="${isFavorite ? "Remove" : "Add"} ${temple.name} ${isFavorite ? "from" : "to"} favorites">
                    <i class="${isFavorite ? "fa-solid" : "fa-regular"} fa-heart" aria-hidden="true"></i>
                    <span>${isFavorite ? "Saved" : "Favorite"}</span>
                </button>
                <button class="details-btn" type="button" data-id="${temple.id}">
                    Details
                </button>
            </div>
        </div>
    `;

    const image = card.querySelector("img");
    image.addEventListener("error", () => {
        image.src = "images/temples/announced-temple.webp";
    }, { once: true });

    card.querySelector(".favorite-btn").addEventListener("click", () => toggleFavorite(temple.id));
    card.querySelector(".details-btn").addEventListener("click", () => openTempleDialog(temple));

    return card;
}

function openTempleDialog(temple) {
    const isFavorite = favoriteTempleIds.includes(temple.id);
    const mapUrl = `https://www.google.com/maps?q=${temple.lat},${temple.lon}`;

    dialogContent.innerHTML = `
        <div class="dialog-hero">
            <img src="${temple.image}" alt="${temple.name}" width="900" height="420">
            <div class="dialog-hero-overlay">
                <span class="dialog-status status-${getStatusGroup(temple.status)}">${temple.status}</span>
                <h2 id="dialog-title">${temple.name}</h2>
                <p>${temple.city}, ${temple.country}</p>
            </div>
        </div>
        <div class="dialog-body">
            <div class="dialog-grid">
                <article class="dialog-stat">
                    <span>${formatArea(temple.area)}</span>
                    <small>Area sq ft</small>
                </article>
                <article class="dialog-stat">
                    <span>${temple.ordinanceRooms || "TBD"}</span>
                    <small>Ordinance Rooms</small>
                </article>
                <article class="dialog-stat">
                    <span>${formatDedication(temple.dedication)}</span>
                    <small>Dedicated</small>
                </article>
            </div>
            <p class="dialog-description">${temple.description}</p>
            <div class="dialog-actions">
                <a class="dialog-btn dialog-map" href="${mapUrl}" target="_blank" rel="noopener noreferrer">
                    <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>
                    View on Map
                </a>
                <button class="dialog-btn dialog-favorite${isFavorite ? " saved" : ""}" type="button" data-id="${temple.id}" aria-pressed="${isFavorite}">
                    <i class="${isFavorite ? "fa-solid" : "fa-regular"} fa-heart" aria-hidden="true"></i>
                    ${isFavorite ? "Saved Favorite" : "Add to Favorites"}
                </button>
            </div>
        </div>
    `;

    const dialogImage = dialogContent.querySelector(".dialog-hero img");
    dialogImage.addEventListener("error", () => {
        dialogImage.src = "images/temples/announced-temple.webp";
    }, { once: true });

    dialogContent.querySelector(".dialog-favorite").addEventListener("click", () => {
        toggleFavorite(temple.id);
        openTempleDialog(temple);
    });

    templeDialog.showModal();
}

function toggleFavorite(templeId) {
    if (favoriteTempleIds.includes(templeId)) {
        favoriteTempleIds = favoriteTempleIds.filter((id) => id !== templeId);
    } else {
        favoriteTempleIds = [...favoriteTempleIds, templeId];
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteTempleIds));
    applyFilters();
}

function getFavoriteTempleIds() {
    try {
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
        console.error("Favorites Error:", error);
        return [];
    }
}

function formatArea(area) {
    return area > 0 ? area.toLocaleString() : "TBD";
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

function showLoadError() {
    templeGrid.innerHTML = "";
    emptyState.hidden = false;
    emptyState.querySelector("h2").textContent = "Temples could not be loaded";
    emptyState.querySelector("p").textContent = "Please check the data file and refresh the page.";
}

initializeTemples();
