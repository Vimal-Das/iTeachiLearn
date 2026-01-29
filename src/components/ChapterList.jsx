import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SUBJECTS } from '../services/gameRegistry';
import { storageService } from '../services/storage';
import { Play, Lock, CheckCircle, BookOpen, ArrowLeft } from 'lucide-react';

const ChapterList = () => {
    const { subjectId, gradeId } = useParams();
    const subject = SUBJECTS.find(s => s.id === subjectId);
    const grade = subject?.grades.find(g => g.id === gradeId);
    const progress = storageService.getProgress();

    if (!subject || !grade) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-600 mb-4">Content not found</h2>
            <Link to="/" className="text-indigo-600 hover:underline">Return Home</Link>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition">
                    <ArrowLeft size={24} />
                </Link>
                <h2 className="text-3xl font-bold text-indigo-900">{subject.name} - {grade.name} Curriculum</h2>
            </div>

            <div className="space-y-8">
                {grade.chapters.map((chapter) => (
                    <div key={chapter.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                            <h3 className="text-xl font-bold text-indigo-800">{chapter.name}</h3>
                        </div>

                        <div className="p-6">
                            {chapter.modules && chapter.modules.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Learning Modules</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {chapter.modules.map((module) => {
                                            const moduleProgress = (progress.modules && progress.modules[module.id]) || { completedSteps: 0, isCompleted: false };

                                            return (
                                                <Link
                                                    key={module.id}
                                                    to={`/learn/${module.id}`}
                                                    className="block group relative bg-white border-2 border-indigo-50 rounded-lg p-4 hover:border-indigo-500 transition-all duration-300"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                            <BookOpen size={20} />
                                                        </div>
                                                        {moduleProgress.isCompleted && <CheckCircle className="text-green-500" size={20} />}
                                                    </div>

                                                    <h4 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-700">{module.name}</h4>
                                                    <p className="text-sm text-slate-500 mb-3">{module.description}</p>

                                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="bg-indigo-500 h-full transition-all duration-500"
                                                            style={{ width: `${(moduleProgress.completedSteps / module.totalSteps) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {chapter.games && chapter.games.length > 0 && (
                                <>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Practice Games</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {chapter.games.map((game) => {
                                            const gameProgress = (progress.games && progress.games[game.id]) || { highScore: 0, levelsUnlocked: 1 };
                                            const isMastered = gameProgress.levelsUnlocked > game.totalLevels;

                                            return (
                                                <Link
                                                    key={game.id}
                                                    to={`/play/${game.id}`}
                                                    className="block group relative bg-white border-2 border-slate-100 rounded-lg p-4 hover:border-indigo-500 transition-all duration-300"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                            <Play size={20} />
                                                        </div>
                                                        {isMastered && <CheckCircle className="text-green-500" size={20} />}
                                                    </div>

                                                    <h4 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-700">{game.name}</h4>
                                                    <p className="text-sm text-slate-500 mb-3">{game.description}</p>

                                                    <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                                                        <span>{game.totalLevels} Levels</span>
                                                        {gameProgress.highScore > 0 && (
                                                            <span className="text-amber-500">High Score: {gameProgress.highScore}</span>
                                                        )}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChapterList;
