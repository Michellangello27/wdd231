/* ....................
   TEMPLE IMAGE HELPER
....................... */

function getTempleImage(temple) {

    switch (temple.status) {

        case "Operating":
            return temple.image;

        case "Under Construction":
            return "images/temples/under-construction-temple.webp";

        case "Announced":
            return "images/temples/announced-temple.webp";

        default:
            return "images/temples/announced-temple.webp";
    }
}