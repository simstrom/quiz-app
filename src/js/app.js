const STD_DELAY = 500;
const startBtn = document.querySelector('#start-btn');
const startState = document.querySelector('#start');
const quizContainer = document.querySelector('#question-box');
const submitBtn = quizContainer.lastElementChild;
const question = quizContainer.firstElementChild;
const possibleAnswers = document.querySelectorAll('input[type="radio"]');
const possibleAnswersText = document.querySelectorAll('label');
const spinner = document.createElement('div');

const quizData = [
    {
        question: 'What is the abbreviation of Laughing out Loud?',
        answers: ['lol', 'lmfao', 'rofl', 'omg'],
        // a : 'Lol',
        // b: 'Lmfao',
        // c: 'Rofl',
        // d: 'Omg',
        correct: 'a',
    },
    {
        question: 'Abbreviation of Oh My God?',
        answers: ['lol', 'lmfao', 'rofl', 'omg'],
        // a : 'Lol',
        // b: 'Lmfao',
        // c: 'Rofl',
        // d: 'Omg',
        correct: 'd',
    },
    {
        question: 'Abbreviation of Rofl?',
        answers: ['lol', 'lmfao', 'rofl', 'omg'],
        // a : 'Lol',
        // b: 'Lmfao',
        // c: 'Rofl',
        // d: 'Omg',
        correct: 'c',
    },
];
let currentQuestion = 0;
let score = 0;

const loadQuiz = (currentQuestion) => {
    question.innerText = quizData[currentQuestion].question;
    for (let i = 0; i < possibleAnswersText.length; i++) {
        possibleAnswersText[i].innerText = quizData[currentQuestion].answers[i];
    }
};

const getAnswer = () => {
    for (const answer of possibleAnswers) {
        if (answer.checked) {
            answer.checked = false;
            return answer;
        }
    }
    return null;
};

const loadQuizState = () => {
    spinner.classList.add('lds-dual-ring');
    document.body.prepend(spinner);
    setTimeout(() => {
        changeContentSmooth(quizContainer);
        quizContainer.style.display = 'flex';
    }, STD_DELAY);
};

const loadEndState = () => {
    quizContainer.innerHTML = `<h2>Your Score</h2>
    <h3>${score} / ${quizData.length}</h3>
    <button onclick="location.reload()" class="primary-btn">Try Again</button>`;
};

const changeContentSmooth = async (content) => {
    content.classList.add('fade');
    setTimeout(() => {
        content.classList.remove('fade');
        spinner.style.display = 'none';
    }, STD_DELAY);
};

submitBtn.addEventListener('click', () => {
    const answer = getAnswer();
    if (answer) {
        if (answer.value === quizData[currentQuestion].correct) {
            score++;
            console.log(`Correct! Your Score : ${score}`);
        } else {
            console.log(`Wrong! Your Score : ${score}`);
        }
        currentQuestion++;
        changeContentSmooth(quizContainer);
        if (currentQuestion < quizData.length) {
            setTimeout(() => {
                loadQuiz(currentQuestion);
            }, STD_DELAY);
        } else {
            setTimeout(() => {
                loadEndState();
            }, STD_DELAY);
        }
    }
});

startBtn.addEventListener('click', () => {
    startState.style.display = 'none';
    loadQuizState();
    loadQuiz(currentQuestion);
});
