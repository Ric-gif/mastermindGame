document.addEventListener("DOMContentLoaded", function () {

    const inputs = document.querySelectorAll('input[type="text"]');
    const checkButton = document.getElementById('check');
    const tries = document.getElementById('tries');
    const correctCount = document.getElementById('correctCount');
    const correctPositionCount = document.getElementById('correctPosition');

    // levels of difficulty
    const easy = 3;
    const medium = 4;
    const hard = 5;
    const impossible = 6;

    let difficulty = impossible;

    tries.textContent = 10;

    const difficultyCard = document.getElementById('difficulty-card');
    const difficultyButtons = document.querySelectorAll('.difficulty-button');

    difficultyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const value = event.target.getAttribute('data-difficulty');
            switch (value) {
                case 'easy':
                    difficulty = easy;
                    break;
                case 'medium':
                    difficulty = medium;
                    break;
                case 'hard':
                    difficulty = hard;
                    break;
                case 'impossible':
                    difficulty = impossible;
                    break;
            }
            correctNumber = generateUniqueNumber();
            console.log(correctNumber);
            inputs.forEach(input => {
                input.value = '';
                input.disabled = false; // Enable all inputs for new game
            });
            checkButton.disabled = true;

            // Hide difficulty card after selection
            difficultyCard.style.display = 'none';
        });
    });


    // Allows only numbers and no other characters and after reaching ones input max length goes to another and vice versa when using backspace
    const handleInput = (currentInput) => {
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
                nextInput.select(); // Highlight the next input
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
                prevInput.select(); // Highlight the previous input
            }
        }
    }

    // Add event listeners to inputs to handle input changes
    inputs.forEach(input => {
        input.addEventListener('input', () => handleInput(input));
        input.addEventListener('click', (event) => {
            event.target.select();
        });
    });



    // Generates unique number using rand from 0-9 and joining them together to the length of difficulty

    const rand = (min, max) => {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    const generateUniqueNumber = _ => {
        let digits = new Set();
        while (digits.size < difficulty) {
            digits.add(rand(0, 10));
        }
        return Array.from(digits).join('');
    }

    // Used for comparing
    let correctNumber = generateUniqueNumber();

    console.log(correctNumber);

    // if all inputs are filled enables check button
    const checkInputs = _ => {
        checkButton.disabled = Array.from(inputs).some(input => input.value === '');
    }

    // if all inputs are filled enables check button
    inputs.forEach(input => {
        input.addEventListener('input', checkInputs);
    });


    checkButton.addEventListener('click', () => {
        const pGuess = Array.from(inputs).map(input => input.value).join('');
        let correctPositions = [];
        let correctDigits = [];

        for (let i = 0; i < pGuess.length; i++) {
            if (pGuess[i] === correctNumber[i]) {
                correctPositions.push(pGuess[i]);
                inputs[i].disabled = true; // Disable input if correct and in correct position
            } else if (correctNumber.includes(pGuess[i])) {
                correctDigits.push(pGuess[i]);
            }
        }

        console.log(`Guess: ${pGuess}`);
        console.log(`Correct positions: ${correctPositions.join('')}`);
        console.log(`Correct digits (wrong positions): ${correctDigits.join('')}`);

        // If guess is correct replace check button with new game button
        if (correctPositions.length === difficulty) {
            const newGameButton = document.createElement('button');
            newGameButton.textContent = 'Next level';
            newGameButton.addEventListener('click', () => {
                correctNumber = generateUniqueNumber();
                console.log(correctNumber);
                inputs.forEach(input => {
                    input.value = '';
                    input.disabled = false; // Enable all inputs for new game
                });
                checkButton.disabled = true;
                newGameButton.replaceWith(checkButton);
            });
            checkButton.replaceWith(newGameButton);
        }
    });

    // Prevent form submission to avoid page refresh
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
        });
    }

});