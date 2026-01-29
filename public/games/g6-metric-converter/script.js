const sdk = new GameSDK();

// Game State
let state = {
    currentLevel: 1,
    score: 0,
    timeLeft: 45,
    timerInterval: null,
    isPlaying: false,
    correctAnswer: 0,
    questionsAnswered: 0,
    questionsPerLevel: 5
};

// Level Configuration
// Levels 1-3: Length, 4-6: Weight, 7-9: Volume, 10: Mixed
const LEVELS = {
    1: { type: 'length', units: ['mm', 'cm'], maxVal: 100 },
    2: { type: 'length', units: ['cm', 'm'], maxVal: 500 },
    3: { type: 'length', units: ['m', 'km'], maxVal: 10 },
    4: { type: 'weight', units: ['g', 'kg'], maxVal: 5 },
    5: { type: 'weight', units: ['mg', 'g'], maxVal: 1000 },
    6: { type: 'weight', units: ['kg', 'ton'], maxVal: 10 },
    7: { type: 'volume', units: ['ml', 'l'], maxVal: 5 },
    8: { type: 'volume', units: ['l', 'kl'], maxVal: 10 }, // kl is less common but valid logic
    9: { type: 'mixed', units: ['all'], maxVal: 100 },
    10: { type: 'mixed', units: ['all'], maxVal: 1000 }
};

const CONVERSIONS = {
    'mm-cm': 0.1, 'cm-mm': 10,
    'cm-m': 0.01, 'm-cm': 100,
    'm-km': 0.001, 'km-m': 1000,
    'mg-g': 0.001, 'g-mg': 1000,
    'g-kg': 0.001, 'kg-g': 1000,
    'kg-ton': 0.001, 'ton-kg': 1000,
    'ml-l': 0.001, 'l-ml': 1000,
    'l-kl': 0.001, 'kl-l': 1000
};

// DOM Elements
const els = {
    level: document.getElementById('level-display'),
    score: document.getElementById('score-display'),
    timer: document.getElementById('timer-display'),
    valSource: document.getElementById('value-source'),
    unitSource: document.getElementById('unit-source'),
    unitTarget: document.getElementById('unit-target'),
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
    state.timeLeft = 45; // More time for thinking
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
    let pair;

    if (config.type === 'mixed') {
        const keys = Object.keys(CONVERSIONS);
        pair = keys[Math.floor(Math.random() * keys.length)];
    } else {
        // Find valid pairs for this level type
        // Simplified: Just hardcode pairs based on level units for now
        const u1 = config.units[0];
        const u2 = config.units[1];
        // Random direction
        pair = Math.random() > 0.5 ? `${u1}-${u2}` : `${u2}-${u1}`;
    }

    const [from, to] = pair.split('-');
    const factor = CONVERSIONS[pair];

    // Generate a nice number
    let val;
    if (factor > 1) {
        // e.g. 5 m -> 500 cm. Val should be small integer.
        val = Math.floor(Math.random() * config.maxVal) + 1;
    } else {
        // e.g. 500 cm -> 5 m. Val should be multiple of 1/factor.
        // factor 0.01 (1/100). We want val to be 100, 200, etc.
        const mult = 1 / factor;
        val = (Math.floor(Math.random() * config.maxVal) + 1) * mult;
    }

    state.correctAnswer = val * factor;

    // Handle floating point errors
    state.correctAnswer = parseFloat(state.correctAnswer.toPrecision(10));

    els.valSource.textContent = val;
    els.unitSource.textContent = from;
    els.unitTarget.textContent = to;

    els.answerBox.textContent = '?';
    els.answerBox.style.borderColor = '#cbd5e1';
    els.answerBox.style.color = '#94a3b8';

    generateOptions(state.correctAnswer);
}

function generateOptions(correct) {
    els.options.innerHTML = '';

    const options = new Set([correct]);
    while (options.size < 4) {
        // Generate wrong answers:
        // 1. Wrong magnitude (x10, /10)
        // 2. Random close number
        const r = Math.random();
        let wrong;
        if (r < 0.33) wrong = correct * 10;
        else if (r < 0.66) wrong = correct / 10;
        else wrong = correct + (Math.floor(Math.random() * 5) + 1) * (correct > 10 ? 1 : 0.1);

        wrong = parseFloat(wrong.toPrecision(10));

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
        state.score += 30;
        state.questionsAnswered++;
        els.answerBox.textContent = val;
        els.answerBox.style.borderColor = '#22c55e';
        els.answerBox.style.color = '#15803d';

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
        state.timeLeft -= 5;
        updateUI();
    }
}

function levelComplete() {
    clearInterval(state.timerInterval);
    state.isPlaying = false;

    sdk.reportLevelComplete(state.score, state.currentLevel);

    els.msgTitle.textContent = "Experiment Success!";
    els.msgText.textContent = `Score: ${state.score}`;
    els.nextBtn.textContent = state.currentLevel < 10 ? 'Next Experiment' : 'Publish Results';
    els.nextBtn.onclick = () => {
        if (state.currentLevel < 10) {
            startLevel(state.currentLevel + 1);
        } else {
            sdk.reportGameOver(state.score);
            els.msgTitle.textContent = "Nobel Prize Winner!";
            els.nextBtn.style.display = 'none';
        }
    };

    showOverlay();
}

function gameOver() {
    clearInterval(state.timerInterval);
    state.isPlaying = false;

    els.msgTitle.textContent = "Lab Explosion!";
    els.msgText.textContent = `Final Score: ${state.score}`;
    els.nextBtn.textContent = "Retry Experiment";
    els.nextBtn.onclick = () => startLevel(state.currentLevel);

    showOverlay();
}

function showOverlay() {
    els.overlay.classList.remove('hidden');
}

function hideOverlay() {
    els.overlay.classList.add('hidden');
}
