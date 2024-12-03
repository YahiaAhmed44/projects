document.addEventListener('DOMContentLoaded', async () => {
    const wordsContainer = document.querySelector('.words');
    const checkButton = document.getElementById('check-button');

    let wordToGuess = ''; // Word to guess
    const attempts = 5; // Number of attempts
    const wordLength = 5; // Length of the word
    let currentRowIndex = 0; // Current row being attempted

    // Fetch random words from an API
    async function fetchWordList() {
        try {
            const response = await fetch(`https://random-word-api.herokuapp.com/word?number=10&length=${wordLength}`);
            const words = await response.json();
            return words.map(word => word.toUpperCase());
        } catch (error) {
            console.error('Failed to fetch words:', error);
            return ["APPLE", "BANJO", "CRANE", "DELTA", "EAGLE"]; // Fallback word list
        }
    }

    // Initialize the game
    async function initializeGame() {
        const wordList = await fetchWordList();
        wordToGuess = wordList[Math.floor(Math.random() * wordList.length)];
        console.log("Word to Guess:", wordToGuess); // Debugging hint (remove for production)

        // Generate input rows
        for (let i = 0; i < attempts; i++) {
            const row = document.createElement('div');
            row.classList.add('inputs');
            row.dataset.index = i; // Add a data attribute to identify rows

            for (let j = 0; j < wordLength; j++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = '1';
                input.disabled = i !== 0; // Disable all rows except the first
                row.appendChild(input);
            }

            wordsContainer.appendChild(row);
        }

        enableRowInputListeners(currentRowIndex); // Enable first row listeners
    }

    // Enable input listeners for a specific row
    function enableRowInputListeners(rowIndex) {
        const row = document.querySelector(`.inputs[data-index="${rowIndex}"]`);
        const inputs = row.querySelectorAll('input');

        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value.toUpperCase();
                if (!/^[A-Z]$/.test(value)) {
                    e.target.value = '';
                    return;
                }
                e.target.value = value;
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
                checkButton.disabled = ![...inputs].every(input => input.value); // Enable "Check" button
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace') {
                    e.preventDefault();
                    if (input.value === '' && index > 0) {
                        inputs[index - 1].focus();
                    }
                    input.value = '';
                    checkButton.disabled = true; // Disable "Check" button
                }
                if (e.key === 'Enter' && !checkButton.disabled) {
                    checkButton.click(); // Trigger "Check" button
                }
            });
        });
    }

    // Check the current guess
    checkButton.addEventListener('click', () => {
        const row = document.querySelector(`.inputs[data-index="${currentRowIndex}"]`);
        const inputs = row.querySelectorAll('input');
        const guess = Array.from(inputs).map(input => input.value).join('');
        const wordToGuessArray = wordToGuess.split('');
        const usedIndexes = new Set();

        inputs.forEach((input, index) => {
            if (input.value === wordToGuess[index]) {
                input.classList.add('green');
                usedIndexes.add(index);
            }
        });

        inputs.forEach((input, index) => {
            if (!input.classList.contains('green') && wordToGuessArray.includes(input.value)) {
                const matchIndex = wordToGuessArray.findIndex(
                    (letter, i) => letter === input.value && !usedIndexes.has(i)
                );
                if (matchIndex !== -1) {
                    input.classList.add('yellow');
                    usedIndexes.add(matchIndex);
                }
            }
        });

        inputs.forEach(input => input.disabled = true); // Disable current row

        if (guess === wordToGuess) {
            alert('Congratulations! You guessed the word!');
            location.reload(); // Reload game
        } else if (currentRowIndex < attempts - 1) {
            currentRowIndex++;
            const nextRow = document.querySelector(`.inputs[data-index="${currentRowIndex}"]`);
            nextRow.querySelectorAll('input').forEach(input => input.disabled = false);
            enableRowInputListeners(currentRowIndex);
            nextRow.querySelector('input').focus();
            checkButton.disabled = true;
        } else {
            alert(`Game Over! The correct word was: ${wordToGuess}`);
            location.reload(); // Reload game
        }
    });

    initializeGame(); // Start the game
});

function checkWord() {
    let correctLetters = 0;
    const inputs = document.querySelectorAll('.inputs input');
    const guess = Array.from(inputs).map(input => input.value.toUpperCase()).join('');
    
    // Ensure all inputs are filled
    if (guess.length < wordLength) {
        alert("Please fill all the inputs!");
        return;
    }
    
    // Compare the guess with the wordToGuess
    const wordToGuessArray = wordToGuess.split('');

    // Reset previous colors
    inputs.forEach(input => {
        input.classList.remove('green', 'yellow');
    });

    // First pass: check for correct letters in the correct position (green)
    inputs.forEach((input, index) => {
        if (input.value.toUpperCase() === wordToGuessArray[index]) {
            input.classList.add('green');
            correctLetters++;
        }
    });

    // Second pass: check for correct letters in the wrong position (yellow)
    inputs.forEach((input, index) => {
        if (input.value.toUpperCase() !== wordToGuessArray[index] && wordToGuessArray.includes(input.value.toUpperCase())) {
            input.classList.add('yellow');
        }
    });

    // Disable inputs after checking
    inputs.forEach(input => {
        input.disabled = true;
    });

    // Check if all letters are correct
    if (correctLetters === wordLength) {
        alert("Congratulations, you guessed the word!");
    } else {
        alert("Try again!");
    }
}