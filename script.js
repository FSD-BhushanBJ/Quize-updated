// QUIZ GAME (Beginner-Friendly Version)
// =======================================

// --- All questions for each difficulty level ---
var allQuizData = {
    easy: [
        { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "High Tech Modern Language"], answer: 0, hint: "It's related to the structure of web pages." },
        { question: "What does CSS stand for?", options: ["Colorful Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets"], answer: 1, hint: "It's about styling web pages in a cascading manner." },
        { question:  "Which HTML tag is used to create a table?", options: ["<table>", "<tr>", "<td>", "<tbody>"], answer: 0, hint: "This tag wraps the entire table structure."},
        { question: "Which HTML attribute is used to link an external CSS file?", options: ["src", "href", "link", "style"], answer: 1, hint: "It is used inside the <link> tag to point to the CSS file."  },
        { question: "Which symbol is used for comments in JavaScript?", options: ["//", "/* */", "<!-- -->", "#"], answer: 0, hint: "It's a double character that starts a single-line comment." }
    ],

    medium: [
        { question: "Which CSS property is used to make text bold?", options: ["font-weight", "text-style", "font-style", "text-weight"], answer: 0, hint: "This property controls how thick or thin characters appear." },
        { question: "What does the 'z-index' property do in CSS?", options: ["Sets text direction", "Controls element stacking order", "Adjusts element zoom level", "Sets horizontal alignment"], answer: 1, hint: "It's related to how elements stack on top of each other." },
        { question: "Which JavaScript method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], answer: 0, hint: "Think of 'popping' a balloon - something is removed." },
        { question: "Which JavaScript operator is used to assign a value to a variable?", options: ["=", "==", "===", ":="], answer: 0, hint: "It’s the basic assignment operator." },
        { question: "Which CSS property is used to create space inside an element between content and border?", options: ["padding", "margin", "spacing", "gap"], answer: 0, hint: "It is internal spacing, not outside the element." }
    ],

    hard: [
        { question: "What is the output of: console.log(typeof typeof 1)?", options: ["number", "string", "undefined", "NaN"], answer: 1, hint: "The typeof operator returns a string indicating the type." },
        { question: "Which CSS property can be used to create a grid layout?", options: ["display: grid", "display: flex", "position: grid", "layout: grid"], answer: 0, hint: "It's used for two-dimensional layouts." },
        { question: "What is a closure in JavaScript?", options: ["A way to close browser windows", "A function that has access to variables from an outer function scope", "A method to end JavaScript execution", "A way to close HTML tags"], answer: 1, hint: "It's about scope and memory." },
        { question: "Which JavaScript array method creates a new array with elements that pass a test?", options: ["filter()", "map()", "reduce()", "forEach()"], answer: 0, hint: "It ‘filters’ elements based on a condition." },
        { question: "What does the CSS 'calc()' function allow you to do?", options: ["Perform calculations to determine CSS property values", "Calculate HTML element size automatically", "Determine JavaScript variable values", "Animate elements"], answer: 0, hint: "It combines units like %, px, em in expressions." }
    ]
};

// --- Game Variables ---
let quizData = [];       // Current quiz questions (based on difficulty)
const totalQuestions = 5; // Total number of questions
let currentQuestion = 0; // Current question index
let score = 0;           // Player score
let userName = "";       // User name
let userAvatar = "👩‍💻"; // Default avatar
let difficulty = "easy"; // Default difficulty

let timer;               // Timer variable
let timeLeft = 20;       // Time per question
let answered = false;    // Track if user answered

let streak = 0;          // Correct answer streak
let wrongAnswers = 0;    // Incorrect answer count

let fiftyUsed = false;
let hintUsed = false;
let skipUsed = false;

let startTime;           // For total time tracking
let totalTime = 0;

// =======================================
// SELECT AVATAR
// =======================================
function selectAvatar(el) {
    document.querySelectorAll(".avatar").forEach(a => a.classList.remove("selected"));
    el.classList.add("selected");
    userAvatar = el.getAttribute("data-avatar");
}

// =======================================
// SELECT DIFFICULTY
// =======================================
function selectDifficulty(el) {
    document.querySelectorAll(".difficulty-option").forEach(btn => btn.classList.remove("selected"));
    el.classList.add("selected");
    difficulty = el.getAttribute("data-difficulty");
}

// =======================================
// PAGE SWITCHING (Home / Quiz / Score)
// =======================================
function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// =======================================
// START QUIZ
// =======================================
function startQuiz() {
    userName = document.getElementById("username").value.trim();

    // Check if username is entered
    if (userName === "") {
        let input = document.getElementById("username");
        input.style.borderColor = "red";
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 500);
        return;
    }

    // Reset game values
    currentQuestion = 0;
    score = 0;
    streak = 0;
    wrongAnswers = 0;
    fiftyUsed = hintUsed = skipUsed = false;

    quizData = allQuizData[difficulty];
    showPage("quizPage");

    // Update UI
    document.getElementById("displayName").textContent = userName;
    document.getElementById("userAvatar").textContent = userAvatar;
    document.getElementById("totalQuestions").textContent = quizData.length;

    // Reset badges and buttons
    document.getElementById("streakBadge").style.display = "none";
    ["fiftyFifty", "hint", "skipQuestion"].forEach(id => {
        document.getElementById(id).classList.remove("used");
    });

    startTime = new Date(); // Start timer for total time
    loadQuestion();
    startTimer();
}

// =======================================
// LOAD QUESTION
// =======================================
function loadQuestion() {
    if (currentQuestion >= quizData.length) {
        endQuiz();
        return;
    }

    answered = false;
    let q = quizData[currentQuestion];

    document.getElementById("currentQuestionNum").textContent = currentQuestion + 1;
    document.getElementById("question").textContent = q.question;

    let optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = ""; // clear previous options

    let letters = ["A", "B", "C", "D"];

    q.options.forEach((opt, i) => {
        let div = document.createElement("div");
        div.className = "option";
        div.style.pointerEvents = "auto"; // enable click
        div.innerHTML = `<div class='option-letter'>${letters[i]}</div><div class='option-text'>${opt}</div>`;
        div.onclick = () => selectOption(i);
        optionsDiv.appendChild(div);
    });

    // Reset feedback, next button, hint
    document.getElementById("nextButton").style.display = "none";
    document.getElementById("feedbackMessage").style.display = "none";
    document.getElementById("hintBox").style.display = "none";

    resetTimer(); // clear old timer and start new one
}


// =======================================
// WHEN USER SELECTS AN OPTION
// =======================================
function selectOption(i) {
    if (answered) return;
    answered = true;
    clearInterval(timer);

    let correct = quizData[currentQuestion].answer;
    let options = document.querySelectorAll(".option");
    let msg = document.getElementById("feedbackMessage");

    options.forEach((opt, index) => {
        opt.style.pointerEvents = "none"; // disable all options
        if (index === i) opt.classList.add("selected");
        if (index === correct) opt.classList.add("correct");
        else if (index === i && index !== correct) opt.classList.add("incorrect");
    });

    if (i === correct) {
        msg.textContent = "Correct! 🎉";
        msg.className = "feedback correct";
        score++;
        streak++;
        if (streak >= 3) {
            let badge = document.getElementById("streakBadge");
            badge.textContent = `🔥 ${streak} streak`;
            badge.style.display = "inline-block";
        }
    } else {
        msg.textContent = "Incorrect! The correct answer is " +
            options[correct].querySelector(".option-text").textContent;
        msg.className = "feedback incorrect";
        streak = 0;
        wrongAnswers++;
        document.getElementById("streakBadge").style.display = "none";
    }

    msg.style.display = "block";
    document.getElementById("nextButton").style.display = "block";
}


// =======================================
// LIFELINE: 50-50
// =======================================
function useFiftyFifty() {
    if (fiftyUsed || answered) return;
    fiftyUsed = true;
    document.getElementById("fiftyFifty").classList.add("used");

    let correct = quizData[currentQuestion].answer;
    let options = document.querySelectorAll(".option");
    let wrongIndexes = [];
    options.forEach((opt, i) => { if (i !== correct) wrongIndexes.push(i); });

    // Shuffle wrongIndexes and remove 2
    wrongIndexes.sort(() => 0.5 - Math.random());
    for (let i = 0; i < 2; i++) {
        options[wrongIndexes[i]].style.opacity = "0.3";
        options[wrongIndexes[i]].style.pointerEvents = "none";
    }
}


// =======================================
// LIFELINE: HINT
// =======================================
function useHint() {
    if (hintUsed || answered) return;
    hintUsed = true;
    document.getElementById("hint").classList.add("used");
    let hintBox = document.getElementById("hintBox");
    hintBox.textContent = quizData[currentQuestion].hint;
    hintBox.style.display = "block";
}

// =======================================
// LIFELINE: SKIP
// =======================================
function useSkip() {
    if (skipUsed || answered) return;
    skipUsed = true;
    document.getElementById("skipQuestion").classList.add("used");
    nextQuestion();
}

// =======================================
// NEXT QUESTION
// =======================================

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        answered = false; // reset answered flag
        loadQuestion();
        resetTimer(); // restart timer for the new question
        resetOptions(); // remove previous highlights, if needed
        document.getElementById("nextButton").style.display = "none"; // hide next button
    } else {
        endQuiz();
    }
}

function resetOptions() {
    const options = document.querySelectorAll(".option");
    options.forEach(option => {
        option.classList.remove("correct", "incorrect");
        option.style.pointerEvents = "auto"; // enable clicking again
    });

    const feedback = document.getElementById("feedbackMessage");
    feedback.style.display = "none"; // hide previous feedback
}



// =======================================
// TIMER FUNCTIONS
// =======================================
function startTimer() {
    clearInterval(timer); // Stop any previous timer

    if (difficulty === "easy") timeLeft = 20;
    else if (difficulty === "medium") timeLeft = 15;
    else timeLeft = 10;

    updateTimer();

    timer = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeUp();
        }
    }, 1000);
}

function handleTimeUp() {
    if (!answered) {
        let msg = document.getElementById("feedbackMessage");
        msg.textContent = "Time's up!";
        msg.className = "feedback incorrect";
        msg.style.display = "block";

        let correct = quizData[currentQuestion].answer;
        document.querySelectorAll(".option")[correct].classList.add("correct");

        streak = 0;
        wrongAnswers++;
        document.getElementById("streakBadge").style.display = "none";
        answered = true;
        document.getElementById("nextButton").style.display = "block";
    }
}


function resetTimer() {
    clearInterval(timer);

    if (difficulty === "easy") timeLeft = 20;
    else if (difficulty === "medium") timeLeft = 15;
    else timeLeft = 10;

    updateTimer();

    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeUp();
        }
    }, 1000);
}



function updateTimer() {
    let timerText = document.getElementById("timer");
    timerText.textContent = timeLeft + " seconds";
    timerText.style.color = timeLeft <= 5 ? "red" : "#ff4757";
}

// =======================================
// END QUIZ
// =======================================
function endQuiz() {
    clearInterval(timer);
    showPage("scorePage");

    let endTime = new Date();
    totalTime = Math.round((endTime - startTime) / 1000);
    let percent = Math.round((score / quizData.length) * 100);

    document.getElementById("scoreText").textContent = percent + "%";
    document.getElementById("finalScore").textContent = "Your Score: " + score + "/" + quizData.length;
    document.getElementById("correctAnswers").textContent = score;
    document.getElementById("incorrectAnswers").textContent = wrongAnswers;
    document.getElementById("timeUsed").textContent = formatTime(totalTime);

    let message = "";
    if (percent >= 80) {
        message = "Excellent! You're a coding genius! 🏆";
        makeConfetti();
    } else if (percent >= 60) {
        message = "Good job! 👍";
    } else if (percent >= 40) {
        message = "Not bad! Keep learning!";
    } else {
        message = "Keep practicing! 💪";
    }
    document.getElementById("scoreMsg").textContent = message;
}

// =======================================
// HELPER FUNCTIONS
// =======================================
function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return mins + ":" + (secs < 10 ? "0" + secs : secs);
}

function makeConfetti() {
    for (let i = 0; i < 100; i++) {
        let c = document.createElement("div");
        c.className = "confetti";
        c.style.left = Math.random() * 100 + "vw";
        c.style.animationDelay = Math.random() * 3 + "s";
        c.style.backgroundColor = `hsl(${Math.random() * 360},100%,50%)`;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 4000);
    }
}


function playAgain() {
    showPage("welcomePage");
    document.getElementById("username").value = "";
    document.getElementById("displayName").textContent = "User";
    document.getElementById("userAvatar").textContent = "👩‍💻";
    // Reset selected avatar and difficulty
    document.querySelectorAll(".avatar").forEach(a => a.classList.remove("selected"));
    document.querySelectorAll(".difficulty-option").forEach(d => d.classList.remove("selected"));
    document.querySelector(".difficulty-option[data-difficulty='easy']").classList.add("selected");
    difficulty = "easy";
}



// Initialize total questions display
document.getElementById("totalQuestions").textContent = totalQuestions;

function updateProgress() {
    const progressPercent = ((currentQuestion + 1) / totalQuestions) * 100;
    const progressBar = document.getElementById("progress");
    progressBar.style.width = progressPercent + "%";
    progressBar.textContent = Math.round(progressPercent) + "%";
    document.getElementById("currentQuestionNum").textContent = currentQuestion;
}

// Next question button click
document.getElementById("nextBtn").addEventListener("click", () => {
    nextQuestion();      // load next question properly
    updateProgress();    // update progress bar
});


// Initialize progress bar

updateProgress();
