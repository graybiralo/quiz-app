// Constants for DOM elements
const questionContainer = document.getElementById("question-container");
const choicesContainer = document.getElementById("choices-container");
const submitButton = document.getElementById("submit-btn");
const feedbackContainer = document.getElementById("feedback-container");
const scoreContainer = document.getElementById("score-container");
const quizHeaders = document.querySelectorAll('.quiz-header');
const timerContainer = document.getElementById("timer-container");
const timerElement = document.getElementById("timer");

// varaibles
let questionData;
let currentCategory = 'css';
let currentQuestionIndex = 0;
let currentQuestion;
let score = 0;
let bestScores = {};
let selectedChoiceIndex;
let timer;
let timeLeft = 15; //in seconds

// Fetch questions and initialize the quiz
async function initializeQuiz() {
  questionData = await fetchQuestions();
  quizHeaders.forEach(header => {
    header.addEventListener('click', () => {
      currentCategory = header.id.replace('-quiz-header', '');
      startQuiz();
    });
  });
  
}

// Shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Display question and choices
function displayQuestion(question) {
  // Clear any previous content
  questionContainer.textContent = "";
  choicesContainer.textContent = "";

  // Display the question
  const questionText = document.createElement('div');
  questionText.classList.add('question-containers');
  questionText.textContent = question.question;
  questionContainer.appendChild(questionText);

  // Display choices with event listeners
  question.options = shuffleArray(question.options);
  question.options.forEach((option, index) => {
    const choice = document.createElement('div');
    choice.classList.add('choice');
    choice.textContent = option;
    choice.addEventListener('click', () => handleChoiceClick(index));
    choicesContainer.appendChild(choice);
  });

  choicesContainer.style.display = "block";
  submitButton.style.display = "none";
  feedbackContainer.style.display = "none";

  // Start the timer for each question
  startTimer();
}

// Start the timer
function startTimer() {
  timeLeft = 15; 
  updateTimer();
  timerContainer.style.display = "block";
  timer = setInterval(updateTimer, 1000); // Update every second
}

// Update the timer display
function updateTimer() {
  if (timeLeft > 0) {
    timerElement.textContent = timeLeft;
    timeLeft--;
  } else {
    clearInterval(timer);
    timerContainer.style.display = "none";
    handleTimeout();
  }
}

// Handle timeout
function handleTimeout() {
  feedbackContainer.style.display = "block";
  feedbackContainer.textContent = "Time's up!";
  feedbackContainer.style.color = "red";
  setTimeout(startNextQuestion, 1000); // Delay before moving to the next question
}


// Handle choice click
function handleChoiceClick(choiceIndex) {
  // Remove the "selected" class from all choices
  const choices = choicesContainer.querySelectorAll('.choice');
  choices.forEach(choice => choice.classList.remove('selected'));

  
  const clickedChoice = choices[choiceIndex];
  clickedChoice.classList.add('selected');

  selectedChoiceIndex = choiceIndex;
  submitButton.style.display = "block"; 
  feedbackContainer.textContent = ""; 
}

// Start the quiz
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  feedbackContainer.textContent = "";
  scoreContainer.textContent = "";
  questionData[currentCategory] = shuffleArray(questionData[currentCategory]);
  startNextQuestion();
}


// Select an answer
function selectOption(selectedAnswer, optionIndex) {
  const correctAnswer = currentQuestion.answer;
  if (selectedAnswer === correctAnswer) {
    score++;
  }
  submitButton.style.display = "block";
}



// submit button click
function submitAnswer() {
  if (selectedChoiceIndex !== null) {
    const correctAnswerIndex = currentQuestion.options.indexOf(currentQuestion.answer);

    if (selectedChoiceIndex === correctAnswerIndex) {
      score += 1;
      feedbackContainer.textContent = "Correct!";
      feedbackContainer.style.color = "green"
    } else {
      feedbackContainer.textContent = "Incorrect!";
      feedbackContainer.style.color = "red"
    }

    scoreContainer.textContent = `Score: ${score}`;
    submitButton.style.display = "none";

    // Show feedback and then move to the next question
    displayFeedbackAndMoveToNextQuestion();
  }
}

function displayFeedbackAndMoveToNextQuestion() {
  feedbackContainer.style.display = "block";
  setTimeout(() => {
    feedbackContainer.style.display = "none";
    startNextQuestion();
  }, 1000);
}


// Move to the next question
function startNextQuestion() {
  clearInterval(timer);
  
  if (currentQuestionIndex <= (questionData[currentCategory].length - 1)) {
    currentQuestion = questionData[currentCategory][currentQuestionIndex];
    currentQuestionIndex++;
    displayQuestion(currentQuestion);
  } else {
    displayFinalScore();
  }
}


// Display final score
function displayFinalScore() {
  questionContainer.textContent = "Quiz Completed!";
  choicesContainer.innerHTML = "";
  feedbackContainer.textContent = `Your final score: ${score}`;
  saveHighScore(score);
  displayHighScore();
  timerContainer.style.display = "none";
}

// Save high score
function saveHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  highScores.push(score);
  highScores.sort((a, b) => b - a); // Sort in descending order
  localStorage.setItem('highScores', JSON.stringify(highScores));
}

// Display high scores

function displayHighScore() {
  scoreContainer.innerHTML = "<h2>Thank You</h2>";
  const ul = document.createElement('ul');

  if (!bestScores[currentCategory] || score > bestScores[currentCategory]) {
    bestScores[currentCategory] = score; 
  }

  const li = document.createElement('li');
  li.textContent = `Your score: ${score}, Best high score for ${
    currentCategory.toUpperCase()
  }: ${bestScores[currentCategory] || 0}`;
  ul.appendChild(li);

  scoreContainer.appendChild(ul);
  
}


// Fetch questions from JSON file
async function fetchQuestions() {
  try {
    const response = await fetch('questions.json');
    const data = await response.json();

    // Shuffle questions within each category
    for (const category in data) {
      if (data.hasOwnProperty(category)) {
        data[category] = shuffleArray(data[category]);
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return null;
  }
}


// Initialize the quiz when the page loads
window.addEventListener('load', initializeQuiz);
