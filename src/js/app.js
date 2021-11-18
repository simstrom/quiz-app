
const submitBtn = document.querySelector('#answer');
const possibleAnswers = document.querySelectorAll('input[type="radio"]')
const possibleAnswersText = document.querySelectorAll('label')
const question = document.querySelector('#question')

const quizData = [
    {
        question : 'What is the abbreviation of Laughing out Loud?',
        answers : [
            'lol',
            'lmfao',
            'rofl',
            'omg'
        ],
        // a : 'Lol',
        // b: 'Lmfao',
        // c: 'Rofl',
        // d: 'Omg',
        correct : 'a'
    },
    {
        question : 'Abbreviation of Oh My God?',
        answers : [
            'lol',
            'lmfao',
            'rofl',
            'omg'
        ],
        // a : 'Lol',
        // b: 'Lmfao',
        // c: 'Rofl',
        // d: 'Omg',
        correct : 'd'
    },
    {
        question : 'Abbreviation of Rofl?',
        answers : [
            'lol',
            'lmfao',
            'rofl',
            'omg'
        ],
        // a : 'Lol',
        // b: 'Lmfao',
        // c: 'Rofl',
        // d: 'Omg',
        correct : 'c'
    }
]
let currentQuestion = 0;
let score = 0;

const loadQuiz = (currentQuestion) => {
    question.innerText = quizData[currentQuestion].question;
    for (let i = 0; i < possibleAnswersText.length; i++) {
        possibleAnswersText[i].innerText = quizData[currentQuestion].answers[i];
    }
}

const getAnswer = () => {
    for (const answer of possibleAnswers) {
        if (answer.checked) {
            answer.checked = false;
            return answer;
        }
    }
    return null;
}

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
        if (currentQuestion === quizData.length) {
            alert('No more questions!')
            location.reload();
        }
        loadQuiz(currentQuestion);
    }
})



loadQuiz(currentQuestion);
