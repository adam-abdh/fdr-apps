document.addEventListener('DOMContentLoaded', function() {
    const selectedCountries = {
        'first': {},
        'second': {},
        'third': {}
    };

    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
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

 function addEventListenerSafely(id, event, callback) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, callback);
        } else {
            console.warn(`Element with id '${id}' not found`);
        }
    }

    // For preferred title
    addEventListenerSafely('preferred-title', 'change', function() {
        const otherInput = document.getElementById('preferred-title-other');
        if (otherInput) {
            otherInput.style.display = this.value === 'other' ? 'block' : 'none';
        }
    });

    // For dietary requirements
    addEventListenerSafely('dietary-requirements', 'change', function() {
        const otherInput = document.getElementById('dietary-requirements-other');
        if (otherInput) {
            otherInput.style.display = this.value === 'other' ? 'block' : 'none';
        }
    });

    // For find out about us
    addEventListenerSafely('find-out-other', 'change', function() {
        const otherInput = document.getElementById('find-out-other-text');
        if (otherInput) {
            otherInput.style.display = this.checked ? 'block' : 'none';
        }
    });

    // For preferred pronouns
    addEventListenerSafely('pronouns-other', 'change', function() {
        const otherInput = document.getElementById('pronouns-other-text');
        if (otherInput) {
            otherInput.style.display = this.checked ? 'block' : 'none';
        }
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

    function updateCharCount(textareaId, charCountId) {
        const textarea = document.getElementById(textareaId);
        const charCount = document.getElementById(charCountId);
        const currentLength = textarea.value.replace(/\s/g, '').length;
        const maxLength = parseInt(textarea.getAttribute('data-maxlength'));
        const remainingChars = maxLength - currentLength;
        charCount.textContent = `${remainingChars} character${remainingChars !== 1 ? 's' : ''} available.`;
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

function updateCountryOptions(prefix) {
    console.log(`updateCountryOptions called with prefix: ${prefix}`);

    const committeeSelector = document.getElementById(`${prefix}-committee-choice`);
    const countryContainer = document.getElementById(`${prefix}-country-choice-container`);
    const countrySelector = document.getElementById(`${prefix}-country-choice`);
    const selectedCommittee = committeeSelector.value;

    console.log(`Selected committee: ${selectedCommittee}`);

    // Store currently selected country
    const currentlySelectedCountry = countrySelector.value;

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

    // Filter out countries selected in OTHER dropdowns
    let availableCountries = countries.filter(country => 
        !Object.entries(selectedCountries).some(([key, value]) => 
            key !== prefix && value[country]
        )
    );

    console.log(`Available countries for ${prefix}: `, availableCountries);

    availableCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        if (country === currentlySelectedCountry) {
            option.selected = true;
        }
        countrySelector.appendChild(option);
    });

    // If the currently selected country is not in the list, add it
    if (currentlySelectedCountry && !availableCountries.includes(currentlySelectedCountry)) {
        const option = document.createElement('option');
        option.value = currentlySelectedCountry;
        option.textContent = currentlySelectedCountry;
        option.selected = true;
        countrySelector.appendChild(option);
    }

    // If no country is selected, don't auto-select
    if (!countrySelector.value) {
        countrySelector.value = "";
    }

    // Update the selectedCountries object
    if (selectedCountries[prefix].selectedCountry && selectedCountries[prefix].selectedCountry !== currentlySelectedCountry) {
        delete selectedCountries[prefix][selectedCountries[prefix].selectedCountry];
    }
    if (currentlySelectedCountry) {
        selectedCountries[prefix][currentlySelectedCountry] = true;
        selectedCountries[prefix].selectedCountry = currentlySelectedCountry;
    }

    // Add event listener for country selection
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
        updateCountryOptions(prefix); // Re-populate the dropdown to reflect the change
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
});
