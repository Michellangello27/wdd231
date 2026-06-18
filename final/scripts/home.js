/* .......................
   HOME PAGE
   Walking with Purpose
   ...................... */

document.addEventListener(
    "DOMContentLoaded",
    initializeHome
);

/* ..................
   INITIALIZE HOME
   ................. */

async function initializeHome() {

    try {

        await displayFeaturedScripture();

        await displayFeaturedTemple();

        await displayFeaturedResource();

    } catch (error) {

        console.error(
            "Home Initialization Error:",
            error
        );
    }
}

/* ................
   FEATURED SCRIPTURE
   ................... */

async function displayFeaturedScripture() {

    try {

        const response =
            await fetch(
                "data/scriptures.json"
            );

        const scriptures =
            await response.json();

        const scripture =
            scriptures.find(
                item =>
                    item.reference ===
                    "3 Nephi 11:10-11"
            );

        const container =
            document.getElementById(
                "featured-scripture-container"
            );

        container.innerHTML = `
            <article class="scripture-card">
                <h3>
                    ${scripture.title}
                </h3>
                <p>
                    ${scripture.verse}
                </p>
                <p>
                    <strong>
                        ${scripture.reference}
                    </strong>
                </p>
                <p>
                    ${scripture.source}
                </p>
            </article>
        `;

    } catch (error) {

        console.error(
            "Featured Scripture Error:",
            error
        );
    }
}

/* ..................
   FEATURED TEMPLE
   ................ */
async function displayFeaturedTemple() {
    try {
        const response =
            await fetch(
                "data/temples.json"
            );
        const temples =
            await response.json();
        /* ...... RANDOM FEATURED TEMPLE .... */
        const featuredTemples =
            temples.filter(
                item =>
                    item.featured === true
            );
        const temple =
            featuredTemples[
            Math.floor(
                Math.random() *
                featuredTemples.length
            )
            ];
        const weather =
            await getTempleWeather(
                temple.lat,
                temple.lon
            );
        const imagePath =
            getTempleImage(
                temple
            );
        const container =
            document.getElementById(
                "featured-temple-container"
            );
        container.innerHTML = `
            <article class="featured-temple-card">
                <img
                    src="${imagePath}"
                    alt="${temple.name}"
                    loading="lazy">
                <div class="featured-temple-content">
                    <h3>
                        ${temple.name}
                    </h3>
                    <p class="temple-location">
                        ${temple.city},
                        ${temple.country}
                    </p>
                    <div class="temple-weather">
                        <img
                            src="${weather.icon}"
                            alt="${weather.description}"
                            class="weather-icon">
                        <span>
                            ${weather.temperature}°C -
                            ${weather.description}
                        </span>
                    </div>
                    <p class="temple-description">
                        ${temple.description}
                    </p>
                </div>
            </article>
        `;

    } catch (error) {
        console.error(
            "Featured Temple Error:",
            error
        );
    }
}

/* ...................
   FEATURED RESOURCE
   ..................... */
async function displayFeaturedResource() {

    try {

        const response =
            await fetch(
                "data/resources.json"
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load resources."
            );
        }

        const resources =
            await response.json();

        const featuredResources =
            resources.filter(
                resource =>
                    resource.featured
            );

        if (!featuredResources.length)
            return;

        const resource =
            featuredResources[
            Math.floor(
                Math.random() *
                featuredResources.length
            )
            ];

        const container =
            document.querySelector(
                "#featured-resource-container"
            );

        container.innerHTML = `
            <article class="featured-resource-card">
                <img
                    src="${resource.image}"
                    alt="${resource.title}"
                    loading="lazy">
                <div class="featured-resource-content">
                    <span class="resource-category">
                        ${resource.category}
                    </span>
                    <h3>
                        ${resource.title}
                    </h3>
                    <p>
                        ${resource.description}
                    </p>
                    <a
                        href="${resource.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="button-primary">
                        Visit Resource
                    </a>
                </div>
            </article>
        `;
    } catch (error) {

        console.error(
            "Featured Resource Error:",
            error
        );
    }
}