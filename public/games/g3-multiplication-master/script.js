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

// Level Configuration (Multiplication Tables)
const LEVEL_CONFIG = {
    1: { tables: [2], time: 30 },
    2: { tables: [2, 3], time: 30 },
    3: { tables: [3, 4], time: 25 },
    4: { tables: [4, 5], time: 25 },
    5: { tables: [5, 6], time: 20 },
    6: { tables: [6, 7], time: 20 },
    7: { tables: [7, 8], time: 15 },
    8: { tables: [8, 9], time: 15 },
    9: { tables: [9, 10, 11], time: 12 },
    10: { tables: [11, 12], time: 10 }
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
    const tables = config.tables;

    // Pick a random table from the allowed list
    const table = tables[Math.floor(Math.random() * tables.length)];
    // Pick a random multiplier (1-10, or 1-12 for higher levels)
    const multiplier = Math.floor(Math.random() * 12) + 1;

    const a = table;
    const b = multiplier;

    // Randomize order (e.g., 2x5 or 5x2)
    if (Math.random() > 0.5) {
        els.num1.textContent = a;
        els.num2.textContent = b;
    } else {
        els.num1.textContent = b;
        els.num2.textContent = a;
    }

    state.correctAnswer = a * b;

    els.answerBox.textContent = '?';
    els.answerBox.style.borderColor = '#475569';
    els.answerBox.style.color = '#64748b';

    generateOptions(state.correctAnswer);
}

function generateOptions(correct) {
    els.options.innerHTML = '';

    // Generate 3 wrong answers
    const options = new Set([correct]);
    while (options.size < 4) {
        // Generate plausible wrong answers (e.g., correct +/- table, or random multiple)
        const variance = Math.floor(Math.random() * 10) - 5;
        let val = correct + variance;

        // Ensure positive and not correct
        if (val <= 0 || val === correct) {
            val = correct + Math.floor(Math.random() * 20) + 1;
        }
        options.add(val);
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
        state.score += 20; // Higher score for multiplication
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
    els.msgTitle.textContent = `Mission ${state.currentLevel} Success!`;
    els.msgText.textContent = `Score: ${state.score}`;
    els.nextBtn.textContent = state.currentLevel < 10 ? 'Next Mission' : 'Return to Base';
    els.nextBtn.onclick = () => {
        if (state.currentLevel < 10) {
            startLevel(state.currentLevel + 1);
        } else {
            // Game Finished
            sdk.reportGameOver(state.score);
            els.msgTitle.textContent = "Galaxy Mastered!";
            els.nextBtn.style.display = 'none';
        }
    };

    showOverlay();
}

function gameOver() {
    clearInterval(state.timerInterval);
    state.isPlaying = false;

    els.msgTitle.textContent = "Out of Fuel!";
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
