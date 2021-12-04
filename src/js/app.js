const STD_DELAY = 1000;
const startBtn = document.querySelector('#start-btn');
const startState = document.querySelector('#start');
const quizContainer = document.querySelector('#question-box');
const quizInfo = quizContainer.children[1];
const submitBtn = quizContainer.lastElementChild;
const question = quizContainer.firstElementChild;
const possibleAnswers = document.querySelectorAll('input[type="radio"]');
const possibleAnswersText = document.querySelectorAll('label');
const categoryCards = document.querySelectorAll('.category-card');
const spinner = document.createElement('div');
const feedback = document.querySelector('.feedback-overlay');
const ERROR_ICON = 'fa-times-circle';
const ERROR_COLOR = '#bd7272de';
const quizData = [];

let currentQuestion = 0;
let score = 0;

const loadQuiz = (currentQuestion) => {
	question.innerHTML = quizData[currentQuestion].question;
	quizInfo.firstElementChild.innerText = quizData[currentQuestion].category;
	quizInfo.lastElementChild.firstElementChild.innerHTML = `Question: <b>${
		currentQuestion + 1
	} / ${quizData.length}</b>`;
	quizInfo.lastElementChild.lastElementChild.innerHTML = `Score: <span>${score}</span>`;
	const allAnswers = shuffleAnswers(
		quizData[currentQuestion].incorrect_answers,
		quizData[currentQuestion].correct_answer
	);
	for (let i = 0; i < possibleAnswersText.length; i++) {
		possibleAnswersText[i].innerHTML = allAnswers[i];
	}
};

const shuffleAnswers = (answers, correct) => {
	answers.push(correct);
	let currentIndex = answers.length,
		randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[answers[currentIndex], answers[randomIndex]] = [
			answers[randomIndex],
			answers[currentIndex],
		];
	}
	return answers;
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
	changeContentSmooth(quizContainer);
	quizContainer.style.display = 'flex';
};

const loadEndState = () => {
	quizContainer.innerHTML = `<h2>Your Score</h2>
    <div class="quiz-info">
                <p class="category">Quiz Completed!</p>
    </div>
    <h3>${score} / ${quizData.length}</h3>
    <button onclick="location.reload(true)" class="primary-btn">Try Again</button>`;
};

const changeContentSmooth = async (content) => {
	content.classList.add('fade');
	setTimeout(() => {
		content.classList.remove('fade');
		spinner.style.display = 'none';
	}, STD_DELAY);
};

const displayFeedback = async (icon, color) => {
	if (icon && color) {
		feedback.style.backgroundColor = color;
		feedback.firstElementChild.classList.replace('fa-check-circle', icon);
		feedback.lastElementChild.innerHTML = `Correct:<br><span class="feedback-answer">${quizData[currentQuestion].correct_answer}</span>`;
		feedback.lastElementChild.classList.remove('hidden');
	}
	feedback.style.zIndex = 1;
	feedback.classList.remove('fade');
	setTimeout(() => {
		feedback.classList.add('fade');
		feedback.style.zIndex = -1;
		if (icon && color) {
			setTimeout(() => {
				feedback.style.backgroundColor = '#72bd74de';
				feedback.firstElementChild.classList.replace(icon, 'fa-check-circle');
				feedback.lastElementChild.classList.add('hidden');
			}, STD_DELAY);
		}
	}, STD_DELAY);
};

submitBtn.addEventListener('click', async () => {
	const answer = getAnswer();
	if (answer) {
		if (
			answer.nextElementSibling.innerText ===
			quizData[currentQuestion].correct_answer
		) {
			score++;
			await displayFeedback();
		} else {
			await displayFeedback(ERROR_ICON, ERROR_COLOR);
		}
		currentQuestion++;
		changeContentSmooth(quizContainer);
		if (currentQuestion < quizData.length) {
			setTimeout(() => {
				loadQuiz(currentQuestion);
			}, STD_DELAY / 2);
		} else {
			setTimeout(() => {
				loadEndState();
			}, STD_DELAY / 2);
		}
	}
});

startBtn.addEventListener('click', async () => {
	await fetchQuizQuestions();
	startState.style.display = 'none';
	loadQuizState();
	loadQuiz(currentQuestion);
});

categoryCards.forEach((card) => {
	card.addEventListener('click', async () => {
		const AllIDs = await axios.get('https://opentdb.com/api_category.php');
		for (const category of AllIDs.data.trivia_categories) {
			if (category.name.includes(card.id)) {
				await fetchQuizQuestions(category.id);
				break;
			}
		}
		startState.style.display = 'none';
		loadQuizState();
		loadQuiz(currentQuestion);
	});
});

const fetchQuizQuestions = async (category) => {
	let res = undefined;
	try {
		if (category) {
			res = await axios.get(
				`https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`
			);
		} else {
			res = await axios.get(
				'https://opentdb.com/api.php?amount=10&type=multiple'
			);
		}
		setQuizData(res.data.results);
	} catch (error) {
		console.log('Error Fetching Questions!', error);
		// Implement Error State, like a reload button or smthng.
	}
};

const setQuizData = (questionList) => {
	for (const questionObj of questionList) {
		quizData.push(questionObj);
	}
};
