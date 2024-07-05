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

    function showPreviousSection(prevSectionId) {
        const prevSectionElement = document.getElementById(prevSectionId);
        showSection(Array.from(sections).indexOf(prevSectionElement));
    }

    function validateSection(section) {
        const inputs = section.querySelectorAll('input, select, textarea');
        for (let input of inputs) {
            if (input.required && !input.value.trim()) {
                return false;
            }
        }
        return true;
    }

    function showWarning(section) {
        const warning = section.querySelector('.warning');
        if (warning) {
            warning.classList.remove('hidden');
            setTimeout(() => {
                warning.classList.add('hidden');
            }, 3000);
        }
    }

    function updateCharCount(textareaId, counterId) {
        const textarea = document.getElementById(textareaId);
        const counter = document.getElementById(counterId);
        const maxLength = textarea.maxLength;
        const currentLength = textarea.value.length;
        counter.textContent = `${currentLength}/${maxLength}`;
    }

    function validateEmail() {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address.';
            emailInput.classList.add('error');
        } else {
            emailError.textContent = '';
            emailInput.classList.remove('error');
        }
    }

    document.getElementById('registration-form').addEventListener('submit', function (event) {
        const lastSection = sections[sections.length - 1];
        if (!validateSection(lastSection)) {
            showWarning(lastSection);
            event.preventDefault();
        }
    });

    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
        const container = input.closest('.checkbox-container, .radio-button');
        if (container) {
            container.addEventListener('click', () => {
                input.checked = !input.checked;
            });
        }
    });

    document.querySelectorAll('input[type="radio"]').forEach(input => {
        const container = input.closest('.radio-button');
        if (container) {
            container.addEventListener('click', () => {
                input.checked = true;
            });
        }
    });

    document.getElementById('other-pronouns').addEventListener('change', function () {
        const otherPronounsText = document.getElementById('other-pronouns-text');
        if (this.checked) {
            otherPronounsText.classList.remove('hidden');
            otherPronounsText.required = true;
        } else {
            otherPronounsText.classList.add('hidden');
            otherPronounsText.required = false;
        }
    });

    document.getElementById('diet').addEventListener('change', function () {
        const otherDietText = document.getElementById('other-diet-text');
        if (this.value === 'other') {
            otherDietText.classList.remove('hidden');
            otherDietText.required = true;
        } else {
            otherDietText.classList.add('hidden');
            otherDietText.required = false;
        }
    });


    
    updateProgressBar();
    showSection(0);
});
