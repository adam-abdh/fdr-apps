function showNextSection(nextSection) {
    const currentSection = document.querySelector('section:not(.hidden)');
    const nextSectionElement = document.getElementById(nextSection);

    currentSection.classList.add('hidden');
    nextSectionElement.classList.remove('hidden');
    nextSectionElement.classList.add('fade-in');
    window.scrollTo(0, 0);
}

function showPreviousSection(prevSection) {
    const currentSection = document.querySelector('section:not(.hidden)');
    const prevSectionElement = document.getElementById(prevSection);

    currentSection.classList.add('hidden');
    prevSectionElement.classList.remove('hidden');
    prevSectionElement.classList.add('fade-in');
    window.scrollTo(0, 0);
}

function handleStudentGroupNext() {
    const studentGroup = document.querySelector('input[name="student-group"]:checked');
    if (studentGroup) {
        if (studentGroup.value === 'yes') {
            showNextSection('student-delegation');
        } else {
            showNextSection('school-group-delegation');
        }
    } else {
        showNextSection('school-group-delegation');
    }
}

function handleSchoolRepNext() {
    const schoolRep = document.querySelector('input[name="school-rep"]:checked');
    if (schoolRep) {
        if (schoolRep.value === 'yes') {
            showNextSection('chaperone-delegation');
        } else {
            showNextSection('special-arrangements');
        }
    } else {
        showNextSection('special-arrangements');
    }
}

function handleSpecialArrangementsNext() {
    const specialArrangements = document.querySelector('input[name="special-arrangements"]:checked');
    if (specialArrangements) {
        if (specialArrangements.value === 'yes') {
            showNextSection('special-guidance');
        } else {
            showNextSection('mun-experience');
        }
    } else {
        showNextSection('mun-experience');
    }
}

function handleOtherInfoNext() {
    const otherInfo = document.querySelector('input[name="other-info"]:checked');
    if (otherInfo) {
        if (otherInfo.value === 'yes') {
            showNextSection('special-guidance');
        } else {
            showNextSection('terms-conditions');
        }
    } else {
        showNextSection('terms-conditions');
    }
}

function handleStudentSpecialArrangementsNext() {
    const studentSpecialArrangements = document.querySelector('input[name="student-special-arrangements"]:checked');
    if (studentSpecialArrangements) {
        if (studentSpecialArrangements.value === 'yes') {
            showNextSection('special-guidance');
        } else {
            showNextSection('mun-experience');
        }
    } else {
        showNextSection('mun-experience');
    }
}

function validateEmail() {
    const email = document.getElementById('email').value;
    const emailError = document.getElementById('email-error');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        emailError.textContent = '⚠️ Please enter a valid email address.';
        document.getElementById('email').parentElement.style.border = '1px solid red';
    } else {
        emailError.textContent = '';
        document.getElementById('email').parentElement.style.border = '1px solid lightgrey';
    }
}

function updateCharCount(textareaId, charCountId) {
    const textarea = document.getElementById(textareaId);
    const charCount = document.getElementById(charCountId);
    charCount.textContent = `${textarea.value.replace(/\s/g, '').length}/${textarea.maxLength}`;
}

function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.parentElement.style.border = '1px solid red';
            if (!field.parentElement.querySelector('.error-message')) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.innerHTML = '<span class="error-icon">⚠️</span> This field is required.';
                field.parentElement.appendChild(errorMessage);
            }
        } else {
            field.parentElement.style.border = '1px solid lightgrey';
            const errorMessage = field.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    });

    return isValid;
}

function handleSubmit(event) {
    event.preventDefault();

    const isValid = validateForm();
    const specialArrangements = document.querySelector('input[name="special-arrangements"]:checked');
    const studentGroup = document.querySelector('input[name="student-group"]:checked');
    const schoolRep = document.querySelector('input[name="school-rep"]:checked');
    const otherInfo = document.querySelector('input[name="other-info"]:checked');
    const studentSpecialArrangements = document.querySelector('input[name="student-special-arrangements"]:checked');

    if ((!specialArrangements || !studentGroup || !schoolRep || !otherInfo || !studentSpecialArrangements) && !isValid) {
        alert('Please fill out all required fields.');
        return;
    }

    if (isValid) {
        alert('Thanks for applying to FDRMUN 25. You will soon receive an email with an fdrID identifier required to track your application, for correspondence, diploma authentication, and for entry on the 22nd. If you don\'t see it within the next 24 hours, please check your spam folder.');
        document.getElementById('registration-form').submit();
    } else {
        alert('Please fill out all required fields.');
    }
}

document.getElementById('registration-form').addEventListener('submit', handleSubmit);

document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    });
});

