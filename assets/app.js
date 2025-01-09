import { quizQuestions } from "./quiz-questions.js";

const container = document.querySelector('main');
const title = document.querySelector('.question-title');
const options = document.querySelector('.options');
const points = document.querySelector('.points');
const btnStart = document.querySelector('.btn');
const inputUser = document.querySelector('.input-username');
const containerStart = document.querySelector ('.container-start')

let currentQuestionIndex = 0;
let acertos = 0;
let erros = 0;
let errorMessage = containerStart.querySelector('.error-message');
let quizStarded = false;

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

    quizStarded = true;
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

if (savedQuestionIndex !== null) {
  currentQuestionIndex = parseInt(savedQuestionIndex, 10);
}

if (savedPoints !== null) {
  acertos = parseInt(savedPoints, 10);
  points.innerText= `Pontos: ${acertos}`;
}


function updatePoints(currentPoints) {
  if (!quizStarded) return

  if (currentPoints === 0) {
    points.innerText = `Pontos: ${currentPoints}`;
    saveToStorage('points', 0);
  } else {
    acertos++;
    points.innerText = `Pontos: ${acertos}`;
    saveToStorage('points', acertos);
  }
}

function removeQuiz() {
  container.classList.add('hidden');
  points.classList.add('hidden');

  const btnStart = document.querySelector('.btn');
  btnStart.addEventListener('click', handleClick);
  containerStart.classList.add('visible')
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
            saveToStorage('currentQuestionIndex', 0);
            saveToStorage('points', 0);

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