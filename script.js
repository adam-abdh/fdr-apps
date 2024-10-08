
function validateSection(sectionId) {
    const section = document.getElementById(sectionId);
    const requiredFields = section.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('input-error');
        } else {
            field.classList.remove('input-error');
        }
    });

    // Handle radio button groups
    const radioGroups = section.querySelectorAll('input[type="radio"][required]');
    const checkedGroups = new Set();
    radioGroups.forEach(radio => {
        if (radio.checked) {
            checkedGroups.add(radio.name);
        }
    });
    if (checkedGroups.size !== new Set(Array.from(radioGroups).map(r => r.name)).size) {
        isValid = false;
    }

    // Show/hide warning message
    const warningElement = section.querySelector('.warning');
    if (warningElement) {
        if (!isValid) {
            warningElement.classList.remove('hidden');
        } else {
            warningElement.classList.add('hidden');
        }
    }

    return isValid;
}

function validatePersonalData() {
    const personalDataSection = document.getElementById('personal-data');
    const requiredFields = personalDataSection.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('input-error');
        } else {
            field.classList.remove('input-error');
        }
    });

    if (!isValid) {
        document.getElementById('personal-data-warning').classList.remove('hidden');
    } else {
        document.getElementById('personal-data-warning').classList.add('hidden');
    }

    return isValid;
}

function handlePersonalDataNext() {
    if (validatePersonalData()) {
        showNextSection('student-group-delegation');
    } else {
        window.scrollTo(0, 0);
    }
}

function validateFormByApplicantType(applicantType) {
    if (applicantType === 'chaperone') {
        // Validate only chaperone-specific fields and terms-conditions
        return validateSection('chaperone-delegation') && 
               validateSection('terms-conditions', true);
    } else if (applicantType === 'delegation') {
        // Validate delegation-specific fields and other required sections
        return validateSection('student-delegation') &&
               validateSection('mun-experience') &&
               validateSection('terms-conditions');
    } else {
        // Validate all required fields for individual delegates
        return validateSection('personal-data') &&
               validateSection('mun-experience') &&
               validateSection('terms-conditions');
    }
}

function updateMUNExperienceRequirements() {
    const isChaperone = document.querySelector('input[name="school-rep"]:checked')?.value === 'yes';
    const munExperienceSection = document.getElementById('mun-experience');
    if (munExperienceSection) {
        const requiredFields = munExperienceSection.querySelectorAll('input[required], select[required], textarea[required]');
        requiredFields.forEach(field => {
            if (isChaperone) {
                field.removeAttribute('required');
            } else {
                field.setAttribute('required', 'required');
            }
        });
    }
}

function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // If the birthday hasn't occurred this year yet, subtract one year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function validateAge() {
    const dobInput = document.getElementById('dob');
    const dobError = document.getElementById('dob-error');
    const ageDisplay = document.getElementById('age'); // Add this line
    const dobValue = dobInput.value;

    if (!dobValue) {
        dobError.textContent = 'Please enter your date of birth.';
        dobError.classList.remove('hidden');
        dobInput.classList.add('input-error');
        ageDisplay.textContent = ''; // Clear age display
        return false;
    }

    const age = calculateAge(dobValue);

    if (age < 0) {
        dobError.textContent = 'Your date of birth cannot be in the future, silly!';
        dobError.classList.remove('hidden');
        dobInput.classList.add('input-error');
        return false;
    }

    if (age < 13) {
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
            return false;
        } else {
            emailError.textContent = '';
            emailError.classList.add('hidden');
            emailInput.classList.remove('input-error');
            return true;
        }
    }

let isSubmitting = false;

function showLightbox(message, isLoading = false) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <p>${message}</p>
            ${!isLoading ? '<button onclick="closeLightbox()">Close</button>' : ''}
        </div>
    `;
    document.body.appendChild(lightbox);
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.remove();
    }
}

function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const submissionTime = new Date().toISOString();

    if (validateAge() && validateEmail()) {
        isSubmitting = true;
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        showLightbox('Submitting your application...', true);

        const formData = new FormData(event.target);
        let data = {};

        const stringFields = [
            "preferred-title", "pronouns", "first-name", "last-name", "email", "dob", "age", "fdrID",
            "institution", "phone", "preferred-name", "residence", "country", "dietary-requirements",
            "find-out", "delegation-number", "delegation-name",
            "delegation-experience", "billing", "logistical-requests", "other-info", "delegation-students-number",
            "student-delegation-name", "special-circumstances", "additional-circumstances", "mun-experience",
            "transformative-experience", "first-committee-choice", "first-country-choice", "second-committee-choice",
            "second-country-choice", "third-committee-choice", "third-country-choice", "favorite-period", "training-modules",
            "referral-code", "additional-info"
        ];

        // Collect all form data
        formData.forEach((value, key) => {
            if (stringFields.includes(key)) {
                data[key] = value.toString();
            } else if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        });

        // Handle preferred title
        const preferredTitleSelect = document.getElementById('preferred-title');
        const preferredTitleOther = document.querySelector('input[name="preferred-title"][type="text"]');
        if (preferredTitleSelect.value === 'other') {
            data['preferred-title'] = preferredTitleOther.value;
        } else {
            data['preferred-title'] = preferredTitleSelect.value;
        }

        // Handle dietary requirements
        const dietaryRequirementsSelect = document.getElementById('dietary-requirements');
        const dietaryRequirementsOther = document.querySelector('input[name="dietary-requirements"][type="text"]');
        if (dietaryRequirementsSelect.value === 'other') {
            data['dietary-requirements'] = dietaryRequirementsOther.value;
        } else {
            data['dietary-requirements'] = dietaryRequirementsSelect.value;
        }

        // Handle checkboxes for find-out
        const findOutCheckboxes = document.querySelectorAll('input[name="find-out"]:checked');
        let findOutValues = Array.from(findOutCheckboxes).map(cb => cb.value);
        
        const findOutOtherCheckbox = document.querySelector('input[name="find-out"][value="Other"]');
        const findOutOtherText = document.querySelector('input[name="find-out"][type="text"]');
        if (findOutOtherCheckbox.checked && findOutOtherText.value) {
            findOutValues = findOutValues.filter(value => value !== 'Other');
            findOutValues.push(findOutOtherText.value);
        }
        data['find-out'] = findOutValues.join(', ');

        data = processDelegationNumber(data);

        let applicantType;
        if (data['school-rep'] === 'yes') {
            applicantType = 'chaperone';
        } else if (data['student-group'] === 'yes') {
            applicantType = 'delegation';
        } else {
            applicantType = 'delegate';
        }

        if (!validateFormByApplicantType(applicantType)) {
            isSubmitting = false;
            submitButton.disabled = false;
            return; 
        }

        const fdrID = generateFdrID(data['first-name'], data['last-name'], applicantType);
        data.fdrID = fdrID;

        // Ensure all specified fields are strings
        stringFields.forEach(field => {
            if (data[field] === undefined) {
                data[field] = '';
            } else {
                data[field] = data[field].toString();
            }
        });

        console.log('Form data to be sent:', data);

        data.submissionTime = submissionTime;

        fetch('https://r18b43myb8.execute-api.eu-north-1.amazonaws.com/default/myFormHandleSubmitter3', {
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(responseData => {
            console.log('Response from server:', responseData);
            closeLightbox();
            if (responseData.status === 'success') {
                showLightbox('Thanks for applying to FDRMUN 25. You will soon receive an email with an fdrID identifier required to track your application, for correspondence, diploma authentication, and for entry on the 22nd.');
                triggerConfetti();
            } else if (responseData.status === 'error' && responseData.message === 'Email already exists') {
                showLightbox('This email has already been used for a submission. Please check your inbox for an email from noreply@fdrmun.org to see if you have already completed an application.');
            } else {
                showLightbox('Thanks for applying to FDRMUN 25. You will soon receive an email with an fdrID identifier required to track your application, for correspondence, diploma authentication, and for entry on the 22nd.');
                triggerConfetti();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            closeLightbox();
            showLightbox('An error occurred. Please try again later.');
        })
        .finally(() => {
            isSubmitting = false;
            submitButton.disabled = false;
        });
    }
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function processDelegationNumber(data) {
    const delegationNumber = document.getElementById('delegation-number').value;
    const delegationStudentsNumber = document.getElementById('delegation-students-number').value;

    if (data['school-rep'] === 'yes') {
        // For chaperones, use 'delegation-number'
        data['delegation-number'] = delegationNumber;
    } else {
        // For students, use 'delegation-students-number'
        data['delegation-number'] = delegationStudentsNumber;
    }

    // Remove the unused field to avoid duplication
    delete data['delegation-students-number'];

    return data;
}



function generateFdrID(firstName, lastName, applicantType) {
    // Get first and last initials
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    // Determine applicant type indicator
    let typeIndicator;
    switch (applicantType) {
        case 'chaperone':
            typeIndicator = 'c';
            break;
        case 'delegation':
            typeIndicator = 'g';
            break;
        case 'delegate':
            typeIndicator = 'd';
            break;
    }

    // Generate random 4-digit number starting with 0
    const randomNum = Math.floor(Math.random() * 9000) + 1000; // 1000 to 9999
    const paddedNum = randomNum.toString().padStart(4, '0');

    // Construct the fdrID
    const fdrID = `5f${firstInitial}${lastInitial}${typeIndicator}${paddedNum}`;

    // Log the fdrID to the console
    console.log('Generated fdrID:', fdrID);

    return fdrID;
}

document.addEventListener('DOMContentLoaded', function() {

    const selectedCountries = {
        'first': {},
        'second': {},
        'third': {}
    };

      const form = document.getElementById('registration-form');
    form.addEventListener('submit', handleSubmit);

    let formPath = ['welcome'];

    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
     const schoolRepRadios = document.querySelectorAll('input[name="school-rep"]');
    schoolRepRadios.forEach(radio => {
        radio.addEventListener('change', updateMUNExperienceRequirements);
    });

    updateMUNExperienceRequirements();

function updateCountryOptions(prefix) {
    const committeeSelector = document.getElementById(`${prefix}-committee-choice`);
    const countryContainer = document.getElementById(`${prefix}-country-choice-container`);
    const countrySelector = document.getElementById(`${prefix}-country-choice`);
    const selectedCommittee = committeeSelector.value;

        const currentlySelectedCountry = countrySelector.value;
        countrySelector.innerHTML = '<option value="">Select an option</option>';

        countryContainer.style.display = 'block';
        countryContainer.classList.add('slide-in-blurred-top');

        let countries = [];
        switch (selectedCommittee) {
            case 'DISEC':
                countries = ["Australia", "Japan", "Canada", "Mexico", "China", "India", "Egypt", "Russia", "Israel", "Saudi Arabia", "Nigeria", "Germany", "South Korea", "France", "Argentina", "Brazil", "South Africa", "Turkey", "United Kingdom", "United States"];
                break;
            case 'SPECPOL':
                countries = ["Belgium", "Kenya", "Canada", "Russia", "China", "India", "Congo", "South Africa", "Japan", "Turkey", "Rwanda", "France", "Nigeria", "Ethiopia", "Angola", "Brazil", "Uganda", "United Kingdom", "United States"];
                break;
            case 'UNHRC':
                countries = ["Bangladesh", "Myanmar", "China", "Pakistan", "France", "Japan", "Germany", "Saudi Arabia", "Malaysia", "Thailand", "Russia", "Indonesia", "Netherlands", "India", "Australia", "Brazil", "Turkey", "United Kingdom", "United States"];
                break;
            case 'EC':
                countries = ["Belgium", "Netherlands", "Denmark", "Poland", "Finland", "Hungary", "France", "Romania", "Italy", "Slovakia", "Portugal", "Greece", "Norway", "Germany", "Austria", "Czech Republic", "Spain", "Sweden", "United Kingdom"];
                break;
            case 'Continuous Crisis':
                countries = ["Argentina", "Australia", "Brazil", "Canada", "Chile", "China", "France", "Germany", "India", "Italy", "Japan", "Russia", "South Africa", "Spain", "United Kingdom", "United States", "Uruguay"];
                break;
            case 'SC':
                countries = ["China", "Russia", "France", "Sierra Leone", "Greece", "Panama", "Guyana", "Somalia", "South Korea", "United Kingdom", "Slovenia", "Pakistan", "Serbia", "Kosovo", "Algeria", "Denmark", "United States"];
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
            if (country === currentlySelectedCountry) {
                option.selected = true;
            }
            countrySelector.appendChild(option);
        });

        if (currentlySelectedCountry && !availableCountries.includes(currentlySelectedCountry)) {
            const option = document.createElement('option');
            option.value = currentlySelectedCountry;
            option.textContent = currentlySelectedCountry;
            option.selected = true;
            countrySelector.appendChild(option);
        }

        if (!countrySelector.value) {
            countrySelector.value = "";
        }

        if (selectedCountries[prefix].selectedCountry && selectedCountries[prefix].selectedCountry !== currentlySelectedCountry) {
            delete selectedCountries[prefix][selectedCountries[prefix].selectedCountry];
        }
        if (currentlySelectedCountry) {
            selectedCountries[prefix][currentlySelectedCountry] = true;
            selectedCountries[prefix].selectedCountry = currentlySelectedCountry;
        }

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

let formStarted = false;

function setupBeforeUnloadWarning() {
    window.addEventListener('beforeunload', function(e) {
        if (formStarted) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

setupBeforeUnloadWarning();

document.getElementById('registration-form').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});

document.querySelectorAll('#registration-form input, #registration-form textarea').forEach(function(input) {
    input.addEventListener('input', function() {
        formStarted = true;
    });
});
    
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
    
    // If we're on the personal data section, validate before proceeding
    if (currentSection.id === 'personal-data') {
        if (!validatePersonalData()) {
            window.scrollTo(0, 0);
            return; // Don't proceed if validation fails
        }
    }

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

    function handleOtherInfoNext() {
    const currentSection = document.getElementById('chaperone-delegation');
    if (!validateSection(currentSection.id)) {
        return;

    }


    showNextSection('terms-conditions'); 
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

  
 
    document.getElementById('first-committee-choice').addEventListener('change', function() { updateCountryOptions('first'); });
    document.getElementById('second-committee-choice').addEventListener('change', function() { updateCountryOptions('second'); });
    document.getElementById('third-committee-choice').addEventListener('change', function() { updateCountryOptions('third'); });

    document.getElementById('dob').addEventListener('change', validateAge);
    document.getElementById('email').addEventListener('input', validateEmail);

    document.querySelectorAll('.auto-resize').forEach(textarea => {
        textarea.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
        autoResizeTextarea(textarea);
    });
    
    const preferredTitleSelect = document.getElementById('preferred-title');
const preferredTitleOther = document.querySelector('input[name="preferred-title"][type="text"]');
preferredTitleSelect.addEventListener('change', function() {
    toggleOtherOption(this, preferredTitleOther);
});

const dietaryRequirementsSelect = document.getElementById('dietary-requirements');
const dietaryRequirementsOther = document.querySelector('input[name="dietary-requirements"][type="text"]');
dietaryRequirementsSelect.addEventListener('change', function() {
    toggleOtherOption(this, dietaryRequirementsOther);
});

const findOutOtherCheckbox = document.querySelector('input[name="find-out"][value="Other"]');
const findOutOtherText = document.querySelector('input[name="find-out"][type="text"]');
findOutOtherCheckbox.addEventListener('change', function() {
    toggleOtherOption(this, findOutOtherText);
});

function toggleOtherOption(element, otherInput) {
    if ((element.tagName === 'SELECT' && element.value === 'other') || 
        (element.type === 'checkbox' && element.checked && element.value === 'Other')) {
        otherInput.style.display = 'block';
        otherInput.classList.add('blur-in-top');
        otherInput.required = true; // Make the field required when visible
    } else {
        otherInput.style.display = 'none';
        otherInput.classList.remove('blur-in-top');
        otherInput.value = ''; // Clear the input when hidden
        otherInput.required = false; // Remove the required attribute when hidden
    }
}
    
    const studentGroupYes = document.getElementById('student-group-yes');
    const studentGroupNo = document.getElementById('student-group-no');
    const delegationFields = document.querySelectorAll('#student-delegation input, #student-delegation select, #student-delegation textarea');

    const schoolRepYes = document.getElementById('school-rep-yes');
    const schoolRepNo = document.getElementById('school-rep-no');
    const schoolRepFields = document.querySelectorAll('#school-group-delegation input, #school-group-delegation select, #school-group-delegation textarea');

    const specialArrangementsYes = document.getElementById('special-arrangements-yes');
    const specialArrangementsNo = document.getElementById('special-arrangements-no');
    const specialArrangementsFields = document.querySelectorAll('#special-arrangements input, #special-arrangements select, #special-arrangements textarea');

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

        function handleStudentGroupNext() {
        const currentSection = document.getElementById('student-group-delegation');
        if (!validateSection(currentSection.id)) {
            return;
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
            return;
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

 function updateMUNExperienceRequirements() {
    const isChaperone = document.querySelector('input[name="school-rep"]:checked')?.value === 'yes';
    const munExperienceSection = document.getElementById('mun-experience');
    if (munExperienceSection) {
        const requiredFields = munExperienceSection.querySelectorAll('input[required], select[required], textarea[required]');
        requiredFields.forEach(field => {
            if (isChaperone) {
                field.removeAttribute('required');
            } else {
                field.setAttribute('required', 'required');
            }
        });
    }
}
 

    function handleStudentSpecialArrangementsNext() {
        const currentSection = document.getElementById('student-delegation');
        if (!validateSection(currentSection.id)) {
            return;
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
