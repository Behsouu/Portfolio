// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const ariaAnnouncer = document.getElementById('aria-announcer');

const screens = document.querySelectorAll('.screen');
const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const categorySelect = document.getElementById('category-select');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
const timerToggle = document.getElementById('timer-toggle');
const startBtn = document.getElementById('start-btn');
const bestScoreHome = document.getElementById('best-score-home');

const quizStatus = document.getElementById('quiz-status');
const timerDisplay = document.getElementById('timer-display');
const timeLeftSpan = document.getElementById('time-left');
const currentScoreSpan = document.getElementById('current-score');
const progressBar = document.getElementById('progress-bar');
const questionText = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');
const feedbackContainer = document.getElementById('feedback-container');
const quitBtn = document.getElementById('quit-btn');
const nextBtn = document.getElementById('next-btn');

const finalScoreValue = document.getElementById('final-score-value');
const highScoreMsg = document.getElementById('high-score-msg');
const summaryList = document.getElementById('summary-list');
const replayBtn = document.getElementById('replay-btn');

// State Variables
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft;
let isTimerActive = false;
let userAnswers = []; // Store user answers for summary

const TIME_PER_QUESTION = 15;
const BASE_POINTS = 10;

// ==========================================
// Initialization & Theme
// ==========================================

function init() {
    loadTheme();
    populateCategories();
    updateHomeHighScore();

    // Event Listeners
    themeToggle.addEventListener('click', toggleTheme);
    startBtn.addEventListener('click', startQuiz);
    quitBtn.addEventListener('click', quitQuiz);
    nextBtn.addEventListener('click', handleNext);
    replayBtn.addEventListener('click', () => switchScreen(homeScreen));

    // Update high score display when changing category/difficulty
    categorySelect.addEventListener('change', updateHomeHighScore);
    difficultyRadios.forEach(radio => radio.addEventListener('change', updateHomeHighScore));
}

function loadTheme() {
    const savedTheme = localStorage.getItem('quiz-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('quiz-theme', newTheme);
    updateThemeIcon(newTheme);
    announceToScreenReader(`Thème ${newTheme === 'dark' ? 'sombre' : 'clair'} activé.`);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// ==========================================
// Setup
// ==========================================

function populateCategories() {
    // Extract unique categories from questions
    const categories = [...new Set(quizQuestions.map(q => q.category))];

    // Add 'All' option first
    const allOption = document.createElement('option');
    allOption.value = 'Toutes';
    allOption.textContent = 'Toutes les catégories';
    categorySelect.appendChild(allOption);

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

function getSelectedDifficulty() {
    const checked = document.querySelector('input[name="difficulty"]:checked');
    return checked ? checked.value : 'Easy';
}

function updateHomeHighScore() {
    const category = categorySelect.value;
    const difficulty = getSelectedDifficulty();
    const key = `quiz-highscore-${category}-${difficulty}`;
    const score = localStorage.getItem(key) || 0;
    bestScoreHome.textContent = score;
}

// Array shuffle helper function
function shuffleArray(array) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

// ==========================================
// Quiz Flow
// ==========================================

function startQuiz() {
    const category = categorySelect.value;
    const difficulty = getSelectedDifficulty();
    isTimerActive = timerToggle.checked;

    // Filter questions
    let filtered = quizQuestions.filter(q => q.difficulty === difficulty);
    if (category !== 'Toutes') {
        filtered = filtered.filter(q => q.category === category);
    }

    if (filtered.length === 0) {
        alert("Aucune question trouvée pour cette catégorie et difficulté.");
        return;
    }

    // Shuffle questions
    currentQuestions = shuffleArray(filtered).slice(0, 10); // Max 10 questions per run

    // Reset state
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    currentScoreSpan.textContent = score;

    // UI prep
    timerDisplay.classList.toggle('hidden', !isTimerActive);

    switchScreen(quizScreen);
    loadQuestion();
    announceToScreenReader('Le quiz a commencé.');
}

function loadQuestion() {
    const q = currentQuestions[currentQuestionIndex];

    // Reset UI
    nextBtn.classList.add('hidden');
    feedbackContainer.classList.add('hidden');
    feedbackContainer.innerHTML = '';

    // Enable choices container
    choicesContainer.classList.remove('disabled');
    choicesContainer.innerHTML = '';

    // Update Header info
    quizStatus.textContent = `Question ${currentQuestionIndex + 1}/${currentQuestions.length}`;

    // Update Progress Bar
    const progressPercent = ((currentQuestionIndex) / currentQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressBar.setAttribute('aria-valuenow', progressPercent);

    // Set Question text
    questionText.textContent = q.question;
    announceToScreenReader(`Question ${currentQuestionIndex + 1} : ${q.question}`);

    // Shuffle choices logic
    // We need to keep track of the correct answer string value, since we shuffle
    const correctString = q.choices[q.answerIndex];
    const shuffledChoices = shuffleArray(q.choices);

    // Create buttons
    shuffledChoices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice;
        btn.setAttribute('aria-label', `Choix: ${choice}`);

        btn.addEventListener('click', () => handleAnswer(choice, correctString, q));
        choicesContainer.appendChild(btn);
    });

    // Timer
    if (isTimerActive) {
        startTimer();
    }

    // Focus first button for keyboard users
    setTimeout(() => {
        const firstBtn = choicesContainer.querySelector('button');
        if (firstBtn) firstBtn.focus();
    }, 100);
}

function startTimer() {
    clearInterval(timer);
    timeLeft = TIME_PER_QUESTION;
    updateTimerDisplay();

    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            const q = currentQuestions[currentQuestionIndex];
            const correctString = q.choices[q.answerIndex];
            handleAnswer(null, correctString, q); // Timeout = null answer
        }
    }, 1000);
}

function updateTimerDisplay() {
    timeLeftSpan.textContent = timeLeft;
    timerDisplay.classList.toggle('critical', timeLeft <= 5);
}

function handleAnswer(selectedString, correctString, questionObj) {
    if (isTimerActive) clearInterval(timer);

    const isCorrect = selectedString === correctString;

    // Points calculation
    if (isCorrect) {
        let earned = BASE_POINTS;
        if (isTimerActive) {
            // Bonus points based on time left
            earned += Math.floor(timeLeft / 2);
        }
        score += earned;
        currentScoreSpan.textContent = score;
    }

    // Store answer for summary
    userAnswers.push({
        question: questionObj.question,
        selected: selectedString,
        correct: correctString,
        isCorrect: isCorrect
    });

    // Disable all buttons and show colors
    const buttons = choicesContainer.querySelectorAll('.choice-btn');
    buttons.forEach(btn => {
        btn.disabled = true;

        if (btn.textContent === correctString) {
            btn.classList.add('correct');
            // Add icon
            const icon = document.createElement('i');
            icon.className = 'fas fa-check-circle';
            btn.appendChild(icon);
        } else if (btn.textContent === selectedString) {
            btn.classList.add('wrong');
            const icon = document.createElement('i');
            icon.className = 'fas fa-times-circle';
            btn.appendChild(icon);
        }
    });

    // Show Feedback container
    feedbackContainer.classList.remove('hidden');
    feedbackContainer.classList.remove('success', 'error');

    const feedbackTitle = document.createElement('div');
    feedbackTitle.className = 'feedback-title';

    if (selectedString === null) {
        feedbackContainer.classList.add('error');
        feedbackTitle.innerHTML = `<i class="fas fa-clock"></i> Temps écoulé !`;
        announceToScreenReader('Temps écoulé. Réponse incorrecte.');
    } else if (isCorrect) {
        feedbackContainer.classList.add('success');
        feedbackTitle.innerHTML = `<i class="fas fa-check"></i> Bonne réponse !`;
        announceToScreenReader('Bonne réponse.');
    } else {
        feedbackContainer.classList.add('error');
        feedbackTitle.innerHTML = `<i class="fas fa-times"></i> Mauvaise réponse.`;
        announceToScreenReader('Mauvaise réponse.');
    }

    const feedbackText = document.createElement('p');
    feedbackText.className = 'feedback-text';
    feedbackText.textContent = questionObj.explanation;

    feedbackContainer.appendChild(feedbackTitle);
    feedbackContainer.appendChild(feedbackText);

    // Show next button and focus it
    nextBtn.classList.remove('hidden');

    // Slight delay for focus to let screen reader read explanation
    setTimeout(() => nextBtn.focus(), 500);
}

function handleNext() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    // Fill 100% on progress bar before switching
    progressBar.style.width = `100%`;
    progressBar.setAttribute('aria-valuenow', 100);

    // Populate Results
    finalScoreValue.textContent = score;

    // Save high score
    const category = categorySelect.value;
    const difficulty = getSelectedDifficulty();
    const key = `quiz-highscore-${category}-${difficulty}`;
    const prevHigh = parseInt(localStorage.getItem(key)) || 0;

    if (score > prevHigh) {
        localStorage.setItem(key, score);
        highScoreMsg.classList.remove('hidden');
    } else {
        highScoreMsg.classList.add('hidden');
    }

    // Generate summary
    summaryList.innerHTML = '';
    userAnswers.forEach((ans, idx) => {
        const li = document.createElement('li');
        li.className = `summary-item ${ans.isCorrect ? 'correct' : 'incorrect'}`;

        let htmlStr = `<div class="summary-q">${idx + 1}. ${ans.question}</div>`;
        htmlStr += `<div class="summary-a">`;

        if (ans.isCorrect) {
            htmlStr += `<span class="correct-choice"><i class="fas fa-check"></i> ${ans.correct}</span>`;
        } else {
            const userStr = ans.selected === null ? "Non répondu" : ans.selected;
            htmlStr += `<span class="wrong-choice"><i class="fas fa-times"></i> ${userStr}</span>`;
            htmlStr += `<span class="correct-choice">Correcte : ${ans.correct}</span>`;
        }
        htmlStr += `</div>`;

        li.innerHTML = htmlStr;
        summaryList.appendChild(li);
    });

    switchScreen(resultScreen);
    updateHomeHighScore();

    announceToScreenReader(`Quiz terminé. Votre score est de ${score} points.`);
    setTimeout(() => replayBtn.focus(), 500);
}

function quitQuiz() {
    if (confirm("Êtes-vous sûr de vouloir quitter la partie en cours ?")) {
        if (isTimerActive) clearInterval(timer);
        switchScreen(homeScreen);
        announceToScreenReader('Vous avez quitté le quiz.');
    }
}

// ==========================================
// Utils
// ==========================================

function switchScreen(activeScreen) {
    screens.forEach(screen => {
        if (screen === activeScreen) {
            screen.classList.add('active');
            screen.classList.remove('hidden');
        } else {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        }
    });
}

function announceToScreenReader(message) {
    if (!ariaAnnouncer) return;
    ariaAnnouncer.textContent = message;

    // Clear out after short delay so repeated messages are re-announced
    setTimeout(() => {
        ariaAnnouncer.textContent = '';
    }, 1000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
