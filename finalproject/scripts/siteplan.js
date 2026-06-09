/* ............ SCENARIO DIALOG CONFIGURATION ........... */

const scenarioDialogs = [

    {
        button: "open-scenario-1",
        dialog: "scenario-1-modal"
    },

    {
        button: "open-scenario-2",
        dialog: "scenario-2-modal"
    },

    {
        button: "open-scenario-3",
        dialog: "scenario-3-modal"
    },

    {
        button: "open-scenario-4",
        dialog: "scenario-4-modal"
    },

    {
        button: "open-scenario-5",
        dialog: "scenario-5-modal"
    },

    {
        button: "open-scenario-6",
        dialog: "scenario-6-modal"
    }

];


/* ............ OPEN SCENARIO DIALOGS ........... */

scenarioDialogs.forEach(item => {

    const openButton = document.getElementById(item.button);

    const dialog = document.getElementById(item.dialog);

    if (openButton && dialog) {

        openButton.addEventListener("click", () => {

            dialog.showModal();

        });

    }

});


/* ............ CLOSE DIALOG USING BUTTON ........... */

document.querySelectorAll("dialog").forEach(dialog => {

    const closeButton = dialog.querySelector(".close-modal");

    if (closeButton) {

        closeButton.addEventListener("click", () => {

            dialog.close();

        });

    }

});


/* ............ CLOSE DIALOG WHEN CLICKING OUTSIDE ........... */

document.querySelectorAll("dialog").forEach(dialog => {

    dialog.addEventListener("click", (event) => {

        const dialogDimensions = dialog.getBoundingClientRect();

        const isInDialog =

            dialogDimensions.top <= event.clientY &&
            event.clientY <= dialogDimensions.top + dialogDimensions.height &&

            dialogDimensions.left <= event.clientX &&
            event.clientX <= dialogDimensions.left + dialogDimensions.width;

        if (!isInDialog) {

            dialog.close();

        }

    });

});


/* ............ CONSOLE CONFIRMATION ........... */

console.log(

    "Walking with Purpose Site Plan Loaded Successfully"

);
