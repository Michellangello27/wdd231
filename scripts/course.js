const courses = [
    {
        subject: "CSE",
        number: 110,
        title: "Introduction to Programming",
        credits: 2,
        certificate: "Web and Computer Programming",
        description: "Introduction to programming concepts including variables, logic, functions, and problem solving.",
        technology: ["Python"],
        completed: true
    },
    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        certificate: "Web and Computer Programming",
        description: "Students learn the foundational principles of web development using semantic HTML and CSS.",
        technology: ["HTML", "CSS"],
        completed: true
    },
    {
        subject: "CSE",
        number: 111,
        title: "Programming with Functions",
        credits: 2,
        certificate: "Web and Computer Programming",
        description: "Builds on introductory programming with modular programming and reusable functions.",
        technology: ["Python"],
        completed: true
    },
    {
        subject: "CSE",
        number: 210,
        title: "Programming with Classes",
        credits: 2,
        certificate: "Web and Computer Programming",
        description: "Object-oriented programming concepts using classes, encapsulation, and structured design.",
        technology: ["C++"],
        completed: true
    },
    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        certificate: "Web and Computer Programming",
        description: "Students learn responsive layouts, DOM manipulation, and modern frontend practices.",
        technology: ["HTML", "CSS", "JavaScript"],
        completed: false
    },
    {
        subject: "WDD",
        number: 231,
        title: "Web Frontend Development I",
        credits: 2,
        certificate: "Web and Computer Programming",
        description: "This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.",
        technology: ["HTML", "CSS", "JavaScript"],
        completed: false
    }
];

const coursesContainer = document.querySelector("#courses-container");
const courseCount = document.querySelector("#course-count");
const approvedCredits = document.querySelector("#approved-credits");

const allButton = document.querySelector("#all-btn");
const wddButton = document.querySelector("#wdd-btn");
const cseButton = document.querySelector("#cse-btn");

function displayCourses(courseList) {
    coursesContainer.innerHTML = "";

    courseList.forEach(course => {
        const card = document.createElement("article");

        card.classList.add("course-card");

        if (course.completed) {
            card.classList.add("course-completed");
        }

        const checkmark = course.completed ? "✓ " : "";

        card.innerHTML = `
            <h3>${checkmark}${course.subject} ${course.number}</h3>
            <p><strong>${course.title}</strong></p>
            <p>${course.certificate}</p>
            <p>${course.description}</p>
            <p><strong>Credits:</strong> ${course.credits}</p>
            <p><strong>Technology:</strong> ${course.technology.join(", ")}</p>
            <p><strong>Status:</strong> ${course.completed ? "Completed" : "In Progress"}</p>
        `;

        coursesContainer.appendChild(card);
    });

    updateCourseCount(courseList);
    updateApprovedCredits(courseList);
}

function updateCourseCount(courseList) {
    courseCount.textContent = courseList.length;
}

function updateApprovedCredits(courseList) {
    const total = courseList
        .filter(course => course.completed)
        .reduce((sum, course) => sum + course.credits, 0);

    approvedCredits.textContent = total;
}

function updateActiveButton(activeButton) {
    document.querySelectorAll(".filter-btn").forEach(button => {
        button.classList.remove("active-filter");
    });

    activeButton.classList.add("active-filter");
}

allButton.addEventListener("click", () => {
    displayCourses(courses);
    updateActiveButton(allButton);
});

wddButton.addEventListener("click", () => {
    const filteredCourses = courses.filter(course => course.subject === "WDD");
    displayCourses(filteredCourses);
    updateActiveButton(wddButton);
});

cseButton.addEventListener("click", () => {
    const filteredCourses = courses.filter(course => course.subject === "CSE");
    displayCourses(filteredCourses);
    updateActiveButton(cseButton);
});

displayCourses(courses);