const questionContainer = document.getElementById("question-container");
const choicesContainer = document.getElementById("choices-container");
const feedbackContainer = document.getElementById("feedback-container");
const scoreContainer = document.getElementById("score-container");
const submitBtn = document.getElementById("submit-btn");

let currentQuestionIndex = 0;
let score = 0;
let timer;
let questions = null;
let currentCategory = "";

// Fetch the JSON data containing the questions
const fetchQuestions = async () => {
    try {
        const response = await fetch("questions.json");
        if (!response.ok) {
            throw new Error("Failed to fetch questions.");
        }
        questions = await response.json();
    } catch (error) {
        console.error(error);
    }
};


// start the quiz for the selected category
const loadQuiz = (category) => {
  const selectedQuestions = questions[category];
  currentCategory = category;
  startQuiz(selectedQuestions);
  startTimer(); // Start the timer when the quiz starts
};


// Start the quiz
const startQuiz = (questions) => {
    // Randomly shuffle the questions
    shuffleArray(questions);
    currentQuestionIndex = 0;
    score = 0;
    showQuestion(questions[currentQuestionIndex]);
};

// Show a question and its choices
const showQuestion = (question) => {
    questionContainer.innerHTML = question.question;
    choicesContainer.innerHTML = "";

    question.options.forEach((choice) => {
        const choiceElement = document.createElement("div");
        choiceElement.className = "choice";
        choiceElement.textContent = choice;
        choiceElement.addEventListener("click", () => selectAnswer(choice, question.answer));
        choicesContainer.appendChild(choiceElement);
    });
};


// Select an answer
const selectAnswer = (selectedChoice, correctAnswer) => {
  clearTimeout(timer); // Stop the timer

  if (selectedChoice === correctAnswer) {
      score++;
      feedbackContainer.textContent = "Correct!";
      feedbackContainer.style.color = "green";
  } else {
      feedbackContainer.textContent = "Wrong!";
      feedbackContainer.style.color = "red";
  }

  // Move to the next question after a brief delay
  setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions[currentCategory].length) {
          showQuestion(questions[currentCategory][currentQuestionIndex]);
          startTimer();
      } else {
          // End of the quiz for the selected category
          showResults();
      }
  }, 1000);
};

// Show the final results
const showResults = () => {
  questionContainer.innerHTML = "";
  choicesContainer.innerHTML = "";
  feedbackContainer.textContent = "";
  scoreContainer.textContent = `Your Score: ${score}/${questions[currentCategory].length}`;

  // Disable the submit button after the quiz is completed
  submitBtn.disabled = true;
};

// Timer function
const startTimer = () => {
  let timeLeft = 10; // Set the time limit for each question (in seconds)
  const timerContainer = document.createElement("div");
  timerContainer.className = "timer-container";
  questionContainer.appendChild(timerContainer);

  const timerNumber = document.createElement("div");
  timerNumber.className = "timer-number";
  timerContainer.appendChild(timerNumber);

  const updateTimer = () => {
      timerNumber.textContent = timeLeft;
      const percentage = ((10 - timeLeft) / 10) * 100;
      timerContainer.style.background = `conic-gradient(#007bff ${percentage}%, #f0f0f0 ${percentage}% 100%)`;
  };

  const timer = setInterval(() => {
      timeLeft--;

      if (timeLeft < 0) {
          clearTimeout(timer);
          selectAnswer(null, questions[currentCategory][currentQuestionIndex].answer); // Treat as a wrong answer when time runs out
      } else {
          updateTimer();
      }
  }, 1000);

  updateTimer();
};


// Helper function to shuffle the array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
};

// Event listeners for quiz headers
document.getElementById("css-quiz-header").addEventListener("click", () => {
  questionContainer.innerHTML = ""; // Clear the question container
  choicesContainer.innerHTML = ""; // Clear the choices container
  feedbackContainer.textContent = ""; // Clear the feedback container
  scoreContainer.textContent = ""; // Clear the score container
  submitBtn.style.display = "block"; // Show the Submit button
  loadQuiz("css"); // Start the CSS quiz
});

document.getElementById("javascript-quiz-header").addEventListener("click", () => {
  questionContainer.innerHTML = ""; // Clear the question container
  choicesContainer.innerHTML = ""; // Clear the choices container
  feedbackContainer.textContent = ""; // Clear the feedback container
  scoreContainer.textContent = ""; // Clear the score container
  submitBtn.style.display = "block"; // Show the Submit button
  loadQuiz("javascript"); // Start the JavaScript quiz
});

// Fetch the questions on page load
fetchQuestions();

