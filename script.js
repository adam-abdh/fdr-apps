
document.addEventListener('DOMContentLoaded', function() {
    function updateCharCount(textareaId, charCountId) {
        const textarea = document.getElementById(textareaId);
        const charCount = document.getElementById(charCountId);
        const currentLength = textarea.value.replace(/\s/g, '').length;
        const maxLength = parseInt(textarea.getAttribute('data-maxlength'));
        const remainingChars = maxLength - currentLength;
        charCount.textContent = `${remainingChars} character${remainingChars !== 1 ? 's' : ''} remaining.`;
    }

    document.querySelectorAll('textarea[data-maxlength]').forEach(textarea => {
        textarea.addEventListener('input', function() {
            const maxLength = parseInt(this.getAttribute('data-maxlength'));
            const textWithoutSpaces = this.value.replace(/\s/g, '');
            if (textWithoutSpaces.length > maxLength) {
                let truncatedText = '';
                let charCount = 0;
                for (let i = 0; i < this.value.length; i++) {
                    if (this.value[i] !== ' ') {
                        if (charCount >= maxLength) break;
                        charCount++;
                    }
                    truncatedText += this.value[i];
                }
                this.value = truncatedText;
            }
            updateCharCount(this.id, `char-count-${this.id}`);
        });

        textarea.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.originalEvent || e).clipboardData.getData('text/plain');
            const maxLength = parseInt(this.getAttribute('data-maxlength'));
            const currentTextWithoutSpaces = this.value.replace(/\s/g, '');
            const pastedTextWithoutSpaces = pastedText.replace(/\s/g, '');
            const remainingChars = maxLength - currentTextWithoutSpaces.length;
            
            let allowedText = '';
            let charCount = 0;
            for (let i = 0; i < pastedText.length; i++) {
                if (pastedText[i] !== ' ') {
                    if (charCount >= remainingChars) break;
                    charCount++;
                }
                allowedText += pastedText[i];
            }
            
            document.execCommand('insertText', false, allowedText);
            updateCharCount(this.id, `char-count-${this.id}`);
        });

        // Initialize character count
        updateCharCount(textarea.id, `char-count-${textarea.id}`);
    });

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

    function handleSubmit(event) {
        event.preventDefault();
        alert('Form submitted successfully!');
    }

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

    document.querySelectorAll('button[type="button"]').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('onclick');
            if (action) {
                eval(action);
            }
        });
    });

    document.getElementById('registration-form').addEventListener('submit', handleSubmit);
});
