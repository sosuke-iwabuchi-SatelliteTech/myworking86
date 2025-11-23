let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = 10;
let correctAnswer = 0;
let isAnswering = false; // Prevent double clicking

function startGame() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    
    currentQuestionIndex = 0;
    score = 0;
    updateScoreDisplay();
    generateQuestion();
}

function generateQuestion() {
    isAnswering = false;
    currentQuestionIndex++;
    
    if (currentQuestionIndex > totalQuestions) {
        endGame();
        return;
    }

    updateProgress();

    // 1st Grade Logic: Addition and Subtraction up to 20
    // Ensure positive results for subtraction
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

    const feedbackOverlay = document.getElementById('feedback-overlay');
    const feedbackIcon = document.getElementById('feedback-icon');

    if (selected === correctAnswer) {
        score += 10;
        btnElement.classList.remove('bg-slate-100', 'text-slate-700', 'border-slate-200');
        btnElement.classList.add('bg-brand-green', 'text-white', 'border-brand-green', 'shadow-[0_4px_0_rgb(86,168,98)]');
        
        feedbackIcon.innerText = '⭕';
        feedbackIcon.className = 'text-8xl text-brand-green filter drop-shadow-lg transform scale-100 transition-transform duration-300';
        playSound('correct');
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
    }, 1500);
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
    startGame();
}

// Simple sound effect placeholder (browsers often block auto-audio, so this is optional/enhancement)
function playSound(type) {
    // In a real app, we'd use Audio objects here.
    // console.log(`Playing ${type} sound`);
}
