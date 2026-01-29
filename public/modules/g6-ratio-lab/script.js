const toolkit = new ModuleToolkit({
    totalSteps: 4
});

// State
let counts = { a: 0, b: 0 };
let currentStep = 1;
let quizScore = 0;

// --- Section 1: Introduction ---
function updateCount(type, change) {
    const newCount = counts[type] + change;
    if (newCount >= 0 && newCount <= 10) {
        counts[type] = newCount;
        renderGroups();
        updateComparisonText();
    }
}

function renderGroups() {
    const groupA = document.getElementById('group-a');
    const groupB = document.getElementById('group-b');

    groupA.innerHTML = '';
    groupB.innerHTML = '';

    for (let i = 0; i < counts.a; i++) {
        const item = document.createElement('div');
        item.className = 'item type-a';
        groupA.appendChild(item);
    }

    for (let i = 0; i < counts.b; i++) {
        const item = document.createElement('div');
        item.className = 'item type-b';
        groupB.appendChild(item);
    }
}

function updateComparisonText() {
    const text = document.getElementById('comparison-text');
    text.innerHTML = `For every <strong style="color: var(--color-a)">${counts.a}</strong> Red Circles, there are <strong style="color: var(--color-b)">${counts.b}</strong> Blue Squares.`;
}

// --- Section 2: Notation (Drag and Drop) ---
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.classList.add('dragging');
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    draggedElement.classList.remove('dragging');

    if (ev.target.classList.contains('drop-zone') && !ev.target.classList.contains('filled')) {
        const expected = ev.target.getAttribute('data-expected');
        const value = draggedElement.innerText;

        if (value === expected) {
            ev.target.innerText = value;
            ev.target.classList.add('filled');
            checkNotationComplete();
        } else {
            showFeedback('notation-feedback', 'Oops! Check the order. Lemons (3) come first!', false);
        }
    }
}

function checkNotationComplete() {
    const filled = document.querySelectorAll('.drop-zone.filled');
    const progressText = document.getElementById('notation-progress');
    progressText.innerText = `Forms Completed: ${Math.floor(filled.length / 2)}/3`;

    if (filled.length === 6) {
        showFeedback('notation-feedback', 'Perfect! You matched all notation forms.', true);
        document.getElementById('btn-step-3').style.display = 'inline-block';
    }
}

// --- Section 3: Equivalent Ratios ---
function scaleRecipe(scale) {
    const liquid = document.getElementById('liquid');
    const label = document.getElementById('mixer-label');

    // Animate height based on scale (30% base, max 90%)
    const height = 30 * scale;
    liquid.style.height = `${height}%`;

    const a = 1 * scale;
    const b = 2 * scale;
    label.innerText = `${a}:${b}`;
}

function checkRatio() {
    const input = document.getElementById('ratio-input');
    const val = parseInt(input.value);

    // 3:4 = 9:X => X = 12
    if (val === 12) {
        showFeedback('ratio-feedback', 'Correct! 3 x 3 = 9, so 4 x 3 = 12.', true);
        document.getElementById('btn-step-4').style.display = 'inline-block';
    } else {
        showFeedback('ratio-feedback', 'Not quite. Think: How many times does 3 go into 9?', false);
    }
}

// --- Section 4: Quiz ---
function selectOption(qNum, option) {
    // Q1 Logic
    const options = document.querySelectorAll('#quiz-q1 .quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));
    event.target.classList.add('selected');

    if (option === 'a') {
        showFeedback('quiz-feedback', 'Correct!', true);
        quizScore++;
        setTimeout(() => {
            document.getElementById('quiz-q1').style.display = 'none';
            document.getElementById('quiz-q2').style.display = 'block';
            document.getElementById('quiz-feedback').style.display = 'none';
        }, 1000);
    } else {
        showFeedback('quiz-feedback', 'Try again. A ratio compares quantities.', false);
    }
}

function checkQ2() {
    const input = document.getElementById('q2-input').value.trim();
    // Accept 2:8 or 1:4 (simplified)
    if (input === '2:8' || input === '1:4') {
        showFeedback('quiz-feedback', 'Correct! 2 Pens to 8 Total Items.', true);
        quizScore++;
        setTimeout(() => {
            document.getElementById('quiz-q2').style.display = 'none';
            document.getElementById('quiz-q3').style.display = 'block';
            document.getElementById('quiz-feedback').style.display = 'none';
        }, 1000);
    } else {
        showFeedback('quiz-feedback', 'Remember: Pens (2) to TOTAL items (6+2=8). Format: A:B', false);
    }
}

function checkQ3() {
    const input = parseInt(document.getElementById('q3-input').value);
    // 3:1 = 6:X => X = 2
    if (input === 2) {
        showFeedback('quiz-feedback', 'Correct!', true);
        quizScore++;
        showResults();
    } else {
        showFeedback('quiz-feedback', 'Hint: 6 is double of 3. What is double of 1?', false);
    }
}

function showResults() {
    document.getElementById('quiz-q3').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    document.getElementById('final-score').innerText = quizScore;
    document.getElementById('quiz-feedback').style.display = 'none';
}

// --- Common ---
function nextStep(step) {
    document.querySelectorAll('.step-container').forEach(el => el.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');

    currentStep = step;
    toolkit.completeStep(step);
    updateProgress(step);
}

function updateProgress(step) {
    const percent = (step / 4) * 100;
    document.getElementById('progress-fill').style.width = `${percent}%`;
}

function showFeedback(elementId, message, isCorrect) {
    const el = document.getElementById(elementId);
    el.innerText = message;
    el.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    el.style.display = 'block';
}

function finishModule() {
    toolkit.completeModule();
}

// Init
toolkit.onInit = (data) => {
    if (data.completedSteps > 0 && !data.isCompleted) {
        // Resume logic could go here
        updateProgress(data.completedSteps);
    }
};
