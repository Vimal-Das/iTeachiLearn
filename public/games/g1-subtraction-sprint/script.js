const sdk = new GameSDK();

// Game State
let state = {
    currentLevel: 1,
    score: 0,
    timeLeft: 30,
    timerInterval: null,
    isPlaying: false,
    correctAnswer: 0,
    questionsAnswered: 0,
    questionsPerLevel: 5
};

// Level Configuration
const LEVEL_CONFIG = {
    1: { maxNum: 10, time: 30 },
    2: { maxNum: 15, time: 30 },
    3: { maxNum: 20, time: 25 },
    4: { maxNum: 30, time: 25 },
    5: { maxNum: 50, time: 20 },
    6: { maxNum: 75, time: 20 },
    7: { maxNum: 100, time: 15 },
    8: { maxNum: 150, time: 15 },
    9: { maxNum: 200, time: 12 },
    10: { maxNum: 500, time: 10 }
};

// DOM Elements
const els = {
    level: document.getElementById('level-display'),
    score: document.getElementById('score-display'),
    timer: document.getElementById('timer-display'),
    num1: document.getElementById('num1'),
    num2: document.getElementById('num2'),
    answerBox: document.getElementById('answer-box'),
    options: document.getElementById('options-container'),
    overlay: document.getElementById('message-overlay'),
    msgTitle: document.getElementById('message-title'),
    msgText: document.getElementById('message-text'),
    nextBtn: document.getElementById('next-btn')
};

// Initialize
sdk.onInit((data) => {
    console.log('Init data:', data);
    if (data.levelsUnlocked) {
        state.currentLevel = data.levelsUnlocked;
    }
    startLevel(state.currentLevel);
});

function startLevel(level) {
    state.currentLevel = level;
    state.questionsAnswered = 0;
    state.timeLeft = LEVEL_CONFIG[level].time;
    state.isPlaying = true;

    updateUI();
    hideOverlay();
    startTimer();
    generateQuestion();
}

function updateUI() {
    els.level.textContent = state.currentLevel;
    els.score.textContent = state.score;
    els.timer.textContent = state.timeLeft;
}

function startTimer() {
    clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
        state.timeLeft--;
        els.timer.textContent = state.timeLeft;

        if (state.timeLeft <= 0) {
            gameOver();
        }
    }, 1000);
}

function generateQuestion() {
    const config = LEVEL_CONFIG[state.currentLevel];
    const max = config.maxNum;

    // Generate numbers ensuring a >= b (positive result)
    const a = Math.floor(Math.random() * max) + 1; // 1 to max
    const b = Math.floor(Math.random() * (a + 1)); // 0 to a

    state.correctAnswer = a - b;

    els.num1.textContent = a;
    els.num2.textContent = b;
    els.answerBox.textContent = '?';
    els.answerBox.style.borderColor = '#fecdd3';
    els.answerBox.style.color = '#fda4af';

    generateOptions(state.correctAnswer);
}

function generateOptions(correct) {
    els.options.innerHTML = '';

    // Generate 3 wrong answers close to the correct one
    const options = new Set([correct]);
    while (options.size < 4) {
        const variance = Math.floor(Math.random() * 10) - 5; // +/- 5
        const val = correct + variance;
        if (val >= 0 && val !== correct) {
            options.add(val);
        }
    }

    // Shuffle and render
    Array.from(options)
        .sort(() => Math.random() - 0.5)
        .forEach(val => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = val;
            btn.onclick = () => checkAnswer(val, btn);
            els.options.appendChild(btn);
        });
}

function checkAnswer(val, btn) {
    if (!state.isPlaying) return;

    if (val === state.correctAnswer) {
        // Correct
        btn.classList.add('correct');
        state.score += 10;
        state.questionsAnswered++;
        els.answerBox.textContent = val;
        els.answerBox.style.borderColor = '#22c55e';
        els.answerBox.style.color = '#22c55e';

        setTimeout(() => {
            if (state.questionsAnswered >= state.questionsPerLevel) {
                levelComplete();
            } else {
                generateQuestion();
                updateUI();
            }
        }, 500);
    } else {
        // Wrong
        btn.classList.add('wrong');
        state.timeLeft -= 5; // Penalty
        updateUI();
    }
}

function levelComplete() {
    clearInterval(state.timerInterval);
    state.isPlaying = false;

    // Report progress
    sdk.reportLevelComplete(state.score, state.currentLevel);

    // Show overlay
    els.msgTitle.textContent = `Level ${state.currentLevel} Complete!`;
    els.msgText.textContent = `Score: ${state.score}`;
    els.nextBtn.textContent = state.currentLevel < 10 ? 'Next Level' : 'Finish';
    els.nextBtn.onclick = () => {
        if (state.currentLevel < 10) {
            startLevel(state.currentLevel + 1);
        } else {
            // Game Finished
            sdk.reportGameOver(state.score);
            els.msgTitle.textContent = "Game Mastered!";
            els.nextBtn.style.display = 'none';
        }
    };

    showOverlay();
}

function gameOver() {
    clearInterval(state.timerInterval);
    state.isPlaying = false;

    els.msgTitle.textContent = "Time's Up!";
    els.msgText.textContent = `Final Score: ${state.score}`;
    els.nextBtn.textContent = "Try Again";
    els.nextBtn.onclick = () => startLevel(state.currentLevel);

    showOverlay();
}

function showOverlay() {
    els.overlay.classList.remove('hidden');
}

function hideOverlay() {
    els.overlay.classList.add('hidden');
}
