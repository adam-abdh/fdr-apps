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
    const currentSection = document.querySelector('section:not(.hidden)');
    const button = event.target;

    if (button.hasAttribute('data-next')) {
        const nextSectionId = button.getAttribute('data-next');
        const validationFunctionName = button.getAttribute('data-validate');
        if (validationFunctionName) {
            const validationFunction = window[validationFunctionName];
            if (!validationFunction()) {
                return;
            }
        }
        showSection(nextSectionId);
    } else if (button.hasAttribute('data-prev')) {
        const prevSectionId = button.getAttribute('data-prev');
        showSection(prevSectionId);
    }
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

function validateStudentGroupNext() {
    const studentGroup = document.querySelector('input[name="student-group"]:checked');
    if (studentGroup) {
        if (studentGroup.value === 'yes') {
            showSection('student-delegation');
        } else {
            showSection('school-group-delegation');
        }
        return true;
    } else {
        document.getElementById('student-group-warning').classList.remove('hidden');
        return false;
    }
}

function validateSchoolRepNext() {
    const schoolRep = document.querySelector('input[name="school-rep"]:checked');
    if (schoolRep) {
        if (schoolRep.value === 'yes') {
            showSection('chaperone-delegation');
        } else {
            showSection('special-arrangements');
        }
        return true;
    } else {
        document.getElementById('school-rep-warning').classList.remove('hidden');
        return false;
    }
}

function validateSpecialArrangementsNext() {
    const specialArrangements = document.querySelector('input[name="special-arrangements"]:checked');
    if (specialArrangements) {
        if (specialArrangements.value === 'yes') {
            showSection('special-guidance');
        } else {
            showSection('mun-experience');
        }
        return true;
    } else {
        document.getElementById('special-arrangements-warning').classList.remove('hidden');
        return false;
    }
}

function validateOtherInfoNext() {
    const otherInfo = document.querySelector('input[name="other-info"]:checked');
    if (otherInfo) {
        if (otherInfo.value === 'yes') {
            showSection('special-guidance');
        } else {
            showSection('terms-conditions');
        }
        return true;
    } else {
        document.getElementById('other-info-warning').classList.remove('hidden');
        return false;
    }
}

function validateStudentSpecialArrangementsNext() {
    const studentSpecialArrangements = document.querySelector('input[name="student-special-arrangements"]:checked');
    if (studentSpecialArrangements) {
        if (studentSpecialArrangements.value === 'yes') {
            showSection('special-guidance');
        } else {
            showSection('mun-experience');
        }
        return true;
    } else {
        document.getElementById('student-special-arrangements-warning').classList.remove('hidden');
        return false;
    }
}
