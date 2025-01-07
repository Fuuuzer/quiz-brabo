const container = document.querySelector('main');
const title = document.querySelector('.question-title');
const options = document.querySelector('.options');

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
   new Question('Quantos continentes existem no planeta?', ['5', '6', '7', '8'], 2),
   new Question('Quem escreveu "Dom Casmurro"?', ['Machado de Assis', 'Clarice Lispector', 'Monteiro Lobato', 'José de Alencar'], 0),
   new Question('Qual é o símbolo químico do ouro?', ['Au', 'Ag', 'Fe', 'O'], 0),
   new Question('Quem foi o primeiro presidente dos Estados Unidos?', ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'], 1),
   new Question('Qual é o idioma mais falado no mundo?', ['Inglês', 'Mandarim', 'Espanhol', 'Francês'], 1),
   new Question('Quem descobriu a teoria da relatividade?', ['Isaac Newton', 'Albert Einstein', 'Galileu Galilei', 'Nikola Tesla'], 1)
]

let currentQuestionIndex = 0;

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

    const options = document.querySelectorAll('.option');
    options.forEach((option, i) => {
      option.addEventListener('click', function() {
        if(!question.isCorrect(i)) {      
          option.classList.toggle('red');
          setTimeout(() => {
            displayQuestion()
          }, 1500)
        } else {
          option.classList.toggle('green');
          setTimeout(() => {
            nextQuestion();
          }, 1500)
        }
      })
    })
}

function nextQuestion() {
  currentQuestionIndex = (currentQuestionIndex + 1) % quizQuestions.length;
  displayQuestion()
}

displayQuestion()
