/* ............... FEATURED BUSINESSES .................. */

const featuredContainer = document.querySelector("#featured-businesses");
const membersDataUrl = "data/members.json";


/* ............... SHUFFLE UTILITY .................. */

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}


/* .................. FETCH MEMBERS .................... */

async function loadFeaturedBusinesses() {
    if (!featuredContainer) return;

    try {
        const response = await fetch(membersDataUrl);

        if (!response.ok) {
            throw new Error("Unable to fetch members data.");
        }

        const data = await response.json();

        /*
            Membership levels:
            1 = Member
            2 = Silver
            3 = Gold
        */

        const eligibleMembers = data.members.filter(
            member => member.membership >= 2
        );

        const featuredMembers = shuffleArray(eligibleMembers).slice(0, 3);

        displayFeaturedBusinesses(featuredMembers);

    } catch (error) {
        console.error("Featured businesses error:", error);

        featuredContainer.innerHTML = `
            <p>Unable to load featured businesses at this time.</p>
        `;
    }
}


/* ............... RENDER FEATURED .................. */

function displayFeaturedBusinesses(members) {
    featuredContainer.innerHTML = "";

    members.forEach(member => {
        const card = document.createElement("article");
        card.classList.add("member-card", "spotlight-card");

        const membershipLevel =
            member.membership === 3
                ? "Gold Member"
                : "Silver Member";

        card.innerHTML = `
            <div class="spotlight-image">
                <img
                    src="${member.image}"
                    alt="${member.name} logo"
                    loading="lazy"
                    width="100"
                    height="100"
                >
            </div>

            <div class="spotlight-content">
                <h3>${member.name}</h3>

                <p class="membership-level">
                    ${membershipLevel}
                </p>

                <p class="spotlight-tagline">
                    ${member.tagline}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${member.email}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${member.phone}
                </p>

                <p>
                    <strong>Website:</strong>
                    <a
                        href="${member.website}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visit Website
                    </a>
                </p>
            </div>
        `;

        featuredContainer.appendChild(card);
    });
}

/* ............... INIT .................. */

loadFeaturedBusinesses();