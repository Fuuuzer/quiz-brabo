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
   new Question('Por que a banana é amarela?', ['Sei la poar', 'Pq deus quis', 'Macacoo', 'A banana madura consegue esse tom amarelado devido ao envelhecimento da clorofila'], 3),
   new Question('Por que a maçã é vermelha?', ['Jonas broter', 'ohayoo', 'asuidfhsdfh', 'maçã'], 3)
]

let currentQuestionIndex = 0;

function displayQuestion() {
  const question = quizQuestions[currentQuestionIndex]
  quizQuestions.forEach((question, index) => {
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
        } else {
          option.classList.toggle('green');
          setTimeout(() => {
            nextQuestion();
          }, 2000)
        }
      })
    })
  });
}

function nextQuestion() {
  currentQuestionIndex = (currentQuestionIndex + 1) % quizQuestions.length;
  displayQuestion()
}

displayQuestion()
