import { quizQuestions } from "./quiz-questions.js";

const container = document.querySelector('main');
const points = document.querySelector('.points');
const pointsContainer = document.querySelector('.pontos');
const btnStart = document.querySelector('.btn');
const inputUser = document.querySelector('.input-username');
const containerStart = document.querySelector('.container-start');
const title = document.querySelector('.principal-title');
const user = document.querySelector('.user');

let currentQuestionIndex = 0;
let acertos = 0;
let erros = loadFromStorage('tries', 0);
let errorMessage = containerStart.querySelector('.error-message');
let quizStarted = false;
let quizEnded = false;

points.style.display = 'none';


function startQuiz() {
  const userName = inputUser.value.trim();

  if (inputUser.value === '') {

    if (!errorMessage) {
      errorMessage = document.createElement('p');
      errorMessage.classList.add('error-message');
      containerStart.appendChild(errorMessage)
    }
    errorMessage.style.display = 'block'
    errorMessage.innerText = 'É necessário digitar um nome'
  } else if (userName.length < 3) {
    if (!errorMessage) {
      errorMessage = document.createElement('p');
      errorMessage.classList.add('error-message');
      containerStart.appendChild(errorMessage)
    }
    errorMessage.style.display = 'block'
    errorMessage.innerText = 'O nome deve ter pelo menos 3 caracteres';
  } else {
    if (errorMessage) {
      errorMessage.style.display = 'none'
    }

    quizStarted = true;
    acertos = 0;
    erros = 0;
    saveToStorage('quizStarted', true);
    saveToStorage('username', inputUser.value);
    saveToStorage('tries', erros)
    points.style.display = 'block';
    points.innerText = `Pontos: 0`
    containerStart.classList.add('hidden');
    containerStart.classList.remove('visible');
    container.classList.remove('hidden');
    points.classList.remove('hidden');
    user.innerHTML = `Nome: <span>${userName}</span>`;
    pointsContainer.classList.remove('hidden')
    pointsContainer.classList.add('a')
    displayQuestion()
    inputUser.value = '';

  }
}

inputUser.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    startQuiz()
  }
})

btnStart.addEventListener('click', startQuiz);
title.addEventListener('click', () => {
  containerStart.classList.remove('hidden');
  container.classList.add('hidden');
  points.style.display = 'none';
  currentQuestionIndex = 0;
  user.style.display = 'none';
  // user.style.display = 'none';
  localStorage.clear();
})

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
  points.style.display = 'none';
}


function updatePoints() {
  if (!quizStarted) return;

  acertos++;
  points.innerText = `Pontos: ${acertos}`;
  saveToStorage('points', acertos);
}

const username = loadFromStorage('username');

function failQuiz() {
  quizEnded = true;
  container.classList.add('animation');



  switch (true) {
    case acertos <= 2:

      if(acertos === 1){
        container.innerHTML = `<h1 class="title-final">Ruim</h1>
        <p>Poxa, você fez só ${acertos} ponto kkkkkkkkkkkkkk</p>
        <button class='btn btn-retry'>Tentar novamente</button>`;
      } else {
        container.innerHTML = `<h1 class="title-final">bleh</h1>
        <p>Poxa, você fez só ${acertos} pontos kkkk</p>
        <button class='btn btn-retry'>Tentar novamente</button>`;
      }
      break;
    case acertos <= 5:
      container.innerHTML = `<h1 class="title-final">Neandertal</h1>
        <p>Poxa ${username}, você fez apenas ${acertos} pontos hihihih</p>
        <button class='btn btn-retry'>Tentar novamente</button>`;
      break;
    case acertos <= 9:
      container.innerHTML = `<h1 class="title-final">Brabo</h1>
        <p>Parabéms ${username}, você fez ${acertos} pontos</p>
        <button class='btn btn-retry'>Tentar novamente</button>`;
      break;
    case acertos >= 10:
      container.innerHTML = `<h1 class="title-final">GENIO ALBERT EINSTEIN</h1>
        <p>Congratilations ${username}, você é LITERALMENTE um jenio</p>
        <button class='btn btn-retry'>Tentar novamente</button>`;
      break;
  }

  const retryButton = document.querySelector('.btn-retry');

  if (retryButton) {
    retryButton.addEventListener('click', resetQuiz)
  }
  localStorage.removeItem('tries')
}

function resetQuiz() {
  const username = loadFromStorage('username')

  localStorage.removeItem('currentQuestionIndex');
  localStorage.removeItem('points');
  localStorage.removeItem('quizStarted');
  localStorage.removeItem('tries');

  user.innerText = `Nome: ${username}`;

  quizEnded = false;
  quizStarted = true;
  acertos = 0;
  erros = 0;
  currentQuestionIndex = 0;

  points.innerText = 'Pontos: 0';
  points.style.display = 'block';

  displayQuestion()
}

function displayQuestion() {
  if (quizEnded) return;
  container.classList.add('animation')
  const question = quizQuestions[currentQuestionIndex];
  user.style.display = 'block';

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
    option.addEventListener('click', function () {


      if (answered) return;
      answered = true;
      // lógica para o usuario nao poder clicar varias x

      if (!question.isCorrect(i)) {
        erros++;
        saveToStorage('tries', erros)
        option.classList.add('red');
        setTimeout(() => {
          displayQuestion()
        }, 1500)
        if (erros === 2) {
          erros = 0;
          currentQuestionIndex = 0;
          container.classList.remove('animation')

          setTimeout(() => {
            points.style.display = 'none';
            localStorage.removeItem('points');
            localStorage.removeItem('currentQuestionIndex');
            saveToStorage('tries', erros);
            points.innerText = `Pontos: 0`;
            user.style.display = 'none'
            failQuiz()
          }, 1000);
        }
      } else {
        option.classList.toggle('green');
        container.classList.remove('animation')
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

  if (currentQuestionIndex < quizQuestions.length) {
    displayQuestion()
  } else {
    container.innerHTML = `<h1 class="title-final">Quiz finalizado</h1>
     <p>Parabéns, você fez ${acertos} pontos</p>
     <button class='btn btn-retry'>Tentar novamente</button>`

    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('points');
  }
}

// EU NAO AGUENTO MAAAAAAAAAAIIIIIIIIIIIIIIIISSSSSSSSSSSSSSSSSSSSSSS