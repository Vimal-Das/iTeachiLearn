const sdk = new GameSDK();

// Game State
let state = {
    currentLevel: 1,
    score: 0,
    timeLeft: 60,
    timerInterval: null,
    isPlaying: false,
    correctAnswer: 0,
    questionsAnswered: 0,
    questionsPerLevel: 5
};

// Level Configuration
// Levels 1-3: Perimeter (Rectangles), 4-6: Area (Rectangles), 7-8: Mixed, 9-10: Complex/Wordy
const LEVELS = {
    1: { type: 'perimeter', shape: 'rect', maxDim: 10 },
    2: { type: 'perimeter', shape: 'rect', maxDim: 20 },
    3: { type: 'perimeter', shape: 'square', maxDim: 50 },
    4: { type: 'area', shape: 'rect', maxDim: 10 },
    5: { type: 'area', shape: 'square', maxDim: 12 },
    6: { type: 'area', shape: 'rect', maxDim: 15 },
    7: { type: 'mixed', shape: 'rect', maxDim: 15 },
    8: { type: 'mixed', shape: 'rect', maxDim: 20 },
    9: { type: 'mixed', shape: 'rect', maxDim: 25 },
    10: { type: 'mixed', shape: 'rect', maxDim: 30 }
};

// DOM Elements
const els = {
    level: document.getElementById('level-display'),
    score: document.getElementById('score-display'),
    timer: document.getElementById('timer-display'),
    shape: document.getElementById('shape-display'),
    dimLabel: document.getElementById('dimensions-label'),
    problemText: document.getElementById('problem-text'),
    answerPrefix: document.getElementById('answer-prefix'),
    unitLabel: document.getElementById('unit-label'),
    answerBox: document.getElementById('answer-box'),
    options: document.getElementById('options-container'),
    overlay: document.getElementById('message-overlay'),
    msgTitle: document.getElementById('message-title'),
    msgText: document.getElementById('message-text'),
    nextBtn: document.getElementById('next-btn')
};

// Initialize
sdk.onInit((data) => {
    if (data.levelsUnlocked) {
        state.currentLevel = data.levelsUnlocked;
    }
    startLevel(state.currentLevel);
});

function startLevel(level) {
    state.currentLevel = level;
    state.questionsAnswered = 0;
    state.timeLeft = 60;
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
    const config = LEVELS[state.currentLevel];
    let type = config.type;

    if (type === 'mixed') {
        type = Math.random() > 0.5 ? 'area' : 'perimeter';
    }

    const isSquare = config.shape === 'square' || (config.shape === 'rect' && Math.random() > 0.8);
    const w = Math.floor(Math.random() * config.maxDim) + 2;
    const h = isSquare ? w : Math.floor(Math.random() * config.maxDim) + 2;

    // Visual representation
    // Scale dimensions to fit in 200x150 box
    const maxDisplayW = 200;
    const maxDisplayH = 140;
    const scale = Math.min(maxDisplayW / w, maxDisplayH / h, 15); // Cap scale

    els.shape.style.width = `${w * scale}px`;
    els.shape.style.height = `${h * scale}px`;
    els.dimLabel.textContent = `${w}m x ${h}m`;

    // Problem Text
    if (type === 'perimeter') {
        state.correctAnswer = 2 * (w + h);
        const scenarios = [
            `Calculate the fencing needed for a ${w}m by ${h}m garden.`,
            `Find the perimeter of this building foundation (${w}m x ${h}m).`,
            `How much tape is needed to outline this ${w}m x ${h}m room?`
        ];
        els.problemText.textContent = scenarios[Math.floor(Math.random() * scenarios.length)];
        els.answerPrefix.textContent = "Perimeter = ";
        els.unitLabel.textContent = "m";
    } else {
        state.correctAnswer = w * h;
        const scenarios = [
            `Calculate the flooring area for a ${w}m by ${h}m room.`,
            `Find the area of this concrete slab (${w}m x ${h}m).`,
            `How much grass is needed for this ${w}m x ${h}m lawn?`
        ];
        els.problemText.textContent = scenarios[Math.floor(Math.random() * scenarios.length)];
        els.answerPrefix.textContent = "Area = ";
        els.unitLabel.textContent = "m²";
    }

    els.answerBox.textContent = '?';
    els.answerBox.style.borderColor = '#fbbf24';
    els.answerBox.style.color = '#fbbf24';

    generateOptions(state.correctAnswer, type, w, h);
}

function generateOptions(correct, type, w, h) {
    els.options.innerHTML = '';

    const options = new Set([correct]);
    while (options.size < 4) {
        let wrong;
        const r = Math.random();

        // Generate common mistakes
        if (type === 'area') {
            // Mistake: Perimeter instead of Area
            if (r < 0.3) wrong = 2 * (w + h);
            // Mistake: Adding instead of multiplying
            else if (r < 0.6) wrong = w + h;
            else wrong = correct + Math.floor(Math.random() * 10) + 1;
        } else {
            // Mistake: Area instead of Perimeter
            if (r < 0.3) wrong = w * h;
            // Mistake: Half perimeter (w+h)
            else if (r < 0.6) wrong = w + h;
            else wrong = correct + Math.floor(Math.random() * 10) + 1;
        }

        if (wrong !== correct && wrong > 0) {
            options.add(wrong);
        }
    }

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
        btn.classList.add('correct');
        state.score += 50;
        state.questionsAnswered++;
        els.answerBox.textContent = val;
        els.answerBox.style.borderColor = '#34d399';
        els.answerBox.style.color = '#34d399';

        setTimeout(() => {
            if (state.questionsAnswered >= state.questionsPerLevel) {
                levelComplete();
            } else {
                generateQuestion();
                updateUI();
            }
        }, 800);
    } else {
        btn.classList.add('wrong');
        state.timeLeft -= 10; // Heavy penalty for construction errors!
        updateUI();
    }
}

function levelComplete() {
    clearInterval(state.timerInterval);
    state.isPlaying = false;

    sdk.reportLevelComplete(state.score, state.currentLevel);

    els.msgTitle.textContent = "Blueprint Approved!";
    els.msgText.textContent = `Budget Saved: $${state.score}`;
    els.nextBtn.textContent = state.currentLevel < 10 ? 'Next Project' : 'Promoted to Chief Architect';
    els.nextBtn.onclick = () => {
        if (state.currentLevel < 10) {
            startLevel(state.currentLevel + 1);
        } else {
            sdk.reportGameOver(state.score);
            els.msgTitle.textContent = "Master Architect!";
            els.nextBtn.style.display = 'none';
        }
    };

    showOverlay();
}

function gameOver() {
    clearInterval(state.timerInterval);
    state.isPlaying = false;

    els.msgTitle.textContent = "Project Overdue!";
    els.msgText.textContent = `Final Budget: $${state.score}`;
    els.nextBtn.textContent = "Retry Project";
    els.nextBtn.onclick = () => startLevel(state.currentLevel);

    showOverlay();
}

function showOverlay() {
    els.overlay.classList.remove('hidden');
}

function hideOverlay() {
    els.overlay.classList.add('hidden');
}
