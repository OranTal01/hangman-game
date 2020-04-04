const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const finalMessageRevealWord = document.getElementById('final-message-reveal-word');
const oneWord = document.getElementById('one-word');
const twoWords = document.getElementById('two-words');
const threeWords = document.getElementById('three-words');

const figureParts = document.querySelectorAll('.figure-part');

let letters = [];
let guessedLetters = [];
let wrongLetters = [];
let status = 'playing';
let remainingGuesses = 6;

const getPuzzle = async (wordCount = 1) => {
    try {
        const newWord = await axios.get(`http://puzzle.mead.io/puzzle?wordCount=${wordCount}`);
        const wordPuzzle = newWord.data.puzzle.toLowerCase();
        saveLettersInArry(wordPuzzle);
    } catch (error) {
        throw new Error('Something wont wrong');
    }
};

const saveLettersInArry = async wordPuzzle => {
    wordPuzzle.split('').forEach(letter => {
        letters.push(letter);
    });
    renderLetters();
};

const renderLetters = _ => {
    wordEl.innerHTML = '';
    letters.forEach(letter => {
        if (guessedLetters.length === 0 || !guessedLetters.includes(letter)) {
            letter === ' ' ? renderLettersDom('-') : renderLettersDom('*');
        } else {
            renderLettersDom(letter);
        }
    });
};

const renderLettersDom = letter => {
    const divLetter = document.createElement('div');
    letter === '-' ? divLetter.classList.add('space') : divLetter.classList.add('letter');
    divLetter.innerHTML = letter;
    wordEl.appendChild(divLetter);
};

const checkWinOrLose = _ => {
    if (status === 'finished') {
        finalMessage.innerText = 'Congratulations! You won! 😃';
        popup.style.display = 'flex';
    }
    else {
        const selectedWord = letters.join('');
        finalMessage.innerText = 'Unfortunately you lost. 😕';
        finalMessageRevealWord.innerText = `the word was: ${selectedWord}`;
        popup.style.display = 'flex';
    }
};

const renderWrongLetter = _ => {
    wrongLettersEl.innerHTML = '';
    const pEl = document.createElement('p');
    pEl.innerHTML = 'Wrong';
    wrongLettersEl.appendChild(pEl);
    wrongLetters.forEach((wrongLetter, index) => {
        const spanEl = document.createElement('span');
        spanEl.innerHTML = index > 0 ? `,${wrongLetter}` : wrongLetter;
        wrongLettersEl.appendChild(spanEl);
        figureParts[index].classList.remove('figure-part');
    });
};

const pushNotification = _ => {
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
};

const makeGuess = guessLetter => {
    isUniq = !guessedLetters.includes(guessLetter);
    isBadGuess = !letters.includes(guessLetter);
    isWrongLetters = !wrongLetters.includes(guessLetter);

    if (isUniq && !isBadGuess) {
        guessedLetters.push(guessLetter);
    } else if (isUniq && isBadGuess && isWrongLetters) {
        wrongLetters.push(guessLetter);
        remainingGuesses--;
        renderWrongLetter();
    } else {
        pushNotification();
    }
    calculateStatus();
    if (status === 'playing') {
        renderLetters();
    } else {
        renderLetters();
        checkWinOrLose();
    }
};

const calculateStatus = _ => {
    const finished = letters.every((letter) => guessedLetters.includes(letter) || letter === ' ');

    if (remainingGuesses === 0) {
        status = 'failed';
    } else if (finished) {
        status = 'finished';
    } else {
        status = 'playing';
    }
};

const newGame = level => {
    letters = [];
    guessedLetters = [];
    wrongLetters = [];
    remainingGuesses = level;
    status = 'playing';
    popup.style.display = 'none';
    wrongLettersEl.innerHTML = '';
    figureParts.forEach(figure => {
        figure.classList.add('figure-part');
    });
};

// Events Listener

oneWord.addEventListener('click', () => {
    newGame(6);
    getPuzzle(1);
});
twoWords.addEventListener('click', () => {
    newGame(8);
    getPuzzle(2);
});
threeWords.addEventListener('click', () => {
    newGame(10);
    getPuzzle(3);
});

window.addEventListener('keypress', e => {
    if (status !== 'playing' || (e.keyCode < 97 || e.keyCode > 122)) return;
    const guessLetter = e.key.toLowerCase();
    makeGuess(guessLetter);
});


playAgainBtn.addEventListener('click', () => {
    newGame();
    getPuzzle();
});

getPuzzle();