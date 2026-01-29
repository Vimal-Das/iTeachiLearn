import { SUBJECTS_REGISTRY } from '../data/subjects';

export const SUBJECTS = SUBJECTS_REGISTRY;

export const getGameById = (gameId) => {
    for (const subject of SUBJECTS) {
        for (const grade of subject.grades) {
            for (const chapter of grade.chapters) {
                if (chapter.games) {
                    const game = chapter.games.find(g => g.id === gameId);
                    if (game) return game;
                }
            }
        }
    }
    return null;
};

export const getModuleById = (moduleId) => {
    for (const subject of SUBJECTS) {
        for (const grade of subject.grades) {
            for (const chapter of grade.chapters) {
                if (chapter.modules) {
                    const module = chapter.modules.find(m => m.id === moduleId);
                    if (module) return module;
                }
            }
        }
    }
    return null;
};


