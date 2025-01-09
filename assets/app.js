import { quizQuestions } from "./quiz-questions.js";

const container = document.querySelector('main');
const title = document.querySelector('.question-title');
const options = document.querySelector('.options');
const points = document.querySelector('.points');
const btnStart = document.querySelector('.btn');
const inputUser = document.querySelector('.input-username');
const containerStart = document.querySelector ('.container-start');

let currentQuestionIndex = 0;
let acertos = 0;
let erros = 0;
let errorMessage = containerStart.querySelector('.error-message');
let quizStarted = false;

points.style.display = 'none';


function handleClick() {
  if (inputUser.value === '') {
    if (!errorMessage) {
      errorMessage = document.createElement('p');
      errorMessage.classList.add('error-message');
      containerStart.appendChild(errorMessage)
    }
    errorMessage.innerText = 'É necessário digitar um nome'
    } else {
      inputUser.value = '';
    if (errorMessage) {
      errorMessage.remove()
    }

    quizStarted = true;
    saveToStorage('quizStarted', true)
    points.style.display = 'block';
    points.innerText = `Pontos: 0`
    containerStart.classList.add('hidden');
    containerStart.classList.remove('visible');
    container.classList.remove('hidden');
    points.classList.remove('hidden');
    displayQuestion()
  }
}

btnStart.addEventListener('click', handleClick);

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key, defaultValue = null) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
}

const savedQuestionIndex = loadFromStorage('currentQuestionIndex');
const savedPoints = loadFromStorage('points');
const savedQuizStarted = loadFromStorage('quizStarted', false);

if (savedQuizStarted) {

  currentQuestionIndex = savedQuestionIndex ?? 0;
  acertos = savedPoints ?? 0;
  points.innerText = `Pontos: ${acertos}`;

  quizStarted = true;

  containerStart.classList.add('hidden');
  points.style.display = 'block';
  container.classList.remove('hidden');
  displayQuestion()
} else {
  containerStart.classList.remove('hidden')
  container.classList.add('hidden');
  points.style.display = 'none';
}


function updatePoints(currentPoints) {
  if (!quizStarted) return;

    acertos++;
    points.innerText = `Pontos: ${acertos}`;
    saveToStorage('points', acertos);
}

function removeQuiz() {
  container.classList.add('hidden');
  points.classList.add('hidden');
  containerStart.classList.add('visible')
  containerStart.classList.remove('hidden')
}

function displayQuestion() {
  const question = quizQuestions[currentQuestionIndex];

  container.innerHTML = `
    <div class="question">
      <h3 class="question-title">${question.question}</h2>
    </div>

    <ul class="options">
      ${question.options.map((option, index) => `<li class="option" data-index="${index}">${option}</li>`).join('')}
    </ul>`;


    let answered = false;

    const options = document.querySelectorAll('.option');
    options.forEach((option, i) => {
      option.addEventListener('click', function() {

        if (answered) return;
        answered = true;
        // lógica para o usuario nao poder clicar varias x

        if(!question.isCorrect(i)) {
          erros++;
          option.classList.add('red');
          setTimeout(() => {
            displayQuestion()
          }, 1500)
          if(erros === 2) {
            erros = 0;
            acertos = 0;
            currentQuestionIndex = 0;
            localStorage.clear();

            setTimeout(() => {
              removeQuiz();
              points.style.display = 'none';

              points.innerText = `Pontos: 0`;
            }, 1500);
          }
        } else {
          option.classList.toggle('green');
          updatePoints()
          setTimeout(() => {
            nextQuestion();
          }, 1500)
        }

      })
    })
}

function nextQuestion() {
  currentQuestionIndex++;

  saveToStorage('currentQuestionIndex', currentQuestionIndex);
  saveToStorage('points', acertos);

  if(currentQuestionIndex < quizQuestions.length) {
    displayQuestion()
  } else {
     container.innerHTML = `<h1 class="title-final">Quiz finalizado</h1>
     <p>Parabéns, você fez ${acertos} pontos</p>`

     localStorage.removeItem('currentQuestionIndex');
     localStorage.removeItem('points');
  }
}