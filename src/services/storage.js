const STORAGE_KEY = 'math_platform_progress';

const initialProgress = {
    // Map of gameId -> { highScore: number, levelsUnlocked: number }
    games: {},
    // Map of chapterId -> { status: 'locked' | 'in-progress' | 'mastered' }
    chapters: {},
    // Map of moduleId -> { completedSteps: number, isCompleted: boolean }
    modules: {}
};

export const storageService = {
    getProgress() {
        const stored = localStorage.getItem(STORAGE_KEY);
        const data = stored ? JSON.parse(stored) : {};
        return { ...initialProgress, ...data };
    },

    saveProgress(progress) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    },

    // Get progress for a specific game
    getGameProgress(gameId) {
        const progress = this.getProgress();
        return progress.games[gameId] || { highScore: 0, levelsUnlocked: 1 };
    },

    // Update progress after a game session
    updateGameProgress(gameId, score, levelCompleted) {
        const progress = this.getProgress();
        const current = progress.games[gameId] || { highScore: 0, levelsUnlocked: 1 };

        const newHighScore = Math.max(current.highScore, score);
        // Unlock next level if the completed level was the current highest unlocked
        const newLevelsUnlocked = levelCompleted >= current.levelsUnlocked
            ? current.levelsUnlocked + 1
            : current.levelsUnlocked;

        progress.games[gameId] = {
            highScore: newHighScore,
            levelsUnlocked: newLevelsUnlocked
        };

        this.saveProgress(progress);
        return progress.games[gameId];
    },

    // Get progress for a specific module
    getModuleProgress(moduleId) {
        const progress = this.getProgress();
        return progress.modules && progress.modules[moduleId] ? progress.modules[moduleId] : { completedSteps: 0, isCompleted: false };
    },

    // Update progress for a module
    updateModuleProgress(moduleId, completedSteps, isCompleted) {
        const progress = this.getProgress();
        if (!progress.modules) progress.modules = {};

        const current = progress.modules[moduleId] || { completedSteps: 0, isCompleted: false };

        progress.modules[moduleId] = {
            completedSteps: Math.max(current.completedSteps, completedSteps),
            isCompleted: current.isCompleted || isCompleted
        };

        this.saveProgress(progress);
        return progress.modules[moduleId];
    },

    // Reset progress (debug/dev only)
    resetProgress() {
        localStorage.removeItem(STORAGE_KEY);
    }
};
