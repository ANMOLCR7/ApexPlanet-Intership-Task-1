// Cache all DOM elements
const elements = {
  quiz: {
    question: document.getElementById("question"),
    answers: document.getElementById("answers"),
    nextBtn: document.getElementById("nextBtn"),
    resetBtn: document.getElementById("resetBtn"),
    result: document.getElementById("result"),
    progress: document.getElementById("progress"),
  },
  joke: {
    button: document.getElementById("getJoke"),
    container: document.getElementById("joke"),
  },
};

// Quiz Configuration
const quizData = [
  {
    question: "What does CSS stand for?",
    answers: [
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
    ],
    correct: 1,
  },
  {
    question: "Which tag is used for JavaScript?",
    answers: ["<js>", "<javascript>", "<script>"],
    correct: 2,
  },
  {
    question: "Which language runs in the browser?",
    answers: ["Python", "JavaScript", "C++"],
    correct: 1,
  },
];

// Quiz State
const quizState = {
  currentQuestion: 0,
  score: 0,
  selectedAnswer: null,
};

// ========== INTERACTIVE QUIZ ==========
// Pre-create buttons once for reuse
const answerButtons = quizData[0].answers.map(() => {
  const button = document.createElement("button");
  button.className = "answer-btn";
  return button;
});

function loadQuiz() {
  const question = quizData[quizState.currentQuestion];
  elements.quiz.question.textContent = question.question;
  elements.quiz.answers.innerHTML = "";
  quizState.selectedAnswer = null;

  // Update progress
  elements.quiz.progress.textContent = `Question ${
    quizState.currentQuestion + 1
  } of ${quizData.length}`;

  // Reuse existing buttons instead of creating new ones
  question.answers.forEach((answer, index) => {
    const button = answerButtons[index];
    button.textContent = answer;
    button.className = "answer-btn"; // Reset classes
    button.onclick = () => selectAnswer(index, button);
    elements.quiz.answers.appendChild(button);
  });

  // Reset next button
  elements.quiz.nextBtn.textContent =
    quizState.currentQuestion === quizData.length - 1
      ? "Finish Quiz"
      : "Next Question";
  elements.quiz.nextBtn.disabled = true;
  elements.quiz.result.textContent = "";
  elements.quiz.result.className = "";
}

function selectAnswer(index, button) {
  // Reset all buttons
  const allButtons = elements.quiz.answers.querySelectorAll(".answer-btn");
  allButtons.forEach((btn) => {
    btn.classList.remove("selected", "correct", "incorrect");
  });

  // Mark selected button
  button.classList.add("selected");
  quizState.selectedAnswer = index;
  elements.quiz.nextBtn.disabled = false;
}

function showResult() {
  const allButtons = elements.quiz.answers.querySelectorAll(".answer-btn");
  const correctIndex = quizData[quizState.currentQuestion].correct;

  // Mark correct and incorrect answers
  allButtons.forEach((button, index) => {
    if (index === correctIndex) {
      button.classList.add("correct");
    } else if (index === quizState.selectedAnswer && quizState.selectedAnswer !== correctIndex) {
      button.classList.add("incorrect");
    }
  });

  // Update score if correct
  if (quizState.selectedAnswer === correctIndex) {
    quizState.score++;
  }
}

// Modify the click handler to remove setTimeout
elements.quiz.nextBtn.addEventListener("click", () => {
  if (quizState.selectedAnswer !== null) {
    showResult();
    
    // Remove setTimeout and process immediately
    if (quizState.currentQuestion < quizData.length - 1) {
      quizState.currentQuestion++;
      loadQuiz();
    } else {
      // Quiz completed - show final results
      completeQuiz();
    }
  }
});

// Separate function for quiz completion
function completeQuiz() {
  elements.quiz.answers.style.display = "none";
  elements.quiz.nextBtn.style.display = "none";
  elements.quiz.resetBtn.style.display = ""; // Show reset button
  elements.quiz.progress.style.display = "none";
  elements.quiz.question.textContent = "Quiz Completed!";
  
  const emoji = quizState.score === quizData.length ? " 🎉 Excellent!" :
               quizState.score >= quizData.length / 2 ? " 👍 Good job!" :
               " 💪 Keep practicing!";
               
  elements.quiz.result.textContent = `Your Score: ${quizState.score}/${quizData.length}${emoji}`;
  elements.quiz.result.className = "success";
}

// Add reset function
function resetQuiz() {
  // Reset state
  quizState.currentQuestion = 0;
  quizState.score = 0;
  quizState.selectedAnswer = null;

  // Reset UI
  elements.quiz.answers.style.display = "";
  elements.quiz.nextBtn.style.display = "";
  elements.quiz.resetBtn.style.display = "none";
  elements.quiz.progress.style.display = "";
  
  // Load first question
  loadQuiz();
}

// Add reset button event listener
elements.quiz.resetBtn.addEventListener("click", resetQuiz);

// Initialize quiz
loadQuiz();

// ========== FETCH API (JOKE) ==========
// Joke API Configuration
const JOKE_API_URL = "https://v2.jokeapi.dev/joke/Programming?type=single";

// Joke Functions
async function fetchJoke() {
  const { button, container } = elements.joke;
  
  container.textContent = "Loading joke...";
  container.className = "loading pulse";
  button.disabled = true;
  button.textContent = "Loading...";

  try {
    const response = await fetch(JOKE_API_URL);
    const data = await response.json();

    container.textContent = data.joke || "No joke found! Try again.";
    container.className = data.joke ? "" : "loading";
  } catch (error) {
    console.error("Error fetching joke:", error);
    container.textContent = "Failed to fetch joke. Please try again.";
    container.className = "loading";
  } finally {
    button.disabled = false;
    button.textContent = "Get a Programming Joke";
  }
}

// Event Listeners
elements.joke.button.addEventListener("click", fetchJoke);
