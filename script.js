document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('section');
    let currentSection = 0;

    function updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        const progress = ((currentSection + 1) / sections.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function showSection(index) {
        sections[currentSection].classList.add('hidden');
        sections[index].classList.remove('hidden');
        currentSection = index;
        updateProgressBar();
    }

    function showNextSection(nextSectionId) {
        const currentSectionElement = sections[currentSection];
        const nextSectionElement = document.getElementById(nextSectionId);

        if (!validateSection(currentSectionElement)) {
            showWarning(currentSectionElement);
            return;
        }

        showSection(Array.from(sections).indexOf(nextSectionElement));
    }

    function showPreviousSection(previousSectionId) {
        const previousSectionElement = document.getElementById(previousSectionId);
        showSection(Array.from(sections).indexOf(previousSectionElement));
    }

    function validateSection(section) {
        const requiredFields = section.querySelectorAll('[required]');
        let valid = true;

        requiredFields.forEach(field => {
            if (!field.value || (field.type === 'checkbox' && !field.checked) || (field.type === 'radio' && !section.querySelector(`input[name="${field.name}"]:checked`))) {
                valid = false;
            }
        });

        return valid;
    }

    function showWarning(section) {
        section.classList.add('warning');
        const warning = section.querySelector('.warning');
        if (warning) {
            warning.classList.remove('hidden');
        }
    }

    document.getElementById('registration-form').addEventListener('submit', function (event) {
        if (!validateSection(sections[currentSection])) {
            event.preventDefault();
            showWarning(sections[currentSection]);
        }
    });

    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
        input.addEventListener('click', function () {
            const checkmark = this.nextElementSibling;
            if (checkmark && checkmark.classList.contains('checkmark')) {
                checkmark.classList.toggle('checked');
            }
        });
    });

    document.getElementById('diet').addEventListener('change', function () {
        const otherInput = document.getElementById('diet-other');
        if (this.value === 'other') {
            otherInput.classList.remove('hidden');
            otherInput.required = true;
        } else {
            otherInput.classList.add('hidden');
            otherInput.required = false;
        }
    });

    document.getElementById('other-pronouns').addEventListener('change', function () {
        const otherInput = document.getElementById('other-pronouns-input');
        if (this.checked) {
            otherInput.classList.remove('hidden');
            otherInput.required = true;
        } else {
            otherInput.classList.add('hidden');
            otherInput.required = false;
        }
    });

    window.showNextSection = showNextSection;
    window.showPreviousSection = showPreviousSection;
    window.validateEmail = function () {
        const emailField = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(emailField.value)) {
            emailError.textContent = 'Please enter a valid email address.';
            emailField.classList.add('warning');
        } else {
            emailError.textContent = '';
            emailField.classList.remove('warning');
        }
    };

    window.updateCharCount = function (textareaId, charCountId) {
        const textarea = document.getElementById(textareaId);
        const charCountElement = document.getElementById(charCountId);
        const maxLength = textarea.maxLength;
        const currentLength = textarea.value.replace(/\s/g, '').length;
        charCountElement.textContent = `${currentLength}/${maxLength}`;
    };

    updateProgressBar();
});
