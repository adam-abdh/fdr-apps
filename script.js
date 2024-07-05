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

    updateProgressBar();
    showSection(0);

    document.getElementById('next-button1').addEventListener('click', () => showNextSection('section2'));
    document.getElementById('prev-button1').addEventListener('click', () => showPreviousSection('section1'));
    document.getElementById('next-button2').addEventListener('click', () => showNextSection('section3'));
    document.getElementById('prev-button2').addEventListener('click', () => showPreviousSection('section2'));
});

function showNextSection(nextSectionId) {
    const sections = document.querySelectorAll('section');
    const currentSectionElement = sections[currentSection];
    const nextSectionElement = document.getElementById(nextSectionId);

    if (!validateSection(currentSectionElement)) {
        showWarning(currentSectionElement);
        return;
    }

    showSection(Array.from(sections).indexOf(nextSectionElement));
}

function showPreviousSection(prevSectionId) {
    const sections = document.querySelectorAll('section');
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

function showSection(index) {
    const sections = document.querySelectorAll('section');
    sections[currentSection].classList.add('hidden');
    sections[index].classList.remove('hidden');
    currentSection = index;
    updateProgressBar();
}

function updateProgressBar() {
    const sections = document.querySelectorAll('section');
    const progressBar = document.getElementById('progress-bar');
    const progress = ((currentSection + 1) / sections.length) * 100;
    progressBar.style.width = `${progress}%`;
}
