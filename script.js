document.addEventListener('DOMContentLoaded', function() {
    const selectedCountries = {
        'first': {},
        'second': {},
        'third': {}
    };

    let formPath = ['welcome'];

    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    function updateCountryOptions(prefix) {
        const committeeSelector = document.getElementById(`${prefix}-committee-choice`);
        const countryContainer = document.getElementById(`${prefix}-country-choice-container`);
        const countrySelector = document.getElementById(`${prefix}-country-choice`);
        const selectedCommittee = committeeSelector.value;

        countrySelector.innerHTML = '<option value="">Select an option</option>';

        countryContainer.style.display = 'block';
        countryContainer.classList.add('slide-in-blurred-top');

        let countries = [];
        switch (selectedCommittee) {
            case 'DISEC':
                countries = ["Australia, Commonwealth of", "Japan", "Canada, Dominion of", "Mexico, United States", "China, People's Republic of", "India, Republic of", "Egypt, Arab Republic of", "Russian Federation", "Israel, State of", "Saudi Arabia, Kingdom of", "Nigeria, Federal Republic of", "Germany, Federal Republic of", "Korea, Republic of", "French Republic", "Argentine Republic", "Brazil, Federative Republic of", "South Africa, Republic of", "Türkiye, Republic of", "United Kingdom", "United States of America"];
                break;
            case 'SPECPOL':
                countries = ["Belgium, Kingdom of", "Kenya, Republic of", "Canada, Dominion of", "Russian Federation", "China, People's Republic of", "India, Republic of", "Congo, Democratic Republic of the", "South Africa, Republic of", "Japan", "Türkiye, Republic of", "Rwanda, Republic of", "French Republic", "Nigeria, Federal Republic of", "Ethiopia, Federal Democratic Republic of", "Angola, Republic of", "Brazil, Federative Republic of", "Uganda, Republic of", "United Kingdom", "United States of America"];
                break;
            case 'UNHRC':
                countries = ["Bangladesh, People's Republic of", "Myanmar, Republic of the Union of", "China, People's Republic of", "Pakistan, Islamic Republic of", "French Republic", "Japan", "Germany, Federal Republic of", "Saudi Arabia, Kingdom of", "Malaysia, Federation of", "Thailand, Kingdom of", "Russian Federation", "Indonesia, Republic of", "Netherlands, Kingdom of the", "India, Republic of", "Australia, Commonwealth of", "Brazil, Federative Republic of", "Türkiye, Republic of", "United Kingdom", "United States of America"];
                break;
            case 'EC':
                countries = ["Belgium, Kingdom of", "Netherlands, Kingdom of the", "Denmark, Kingdom of", "Poland, Republic of", "Finland, Republic of", "Hungary, Hungary", "French Republic", "Romania", "Italian Republic", "Slovak Republic", "Portuguese Republic", "Hellenic Republic", "Norway, Kingdom of", "Germany, Federal Republic of", "Austria, Republic of", "Czech Republic", "Spain, Kingdom of", "Sweden, Kingdom of", "United Kingdom"];
                break;
            case 'Continuous Crisis':
                countries = ["Argentine Republic", "Australia, Commonwealth of", "Brazil, Federative Republic of", "Canada, Dominion of", "Chile, Republic of", "China, People's Republic of", "French Republic", "Germany, Federal Republic of", "India, Republic of", "Italian Republic", "Japan", "Russian Federation", "South Africa, Republic of", "Spain, Kingdom of", "United Kingdom", "United States of America", "Uruguay, Oriental Republic of"];
                break;
            case 'SC':
                countries = ["China, People's Republic of", "Russian Federation", "French Republic", "Sierra Leone, Republic of", "Hellenic Republic", "Panama, Republic of", "Guyana, Co-operative Republic of", "Somalia, Federal Republic of", "Korea, Republic of", "United Kingdom", "Slovenia, Republic of", "Pakistan, Islamic Republic of", "Serbia, Republic of", "Kosovo, Republic of", "Algeria, People's Democratic Republic of", "Denmark, Kingdom of", "United States of America"];
                break;
            default:
                countries = [];
        }

        let availableCountries = countries.filter(country => 
            !Object.entries(selectedCountries).some(([key, value]) => 
                key !== prefix && value[country]
            )
        );

        availableCountries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelector.appendChild(option);
        });

        countrySelector.addEventListener('change', function() {
            const selectedCountry = this.value;
            if (selectedCountry) {
                if (selectedCountries[prefix].selectedCountry) {
                    delete selectedCountries[prefix][selectedCountries[prefix].selectedCountry];
                }
                selectedCountries[prefix][selectedCountry] = true;
                selectedCountries[prefix].selectedCountry = selectedCountry;
            } else {
                delete selectedCountries[prefix][selectedCountries[prefix].selectedCountry];
                selectedCountries[prefix].selectedCountry = null;
            }
            updateCountryOptions(prefix);
        });

        animateCardsBelow(countryContainer);
    }

    function animateCardsBelow(countryContainer) {
        const cardsBelow = Array.from(document.querySelectorAll('.card-below')).filter(card => card.compareDocumentPosition(countryContainer) & Node.DOCUMENT_POSITION_FOLLOWING);
        cardsBelow.forEach((card, index) => {
            card.classList.add('stagger-down');
            setTimeout(() => {
                card.classList.remove('stagger-down');
                card.classList.add('fade-in');
            }, index * 100);
        });
    }

    function updateCharCount(textareaId, charCountId) {
        const textarea = document.getElementById(textareaId);
        const charCount = document.getElementById(charCountId);
        const currentLength = textarea.value.replace(/\s/g, '').length;
        const maxLength = parseInt(textarea.getAttribute('data-maxlength'));
        const remainingChars = maxLength - currentLength;
        charCount.textContent = `${remainingChars} character${remainingChars !== 1 ? 's' : ''} available.`;
    }
    
    document.getElementById('registration-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  fetch('https://script.google.com/macros/s/AKfycbwUK4_DYmo3rnaOQFFTYGjAKXLNctEsPzMKtHntjc40dVqCf5oXHJ_HtuSAB6p_IsyzLw/exec', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.result === 'success') {
      alert('Form submitted successfully!');
    } else {
      alert('Form submission failed.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Form submission failed.');
      });
        });

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

        updateCharCount(textarea.id, `char-count-${textarea.id}`);
    });

    function validateAge() {
        const dobInput = document.getElementById('dob');
        const dobError = document.getElementById('dob-error');
        const dobValue = dobInput.value;
        const dobDate = new Date(dobValue);
        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();
        const monthDifference = today.getMonth() - dobDate.getMonth();
        const dayDifference = today.getDate() - dobDate.getDate();

        if (dobDate > today) {
            dobError.textContent = 'Your date of birth cannot be in the future, silly!';
            dobError.classList.remove('hidden');
            dobInput.classList.add('input-error');
            return false;
        }

        if (age < 13 || (age === 13 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
            dobError.textContent = 'To ensure compliance with the EU General Data Protection Regulation (GDPR), you should be at least 13 years old to complete this form.';
            dobError.classList.remove('hidden');
            dobInput.classList.add('input-error');
            return false;
        }

        dobError.textContent = '';
        dobError.classList.add('hidden');
        dobInput.classList.remove('input-error');
        return true;
    }

    function validateEmail() {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address.';
            emailError.classList.remove('hidden');
            emailInput.classList.add('input-error');
        } else {
            emailError.textContent = '';
            emailError.classList.add('hidden');
            emailInput.classList.remove('input-error');
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (validateAge() && validateEmail()) {
            alert('Form submitted successfully!');
        }
    }

    function showNextSection(nextSection) {
        const currentSection = document.querySelector('section:not(.hidden)');
        const nextSectionElement = document.getElementById(nextSection);
        if (currentSection) {
            currentSection.classList.add('hidden');
        }
        if (nextSectionElement) {
            nextSectionElement.classList.remove('hidden');
            nextSectionElement.classList.add('fade-in');
            formPath.push(nextSection);
        }
        window.scrollTo(0, 0);
    }

    function showPreviousSection() {
        if (formPath.length > 1) {
            const currentSection = document.querySelector('section:not(.hidden)');
            currentSection.classList.add('hidden');
            currentSection.classList.remove('fade-in');

            formPath.pop();

            const previousSectionId = formPath[formPath.length - 1];
            const previousSection = document.getElementById(previousSectionId);
            if (previousSection) {
                previousSection.classList.remove('hidden');
                previousSection.classList.add('fade-in');
            }

            window.scrollTo(0, 0);
        }
    }

    function toggleRequiredAttribute(fields, isRequired) {
        fields.forEach(field => {
            if (isRequired) {
                field.setAttribute('required', 'required');
            } else {
                field.removeAttribute('required');
            }
        });
    }

    function validateSection(sectionId) {
        const section = document.getElementById(sectionId);
        const requiredFields = section.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('input-error');
            } else {
                field.classList.remove('input-error');
            }
        });

        if (!isValid) {
            alert('Please fill out all required fields before proceeding.');
        }

        return isValid;
    }

    document.getElementById('first-committee-choice').addEventListener('change', function() { updateCountryOptions('first'); });
    document.getElementById('second-committee-choice').addEventListener('change', function() { updateCountryOptions('second'); });
    document.getElementById('third-committee-choice').addEventListener('change', function() { updateCountryOptions('third'); });
    document.getElementById('dob').addEventListener('change', validateAge);
    document.getElementById('email').addEventListener('change', validateEmail);
    
    document.querySelectorAll('.auto-resize').forEach(textarea => {
        textarea.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
        autoResizeTextarea(textarea);
    });

    const preferredTitleSelect = document.getElementById('preferred-title');
    const preferredTitleOther = document.getElementById('preferred-title-other');
    
    preferredTitleSelect.addEventListener('change', function() {
        preferredTitleOther.style.display = this.value === 'other' ? 'block' : 'none';
    });

    const dietaryRequirementsSelect = document.getElementById('dietary-requirements');
    const dietaryRequirementsOther = document.getElementById('dietary-requirements-other');
    
    dietaryRequirementsSelect.addEventListener('change', function() {
        dietaryRequirementsOther.style.display = this.value === 'other' ? 'block' : 'none';
    });

    const findOutOtherCheckbox = document.getElementById('find-out-other');
    const findOutOtherText = document.getElementById('find-out-other-text');
    
    findOutOtherCheckbox.addEventListener('change', function() {
        findOutOtherText.style.display = this.checked ? 'block' : 'none';
    });

    const pronounsOtherCheckbox = document.getElementById('other-pronouns');
    const pronounsOtherText = document.getElementById('pronouns-other');
    
    pronounsOtherCheckbox.addEventListener('change', function() {
        pronounsOtherText.style.display = this.checked ? 'block' : 'none';
    });

    const studentGroupYes = document.getElementById('student-group-yes');
    const studentGroupNo = document.getElementById('student-group-no');
    const delegationFields = document.querySelectorAll('#student-delegation input, #student-delegation select, #student-delegation textarea');

    const schoolRepYes = document.getElementById('school-rep-yes');
    const schoolRepNo = document.getElementById('school-rep-no');
    const schoolRepFields = document.querySelectorAll('#school-group-delegation input, #school-group-delegation select, #school-group-delegation textarea');

    const specialArrangementsYes = document.getElementById('special-arrangements-yes');
    const specialArrangementsNo = document.getElementById('special-arrangements-no');
    const specialArrangementsFields = document.querySelectorAll('#special-arrangements input, #special-arrangements select, #special-arrangements textarea');

    const otherInfoYes = document.getElementById('other-info-yes');
    const otherInfoNo = document.getElementById('other-info-no');
    const otherInfoFields = document.querySelectorAll('#chaperone-delegation input, #chaperone-delegation select, #chaperone-delegation textarea');

    const studentSpecialArrangementsYes = document.getElementById('student-special-arrangements-yes');
    const studentSpecialArrangementsNo = document.getElementById('student-special-arrangements-no');
    const studentSpecialArrangementsFields = document.querySelectorAll('#student-delegation input, #student-delegation select, #student-delegation textarea');

    studentGroupYes.addEventListener('change', function() {
        toggleRequiredAttribute(delegationFields, true);
    });

    studentGroupNo.addEventListener('change', function() {
        toggleRequiredAttribute(delegationFields, false);
    });

    schoolRepYes.addEventListener('change', function() {
        toggleRequiredAttribute(schoolRepFields, true);
    });

    schoolRepNo.addEventListener('change', function() {
        toggleRequiredAttribute(schoolRepFields, false);
    });

    specialArrangementsYes.addEventListener('change', function() {
        toggleRequiredAttribute(specialArrangementsFields, true);
    });

    specialArrangementsNo.addEventListener('change', function() {
        toggleRequiredAttribute(specialArrangementsFields, false);
    });

    otherInfoYes.addEventListener('change', function() {
        toggleRequiredAttribute(otherInfoFields, true);
    });

    otherInfoNo.addEventListener('change', function() {
        toggleRequiredAttribute(otherInfoFields, false);
    });

    studentSpecialArrangementsYes.addEventListener('change', function() {
        toggleRequiredAttribute(studentSpecialArrangementsFields, true);
    });

    studentSpecialArrangementsNo.addEventListener('change', function() {
        toggleRequiredAttribute(studentSpecialArrangementsFields, false);
    });

    if (studentGroupYes.checked) {
        toggleRequiredAttribute(delegationFields, true);
    } else if (studentGroupNo.checked) {
        toggleRequiredAttribute(delegationFields, false);
    }

    if (schoolRepYes.checked) {
        toggleRequiredAttribute(schoolRepFields, true);
    } else if (schoolRepNo.checked) {
        toggleRequiredAttribute(schoolRepFields, false);
    }

    if (specialArrangementsYes.checked) {
        toggleRequiredAttribute(specialArrangementsFields, true);
    } else if (specialArrangementsNo.checked) {
        toggleRequiredAttribute(specialArrangementsFields, false);
    }

    if (otherInfoYes.checked) {
        toggleRequiredAttribute(otherInfoFields, true);
    } else if (otherInfoNo.checked) {
        toggleRequiredAttribute(otherInfoFields, false);
    }

    if (studentSpecialArrangementsYes.checked) {
        toggleRequiredAttribute(studentSpecialArrangementsFields, true);
    } else if (studentSpecialArrangementsNo.checked) {
        toggleRequiredAttribute(studentSpecialArrangementsFields, false);
    }

    document.querySelectorAll('button[type="button"]').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('onclick');
            if (action) {
                eval(action);
            }
        });
    });

    document.getElementById('registration-form').addEventListener('submit', handleSubmit);

    function handleStudentGroupNext() {
        const currentSection = document.getElementById('student-group-delegation');
        if (!validateSection(currentSection.id)) {
            return; // Stop execution if validation fails
        }

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
        const currentSection = document.getElementById('school-group-delegation');
        if (!validateSection(currentSection.id)) {
            return; // Stop execution if validation fails
        }

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
        const currentSection = document.getElementById('chaperone-delegation');
        if (!validateSection(currentSection.id)) {
            return; // Stop execution if validation fails
        }

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
        const currentSection = document.getElementById('student-delegation');
        if (!validateSection(currentSection.id)) {
            return; // Stop execution if validation fails
        }

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
});
