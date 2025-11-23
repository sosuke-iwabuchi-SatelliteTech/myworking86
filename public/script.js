let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = 10;
let correctAnswer = 0;
let isAnswering = false; // Prevent double clicking
let currentLevel = 1; // 1: Addition/Subtraction, 2: Multiplication
let timerInterval;
let startTime;
let finalTime = 0;

function startGame(level) {
    if (level) {
        currentLevel = level;
    }
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    document.getElementById('result-screen').classList.add('hidden');

    currentQuestionIndex = 0;
    score = 0;
    updateScoreDisplay();
    startTimer();
    generateQuestion();
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 10);
}

function stopTimer() {
    clearInterval(timerInterval);
    finalTime = Date.now() - startTime;
    updateTimerDisplay(); // Ensure the display shows the final time
}

function updateTimerDisplay() {
    const currentTime = Date.now();
    const elapsedTime = timerInterval ? currentTime - startTime : finalTime;
    document.getElementById('timer-display').innerText = formatTime(elapsedTime);
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10); // 2 digits

    const pad = (num) => num.toString().padStart(2, '0');
    return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
}

function generateQuestion() {
    isAnswering = false;
    currentQuestionIndex++;

    if (currentQuestionIndex > totalQuestions) {
        endGame();
        return;
    }

    updateProgress();

    // Level 1: Addition and Subtraction
    // Level 2: Multiplication (Kuku)

    if (currentLevel === 1) {
        const isAddition = Math.random() > 0.5;
        let num1, num2;

        if (isAddition) {
            // Sum up to 20
            num1 = Math.floor(Math.random() * 10) + 1; // 1-10
            num2 = Math.floor(Math.random() * 10) + 1; // 1-10
            correctAnswer = num1 + num2;
            document.getElementById('question-text').innerText = `${num1} + ${num2} = ?`;
        } else {
            // Subtraction, result >= 0
            num1 = Math.floor(Math.random() * 15) + 5; // 5-20
            num2 = Math.floor(Math.random() * num1);   // 0 to num1-1
            correctAnswer = num1 - num2;
            document.getElementById('question-text').innerText = `${num1} - ${num2} = ?`;
        }
    } else if (currentLevel === 2) {
        // Multiplication (1x1 to 9x9)
        const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
        const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
        correctAnswer = num1 * num2;
        document.getElementById('question-text').innerText = `${num1} × ${num2} = ?`;
    }

    generateOptions(correctAnswer);
}

function generateOptions(correct) {
    const optionsContainer = document.getElementById('answer-options');
    optionsContainer.innerHTML = '';

    // Generate 3 wrong answers
    let options = new Set([correct]);
    while (options.size < 4) {
        let wrong = correct + Math.floor(Math.random() * 10) - 5;
        if (wrong >= 0 && wrong !== correct) {
            options.add(wrong);
        }
    }

    // Shuffle options
    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    shuffledOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = `bg-slate-100 hover:bg-blue-100 text-slate-700 font-bold text-3xl py-6 rounded-2xl shadow-sm border-2 border-slate-200 transition-all active:scale-95`;
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selected, btnElement) {
    if (isAnswering) return;
    isAnswering = true;

    // Stop timer immediately if this is the last question
    if (currentQuestionIndex === totalQuestions) {
        stopTimer();
    }

    const feedbackOverlay = document.getElementById('feedback-overlay');
    const feedbackIcon = document.getElementById('feedback-icon');

    let nextQuestionDelay = 1500;

    if (selected === correctAnswer) {
        score += 10;
        btnElement.classList.remove('bg-slate-100', 'text-slate-700', 'border-slate-200');
        btnElement.classList.add('bg-brand-green', 'text-white', 'border-brand-green', 'shadow-[0_4px_0_rgb(86,168,98)]');

        feedbackIcon.innerText = '⭕';
        feedbackIcon.className = 'text-8xl text-brand-green filter drop-shadow-lg transform scale-100 transition-transform duration-300';
        playSound('correct');
        nextQuestionDelay = 500;
    } else {
        btnElement.classList.remove('bg-slate-100', 'text-slate-700', 'border-slate-200');
        btnElement.classList.add('bg-brand-red', 'text-white', 'border-brand-red', 'shadow-[0_4px_0_rgb(255,73,73)]');

        // Highlight correct answer
        const buttons = document.getElementById('answer-options').children;
        for (let btn of buttons) {
            if (parseInt(btn.innerText) === correctAnswer) {
                btn.classList.add('ring-4', 'ring-brand-green', 'bg-green-50');
            }
        }

        feedbackIcon.innerText = '❌';
        feedbackIcon.className = 'text-8xl text-brand-red filter drop-shadow-lg transform scale-100 transition-transform duration-300';
        playSound('wrong');
    }

    feedbackOverlay.classList.remove('opacity-0');
    updateScoreDisplay();

    setTimeout(() => {
        feedbackOverlay.classList.add('opacity-0');
        feedbackIcon.classList.remove('scale-100');
        feedbackIcon.classList.add('scale-0');
        generateQuestion();
    }, nextQuestionDelay);
}

function updateScoreDisplay() {
    document.getElementById('current-score').innerText = score;
}

function updateProgress() {
    document.getElementById('question-number').innerText = currentQuestionIndex;
    const progress = ((currentQuestionIndex - 1) / totalQuestions) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function endGame() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('final-score').innerText = score;
    document.getElementById('final-time').innerText = formatTime(finalTime);

    const msg = document.getElementById('result-message');
    if (score === 100) {
        msg.innerText = "てんさい！ かんぺきです！ 🌟";
        msg.className = "text-xl font-bold text-brand-yellow";
    } else if (score >= 80) {
        msg.innerText = "すごい！ そのちょうし！ 🎉";
        msg.className = "text-xl font-bold text-brand-orange";
    } else {
        msg.innerText = "がんばったね！ つぎはもっといけるよ！ 💪";
        msg.className = "text-xl font-bold text-brand-blue";
    }
}

function restartGame() {
    startGame(currentLevel);
}

function goToTop() {
    clearInterval(timerInterval);
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('welcome-screen').classList.remove('hidden');
}

// Simple sound effect placeholder (browsers often block auto-audio, so this is optional/enhancement)
function playSound(type) {
    // In a real app, we'd use Audio objects here.
    // console.log(`Playing ${type} sound`);
}
