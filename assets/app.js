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

// quizQuestions.forEach((question, index) => {
//   console.log(`Pergunta ${index + 1}: ${question.question}`);
//   console.log('Opções:');
//   question.options.forEach((option, i) => {
//     console.log(`${i + 1}. ${option}`)
//   })
// });

quizQuestions.forEach((question, index) => {
container.innerHTML = `
  <div class="question">
    <!-- <p class="question-number">Pergunta 1</p> -->
    <h3 class="question-title">${question.question}</h2>
  </div>

  <ul class="options">
    ${question.options.map((option, i) => `<li class="option">${option}</li>`).join('')}
  </ul>`;
});