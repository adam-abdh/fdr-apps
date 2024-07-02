document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');

    form.addEventListener('submit', handleSubmit);
    document.querySelectorAll('button[type="button"]').forEach(button => {
        button.addEventListener('click', handleNavigation);
    });

    document.getElementById('email').addEventListener('input', validateEmail);

    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        });
    });
});

function handleNavigation(event) {
    const targetId = event.target.getAttribute('onclick').match(/'(.*)'/)[1];
    showSection(targetId);
}

function showSection(sectionId) {
    document.querySelector('section:not(.hidden)').classList.add('hidden');
    const nextSection = document.getElementById(sectionId);
    nextSection.classList.remove('hidden');
    nextSection.classList.add('fade-in');
    window.scrollTo(0, 0);
}

function handleSubmit(event) {
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            displayError(field, 'This field is required.');
        } else {
            clearError(field);
        }
    });

    if (!isValid) {
        event.preventDefault();
    } else {
        alert('Thanks for applying to FDRMUN 25. You will soon receive an email with an fdrID identifier required to track your application, for correspondence, diploma authentication, and for entry on the 22nd. If you don\'t see it within the next 24 hours, please check your spam folder.');
    }
}

function displayError(field, message) {
    field.parentElement.style.border = `1px solid var(--error-color)`;
    let errorMessage = field.parentElement.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `<span class="error-icon">⚠️</span> ${message}`;
        field.parentElement.appendChild(errorMessage);
    }
}

function clearError(field) {
    field.parentElement.style.border = `1px solid var(--border-color)`;
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function validateEmail() {
    const email = document.getElementById('email').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        displayError(document.getElementById('email'), 'Please enter a valid email address.');
    } else {
        clearError(document.getElementById('email'));
    }
}

function updateCharCount(textareaId, charCountId) {
    const textarea = document.getElementById(textareaId);
    const charCount = document.getElementById(charCountId);
    charCount.textContent = `${textarea.value.replace(/\s/g, '').length}/${textarea.maxLength}`;
}
