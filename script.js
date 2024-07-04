// script.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registration-form');
    const sections = form.querySelectorAll('section');
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    document.body.insertBefore(progressBar, document.querySelector('footer'));

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateForm()) {
            alert('Form submitted successfully!');
        }
    });

    function showSection(index) {
        sections.forEach((section, i) => {
            section.classList.toggle('hidden', i !== index);
        });
        updateProgressBar(index);
    }

    function validateForm() {
        let isValid = true;
        sections.forEach(section => {
            if (!validateSection(section)) {
                isValid = false;
            }
        });
        return isValid;
    }

    function validateSection(section) {
        let isValid = true;
        section.querySelectorAll('[required]').forEach(input => {
            if (!input.value.trim() || (input.type === 'checkbox' && !input.checked)) {
                isValid = false;
                showError(input);
            } else {
                hideError(input);
            }
        });

        section.querySelectorAll('.radio-button input[type="radio"]').forEach(input => {
            const name = input.name;
            const radios = section.querySelectorAll(`input[name="${name}"]`);
            const isAnyChecked = Array.from(radios).some(radio => radio.checked);
            if (!isAnyChecked) {
                isValid = false;
                radios.forEach(radio => showError(radio));
            }
        });

        return isValid;
    }

    function showError(input) {
        const warning = input.closest('.card').querySelector('.warning');
        if (warning) {
            warning.classList.remove('hidden');
        }
        const card = input.closest('.card');
        if (card) {
            card.classList.add('error');
        }
    }

    function hideError(input) {
        const warning = input.closest('.card').querySelector('.warning');
        if (warning) {
            warning.classList.add('hidden');
        }
        const card = input.closest('.card');
        if (card) {
            card.classList.remove('error');
        }
    }

    function updateProgressBar(index) {
        const progressPercentage = ((index + 1) / sections.length) * 100;
        progressBar.style.width = progressPercentage + '%';
        progressBar.textContent = Math.round(progressPercentage) + '%';
    }

    function handleNavigation(sectionId, direction) {
        const currentIndex = getCurrentSectionIndex();
        if (!validateSection(sections[currentIndex])) {
            return;
        }
        const nextIndex = Array.from(sections).findIndex(section => section.id === sectionId);
        if (direction === 'next' && nextIndex > currentIndex) {
            showSection(nextIndex);
        } else if (direction === 'prev' && nextIndex < currentIndex) {
            showSection(nextIndex);
        }
    }

    function getCurrentSectionIndex() {
        return Array.from(sections).findIndex(section => !section.classList.contains('hidden'));
    }

    document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
        textarea.addEventListener('input', function () {
            updateCharCount(textarea.id, textarea.nextElementSibling.id);
        });
    });

    function updateCharCount(textareaId, counterId) {
        const textarea = document.getElementById(textareaId);
        const counter = document.getElementById(counterId);
        const maxLength = parseInt(textarea.getAttribute('maxlength'), 10);
        const currentLength = textarea.value.replace(/\s/g, '').length;
        counter.textContent = `${currentLength}/${maxLength}`;
    }

    window.showNextSection = function (sectionId) {
        handleNavigation(sectionId, 'next');
    };

    window.showPreviousSection = function (sectionId) {
        handleNavigation(sectionId, 'prev');
    };

    showSection(0);
});
