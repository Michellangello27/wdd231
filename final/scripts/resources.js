const resourceGrid = document.querySelector("#resource-grid");
const searchInput = document.querySelector("#resource-search");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyState = document.querySelector("#empty-state");
const totalResources = document.querySelector("#total-resources");
const scriptureCount = document.querySelector("#scripture-count");
const guideCount = document.querySelector("#guide-count");
const videoCount = document.querySelector("#video-count");

let resources = [];
let activeFilter = "all";

async function initializeResources() {
    try {
        const [resourcesResponse, videosResponse] = await Promise.all([
            fetch("data/resources.json"),
            fetch("data/videos.json")
        ]);

        if (!resourcesResponse.ok || !videosResponse.ok) {
            throw new Error("Unable to load learning resources.");
        }

        const resourceData = await resourcesResponse.json();
        const videoData = await videosResponse.json();

        const learningResources = resourceData.map(normalizeResource);
        const videoResources = videoData.map(normalizeVideo);

        resources = [...learningResources, ...videoResources].sort((a, b) => {
            if (a.filterType === b.filterType) {
                return a.title.localeCompare(b.title);
            }

            return a.filterType.localeCompare(b.filterType);
        });

        updateStats(resources);
        renderResources(resources);
        setupEvents();
    } catch (error) {
        console.error("Resources Error:", error);
        showLoadError();
    }
}

function normalizeResource(resource) {
    const category = resource.category.toLowerCase();
    let type = "Guides";

    if (category.includes("scripture")) {
        type = "Scriptures";
    } else if (category.includes("conference") || category.includes("jesus christ")) {
        type = "Articles";
    }

    return {
        ...resource,
        source: resource.category,
        type,
        filterType: type.toLowerCase(),
        image: resource.image || getResourceImage(resource.category)
    };
}

function normalizeVideo(video) {
    return {
        id: `video-${video.id}`,
        category: video.category,
        title: video.title,
        source: video.source,
        url: video.url,
        image: getResourceImage(video.category),
        description: video.description,
        featured: video.featured,
        priority: video.priority,
        type: "Videos",
        filterType: "videos"
    };
}

function getResourceImage(category) {
    const normalizedCategory = category.toLowerCase();

    if (normalizedCategory.includes("family")) {
        return "images/resources/family-search.webp";
    }

    if (normalizedCategory.includes("temple")) {
        return "images/resources/temple-locator.webp";
    }

    if (normalizedCategory.includes("scripture") || normalizedCategory.includes("restoration")) {
        return "images/resources/sacred-scriptures.webp";
    }

    if (normalizedCategory.includes("jesus")) {
        return "images/resources/the-living-christ.webp";
    }

    return "images/resources/gospel-library.webp";
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
}

function updateActiveFilter(activeButton) {
    filterButtons.forEach((button) => {
        const isActive = button === activeButton;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive.toString());
    });
}

function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredResources = resources.filter((resource) => {
        const matchesFilter = activeFilter === "all" || resource.filterType === activeFilter;
        const matchesSearch = [resource.title, resource.type, resource.category, resource.source, resource.description]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm);

        return matchesFilter && matchesSearch;
    });

    renderResources(filteredResources);
}

function updateStats(resourceList) {
    totalResources.textContent = resourceList.length;
    scriptureCount.textContent = resourceList.filter((resource) => resource.filterType === "scriptures").length;
    guideCount.textContent = resourceList.filter((resource) => resource.filterType === "guides").length;
    videoCount.textContent = resourceList.filter((resource) => resource.filterType === "videos").length;
}

function renderResources(resourceList) {
    resourceGrid.innerHTML = "";
    emptyState.hidden = resourceList.length > 0;

    const fragment = document.createDocumentFragment();

    resourceList.forEach((resource) => {
        fragment.appendChild(createResourceCard(resource));
    });

    resourceGrid.appendChild(fragment);
}

function createResourceCard(resource) {
    const card = document.createElement("article");
    card.className = `resource-card ${resource.filterType === "videos" ? "video-card" : ""}`.trim();

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "resource-image";

    const image = document.createElement("img");
    image.src = resource.image;
    image.alt = resource.title;
    image.loading = "lazy";
    image.width = 480;
    image.height = 300;
    image.addEventListener("error", () => {
        image.src = "images/resources/temple-locator.webp";
    }, { once: true });

    if (resource.filterType === "videos") {
        const playBadge = document.createElement("span");
        playBadge.className = "video-badge";
        playBadge.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i><span class="visually-hidden">Video</span>';
        imageWrapper.append(image, playBadge);
    } else {
        imageWrapper.appendChild(image);
    }

    const content = document.createElement("div");
    content.className = "resource-content";

    const type = document.createElement("span");
    type.className = "resource-type";
    type.textContent = resource.type;

    const title = document.createElement("h3");
    title.textContent = resource.title;

    const source = document.createElement("p");
    source.className = "resource-source";
    source.textContent = resource.source;

    const description = document.createElement("p");
    description.textContent = resource.description;

    const link = createResourceLink(resource);

    content.append(type, title, source, description, link);
    card.append(imageWrapper, content);

    return card;
}

function createResourceLink(resource) {
    if (!resource.url) {
        const unavailable = document.createElement("span");
        unavailable.className = "resource-link resource-link-disabled";
        unavailable.textContent = "Coming Soon";
        unavailable.setAttribute("aria-disabled", "true");
        return unavailable;
    }

    const link = document.createElement("a");
    link.className = "resource-link";
    link.href = resource.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = resource.filterType === "videos" ? "Watch Video" : "Learn More";
    link.setAttribute("aria-label", `${link.textContent} about ${resource.title}`);

    return link;
}

function showLoadError() {
    resourceGrid.innerHTML = "";
    emptyState.hidden = false;
    emptyState.querySelector("h2").textContent = "Resources could not be loaded";
    emptyState.querySelector("p").textContent = "Please try refreshing the page.";
}

initializeResources();
