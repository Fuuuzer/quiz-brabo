const container = document.querySelector('main');
const title = document.querySelector('.question-title');
const options = document.querySelector('.options');
const points = document.querySelector('.points');

class Question {
  constructor(question, options, correctAnswer) {
    this.question = question;
    this.options = options;
    this.correctAnswer = correctAnswer;
  }

  isCorrect(userAnswer) {
    return userAnswer === this.correctAnswer
  }
};

const quizQuestions = [
  //  new Question('Por que a banana é amarela?', ['Sei la poar', 'Pq deus quis', 'Macacoo', 'A banana madura consegue esse tom amarelado devido ao envelhecimento da clorofila'], 3),
  //  new Question('Por que a maçã é vermelha?', ['Jonas broter', 'ohayoo', 'asuidfhsdfh', 'maçã'], 3),
   new Question('Qual é a capital do Brasil?', ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'], 2),
   new Question('Quem pintou a Mona Lisa?', ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Michelangelo'], 2),
   new Question('Qual é o maior planeta do sistema solar?', ['Terra', 'Marte', 'Júpiter', 'Saturno'], 2),
   new Question('Em que ano o homem pisou na Lua pela primeira vez?', ['1969', '1971', '1955', '1983'], 0),
   new Question('Quantos continentes existem no planeta?', ['5', '6', '7', '8'], 1),
   new Question('Quem escreveu "Dom Casmurro"?', ['Machado de Assis', 'Clarice Lispector', 'Monteiro Lobato', 'José de Alencar'], 0),
   new Question('Qual é o símbolo químico do ouro?', ['Au', 'Ag', 'Fe', 'O'], 0),
   new Question('Quem foi o primeiro presidente dos Estados Unidos?', ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'], 1),
   new Question('Qual é o idioma mais falado no mundo?', ['Inglês', 'Mandarim', 'Espanhol', 'Francês'], 1),
   new Question('Quem descobriu a teoria da relatividade?', ['Isaac Newton', 'Albert Einstein', 'Galileu Galilei', 'Nikola Tesla'], 1)
]

let currentQuestionIndex = 0;
let acertos = 0;
let erros = 0;

function updatePoints(currentPoints) {
  if (currentPoints === 0) {
    points.innerText = `Pontos: ${currentPoints}`;
  } else {
    acertos++; 
    points.innerText = `Pontos: ${acertos}`;
  }
}

function displayQuestion() {
  const question = quizQuestions[currentQuestionIndex]
  container.innerHTML = `
    <div class="question">
      <!-- <p class="question-number">Pergunta 1</p> -->
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

function nextQuestion(err) {
  currentQuestionIndex++;
  if(currentQuestionIndex < quizQuestions.length) {
    displayQuestion()
  } else {
     container.innerHTML = `<h1 class="title-final">Quiz finalizado</h1>
     <p>Parabéns, você fez ${acertos} pontos</p>`
  }
}

displayQuestion()