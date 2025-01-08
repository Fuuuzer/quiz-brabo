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

// console.log(inputUser)

btnStart.addEventListener('click', () => {
  if (inputUser.value === '') {
    if (!errorMessage) {
      errorMessage = document.createElement('p');
      errorMessage.classList.add('error-message');
      containerStart.appendChild(errorMessage)
    }
    errorMessage.innerText = 'É necessário digitar um nome'
    containerStart.appendChild(notUsername)
    } else {
    if (errorMessage) {
      errorMessage.remove()
    }
    displayQuestion()
    updatePoints(0)
  }

});

const savedQuestionIndex = localStorage.getItem('currentQuestionIndex');
const savedPoints = localStorage.getItem('points');

if (savedQuestionIndex !== null) {
  currentQuestionIndex = parseInt(savedQuestionIndex, 10);
}

if (savedPoints !== null) {
  acertos = parseInt(savedPoints, 10);
  points.innerText= `Pontos: ${acertos}`;
}


function updatePoints(currentPoints) {
  if (currentPoints === 0) {
    points.innerText = `Pontos: ${currentPoints}`;
    localStorage.setItem('points', 0);
  } else {
    acertos++;
    points.innerText = `Pontos: ${acertos}`;
    localStorage.setItem('points', acertos);
  }
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
          if(erros === 2) {
            erros = 0;
            acertos = 0;
            currentQuestionIndex = 0;
            localStorage.setItem('currentQuestionIndex', 0);
            localStorage.setItem('points', 0);
            setTimeout(() => {
              displayQuestion()
              updatePoints(0)
            }, 1500);
          }

          option.classList.toggle('red');
          setTimeout(() => {
            displayQuestion()
          }, 1500)
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

  localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
  localStorage.setItem('points', acertos)

  if(currentQuestionIndex < quizQuestions.length) {
    displayQuestion()
  } else {
     container.innerHTML = `<h1 class="title-final">Quiz finalizado</h1>
     <p>Parabéns, você fez ${acertos} pontos</p>`

     localStorage.removeItem('currentQuestionIndex');
     localStorage.removeItem('points');
  }
}