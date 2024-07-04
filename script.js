document.addEventListener("DOMContentLoaded", function () {
    updateProgressBar();

    const form = document.getElementById("registration-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        validateForm();
    });

    const pronounsOther = document.getElementById("other-pronouns");
    const pronounsOtherText = document.getElementById("other-pronouns-text");
    pronounsOther.addEventListener("change", function () {
        pronounsOtherText.classList.toggle("hidden", !pronounsOther.checked);
    });

    const dietOther = document.getElementById("diet");
    const dietOtherText = document.getElementById("diet-other-text");
    dietOther.addEventListener("change", function () {
        dietOtherText.classList.toggle("hidden", dietOther.value !== "other");
    });
});

function updateCharCount(textareaId, countId) {
    const textarea = document.getElementById(textareaId);
    const countDisplay = document.getElementById(countId);
    const charCount = textarea.value.replace(/\s/g, '').length;
    countDisplay.textContent = `${charCount}/${textarea.maxLength}`;
}

function showNextSection(sectionId) {
    const currentSection = document.querySelector("section:not(.hidden)");
    const nextSection = document.getElementById(sectionId);
    if (validateSection(currentSection)) {
        currentSection.classList.add("hidden");
        nextSection.classList.remove("hidden");
        updateProgressBar();
    }
}

function showPreviousSection(sectionId) {
    const currentSection = document.querySelector("section:not(.hidden)");
    currentSection.classList.add("hidden");
    document.getElementById(sectionId).classList.remove("hidden");
    updateProgressBar();
}

function handleStudentGroupNext() {
    const studentGroup = document.querySelector('input[name="student-group"]:checked');
    if (studentGroup && studentGroup.value === "yes") {
        showNextSection("student-delegation");
    } else {
        showNextSection("school-group-delegation");
    }
}

function handleSchoolRepNext() {
    showNextSection("special-arrangements");
}

function handleSpecialArrangementsNext() {
    const specialArrangements = document.querySelector('input[name="special-arrangements"]:checked');
    if (specialArrangements && specialArrangements.value === "yes") {
        showNextSection("special-guidance");
    } else {
        showNextSection("mun-experience");
    }
}

function handleOtherInfoNext() {
    showNextSection("mun-experience");
}

function handleStudentSpecialArrangementsNext() {
    showNextSection("mun-experience");
}

function handlePreviousButton() {
    const currentSection = document.querySelector("section:not(.hidden)").id;
    if (currentSection === "mun-experience") {
        const specialArrangements = document.querySelector('input[name="special-arrangements"]:checked');
        if (specialArrangements && specialArrangements.value === "yes") {
            showPreviousSection("special-guidance");
        } else {
            showPreviousSection("special-arrangements");
        }
    } else {
        showPreviousSection("student-group-delegation");
    }
}

function validateEmail() {
    const emailField = document.getElementById("email");
    const emailError = document.getElementById("email-error");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
        emailError.textContent = "Please enter a valid email address.";
        emailField.classList.add("error");
    } else {
        emailError.textContent = "";
        emailField.classList.remove("error");
    }
}

function validateSection(section) {
    let valid = true;
    const requiredFields = section.querySelectorAll("[required]");
    requiredFields.forEach(field => {
        if (!field.value || (field.type === "checkbox" && !field.checked) || (field.type === "radio" && !section.querySelector(`input[name="${field.name}"]:checked`))) {
            valid = false;
            field.classList.add("error");
        } else {
            field.classList.remove("error");
        }
    });
    const warning = section.querySelector(".warning");
    if (warning) {
        warning.classList.toggle("hidden", valid);
    }
    return valid;
}

function validateForm() {
    const sections = document.querySelectorAll("section");
    let valid = true;
    sections.forEach(section => {
        if (!validateSection(section)) {
            valid = false;
        }
    });
    if (valid) {
        // Form can be submitted here
        alert("Form submitted successfully!");
    }
}

function updateProgressBar() {
    const sections = document.querySelectorAll("section");
    const totalSections = sections.length;
    let completedSections = 0;
    sections.forEach(section => {
        if (!section.classList.contains("hidden")) {
            completedSections++;
        }
    });
    const progressBar = document.getElementById("progress-bar");
    const progress = (completedSections / totalSections) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;
}
