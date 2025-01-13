document.addEventListener("DOMContentLoaded", function () {
    const inputContainer = document.getElementById('input-container');
    const checkButton = document.getElementById('check');
    const triesElement = document.getElementById('tries');
    const correctCountElement = document.getElementById('correctCount');
    const correctPositionElement = document.getElementById('correctPosition');
    const levelElement = document.getElementById('level');
    const difficultyElement = document.getElementById('difficulty');
    const scoreElement = document.getElementById('score');
    const cPrediction = document.querySelector('.cPrediction');

    const levels = { easy: 6, medium: 6, hard: 6, impossible: 6 };
    const difficulties = { easy: 3, medium: 4, hard: 5, impossible: 6 };

    let difficulty = 'impossible';
    let level = 1;
    let score = 0;
    let tries = 10;

    const updateUI = () => {
        levelElement.textContent = level;
        difficultyElement.textContent = difficulty;
        triesElement.textContent = tries;
        scoreElement.textContent = score;
    };

    updateUI();

    const difficultyCard = document.getElementById('difficulty-card');
    const difficultyButtons = document.querySelectorAll('.difficulty-button');

    const getInputs = () => Array.from(document.querySelectorAll('#input-container input'));

    const renderInputs = () => {
        inputContainer.innerHTML = '';
        cPrediction.innerHTML = '';

        for (let i = 0; i < difficulties[difficulty]; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = '1';
            input.size = '1';
            input.required = true;

            input.addEventListener('input', () => {
                handleInput(input);
                validateInputs();
                checkInputs();
            });
            input.addEventListener('click', (event) => event.target.select());

            inputContainer.appendChild(input);

            const span = document.createElement('span');
            span.textContent = 'X';
            cPrediction.appendChild(span);
        }

        checkInputs();
    };

    difficultyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            difficulty = event.target.getAttribute('data-difficulty');
            level = 1;
            score = 0;
            tries = 10;
            correctNumber = generateUniqueNumber();
            console.log(correctNumber);
            updateUI();
            renderInputs();
            difficultyCard.style.display = 'none';
        });
    });

    const handleInput = (currentInput) => {
        currentInput.value = currentInput.value.replace(/[^0-9]/g, '');
    
        if (currentInput.value.length === 1) {
            let nextInput = currentInput.nextElementSibling;
            while (nextInput && nextInput.disabled) {
                nextInput = nextInput.nextElementSibling;
            }
            if (nextInput) nextInput.focus();
        }
    
        currentInput.addEventListener('focus', () => {
            currentInput.select();
        });
    
        if (currentInput.value.length === 0) {
            let prevInput = currentInput.previousElementSibling;
            while (prevInput && prevInput.disabled) {
                prevInput = prevInput.previousElementSibling;
            }
            if (prevInput) prevInput.focus();
        }
    };


    const validateInputs = () => {
        const inputs = getInputs();
        const values = inputs.map(input => input.value);

        inputs.forEach(input => {
            const value = input.value;
            const count = values.filter(v => v === value).length;

            if (value && count > 2) {
                input.value = '';
            }
        });
    };

    const generateUniqueNumber = () => {
        let digits = new Set();
        while (digits.size < difficulties[difficulty]) {
            digits.add(Math.floor(Math.random() * 10));
        }
        return Array.from(digits).join('');
    };

    let correctNumber = generateUniqueNumber();
    console.log(correctNumber);

    const checkInputs = () => {
        const inputs = getInputs();
        checkButton.disabled = inputs.some(input => input.value === '') || !areInputsUnique(inputs);
    };

    const areInputsUnique = (inputs) => {
        const values = inputs.map(input => input.value);
        const counts = values.reduce((acc, val) => {
            if (val) acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});
        return Object.values(counts).every(count => count <= 2);
    };

    const restartGame = () => {
        difficultyCard.style.display = 'block';
        replaceButton(restartButton, checkButton);
    };

    const replaceButton = (oldButton, newButton) => {
        oldButton.replaceWith(newButton);
        checkInputs();
    };

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.addEventListener('click', restartGame);

    // Add and store high score
    const highScore = localStorage.getItem('highScore') || 0;
    const highScoreElement = document.getElementById('highscoreValue');
    highScoreElement.textContent = highScore;

    const setHighScore = () => {
        if (score > highScore) {
            localStorage.setItem('highScore', score);
            highScoreElement.textContent = score;
        }
    }

    checkButton.addEventListener('click', () => {
        const inputs = getInputs();
        const guess = inputs.map(input => input.value).join('');
        let correctCount = 0;
        let correctPosition = 0;
    
        for (let i = 0; i < guess.length; i++) {
            const predictionSpans = cPrediction.children;
    
            if (guess[i] === correctNumber[i]) {
                correctPosition++;
                inputs[i].disabled = true;
    
                predictionSpans[i].textContent = guess[i];
                predictionSpans[i].classList.add('correct');
            } else if (correctNumber.includes(guess[i])) {
                correctCount++;
            }
        }
    
        correctCountElement.textContent = correctCount;
        correctPositionElement.textContent = correctPosition;
    
        tries--;
        triesElement.textContent = tries;
    
        if (correctPosition === difficulties[difficulty]) {
            let pointsForLevel = 150 - (10 - tries) * 5; // Deduct points based on tries used
            score += pointsForLevel;
    
            if (level < levels[difficulty]) {
                level++;
                tries = 10; // Reset tries for the new level
                const newGameButton = document.createElement('button');
                newGameButton.textContent = 'Next level';
                newGameButton.addEventListener('click', () => {
                    correctNumber = generateUniqueNumber();
                    console.log(correctNumber);
                    renderInputs();
                    updateUI();
                    replaceButton(newGameButton, checkButton);
                });
                replaceButton(checkButton, newGameButton);
            } else {
                alert('Congratulations! You completed all levels for this difficulty.');
                score += 100;
                replaceButton(checkButton, restartButton);
            }
        } else if (tries === 0) {
            alert(`Game over! The correct number was ${correctNumber}`);
            replaceButton(checkButton, restartButton);
        }
    
        if (correctPosition === difficulties[difficulty] || tries === 0) {
            // Ensure score doesn’t go below zero
            if (score < 0) {
                score = 0;
            }
        }
    
        updateUI();
        setHighScore();
    });

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
        });
    }
});
