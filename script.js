document.addEventListener('DOMContentLoaded', function() {
    // Function to update character count excluding spaces
    function updateCharCount(textarea, charCountElement) {
        const maxLength = parseInt(textarea.getAttribute('data-maxlength'), 10);
        const currentLength = textarea.value.replace(/\s+/g, '').length;
        const remainingChars = maxLength - currentLength;
        charCountElement.textContent = `${remainingChars} character${remainingChars !== 1 ? 's' : ''} remaining`;

        // Disable textarea if the character limit is reached
        if (remainingChars <= 0) {
            textarea.disabled = true;
        } else {
            textarea.disabled = false;
        }
    }

    // Character count for textarea elements with data-maxlength attribute
    document.querySelectorAll('textarea[data-maxlength]').forEach(textarea => {
        const charCountElement = document.getElementById(`char-count-${textarea.id}`);
        textarea.addEventListener('input', () => {
            updateCharCount(textarea, charCountElement);
        });
        // Initialize the character count
        updateCharCount(textarea, charCountElement);
    });

    // Function to show the next section
    function showNextSection(nextSection) {
        const currentSection = document.querySelector('section:not(.hidden)');
        const nextSectionElement = document.getElementById(nextSection);
        if (currentSection) {
            currentSection.classList.add('hidden');
        }
        if (nextSectionElement) {
            nextSectionElement.classList.remove('hidden');
            nextSectionElement.classList.add('fade-in');
        }
        window.scrollTo(0, 0);
    }

    // Function to show the previous section
    function showPreviousSection(prevSection) {
        const currentSection = document.querySelector('section:not(.hidden)');
        const prevSectionElement = document.getElementById(prevSection);
        if (currentSection) {
            currentSection.classList.add('hidden');
        }
        if (prevSectionElement) {
            prevSectionElement.classList.remove('hidden');
            prevSectionElement.classList.add('fade-in');
        }
        window.scrollTo(0, 0);
    }

    // Function to handle student group next button
    function handleStudentGroupNext() {
        const studentGroup = document.querySelector('input[name="student-group"]:checked');
        if (studentGroup) {
            if (studentGroup.value === 'yes') {
                showNextSection('student-delegation');
            } else {
                showNextSection('school-group-delegation');
            }
        } else {
            document.getElementById('student-group-warning').classList.remove('hidden');
        }
    }

    // Function to handle school rep next button
    function handleSchoolRepNext() {
        const schoolRep = document.querySelector('input[name="school-rep"]:checked');
        if (schoolRep) {
            if (schoolRep.value === 'yes') {
                showNextSection('chaperone-delegation');
            } else {
                showNextSection('special-arrangements');
            }
        } else {
            document.getElementById('school-rep-warning').classList.remove('hidden');
        }
    }

    // Function to handle special arrangements next button
    function handleSpecialArrangementsNext() {
        const specialArrangements = document.querySelector('input[name="special-arrangements"]:checked');
        if (specialArrangements) {
            if (specialArrangements.value === 'yes') {
                showNextSection('special-guidance');
            } else {
                showNextSection('mun-experience');
            }
        } else {
            document.getElementById('special-arrangements-warning').classList.remove('hidden');
        }
    }

    // Function to handle other info next button
    function handleOtherInfoNext() {
        const otherInfo = document.querySelector('input[name="other-info"]:checked');
        if (otherInfo) {
            if (otherInfo.value === 'yes') {
                showNextSection('special-guidance');
            } else {
                showNextSection('terms-conditions');
            }
        } else {
            document.getElementById('other-info-warning').classList.remove('hidden');
        }
    }

    // Function to handle student special arrangements next button
    function handleStudentSpecialArrangementsNext() {
        const studentSpecialArrangements = document.querySelector('input[name="student-special-arrangements"]:checked');
        if (studentSpecialArrangements) {
            if (studentSpecialArrangements.value === 'yes') {
                showNextSection('special-guidance');
            } else {
                showNextSection('mun-experience');
            }
        } else {
            document.getElementById('student-special-arrangements-warning').classList.remove('hidden');
        }
    }

    // Function to validate email
    function validateEmail() {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address.';
        } else {
            emailError.textContent = '';
        }
    }

    // Function to handle form submission
    function handleSubmit(event) {
        event.preventDefault();
        // Add your form submission logic here
        alert('Form submitted successfully!');
    }

    // Ensure radio buttons and checkboxes are interactive
    document.querySelectorAll('.checkbox-container, .radio-button').forEach(container => {
        const input = container.querySelector('input');
        const label = container.querySelector('label');
        input.addEventListener('click', (event) => {
            event.stopPropagation();
        });
        label.addEventListener('click', (event) => {
            event.preventDefault();
            input.click();
        });
    });

    // Add event listeners to buttons
    document.querySelectorAll('button[type="button"]').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('onclick');
            if (action) {
                eval(action);
            }
        });
    });

    // Add event listener to form submission
    document.getElementById('registration-form').addEventListener('submit', handleSubmit);
});
