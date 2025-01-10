const inputForm = document.querySelector('form');
const inputs = document.querySelectorAll('input');
const checkButton = document.querySelector('button');
const spans = document.querySelectorAll('.cPrediction span');


const difficulty = 5;

function handleInput(currentInput) {
    // Allow only digits
    currentInput.value = currentInput.value.replace(/[^0-9]/g, '');

    // Auto-focus to next input if valid digit entered
    if (currentInput.value.length === 1) {
        let nextInput = currentInput.nextElementSibling;
        while (nextInput && nextInput.tagName !== 'INPUT') {
            nextInput = nextInput.nextElementSibling;
        }
        if (nextInput) {
            nextInput.focus();
        }
    }

    // Auto-focus to previous input if backspace pressed
    if (currentInput.value.length === 0) {
        let prevInput = currentInput.previousElementSibling;
        while (prevInput && prevInput.tagName !== 'INPUT') {
            prevInput = prevInput.previousElementSibling;
        }
        if (prevInput) {
            prevInput.focus();
        }
    }
}

function rand(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function generateUniqueNumber() {
    let digits = new Set();
    while (digits.size < difficulty) {
        digits.add(rand(0, 10));
    }
    return Array.from(digits).join('');
}

const correctNumber = generateUniqueNumber();

console.log(correctNumber);