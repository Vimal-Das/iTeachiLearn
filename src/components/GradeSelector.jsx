import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SUBJECTS } from '../services/gameRegistry';
import { Star, Calculator, Beaker, BookOpen } from 'lucide-react';

const GradeSelector = () => {
    const [selectedSubject, setSelectedSubject] = useState(null);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Calculator': return <Calculator size={32} />;
            case 'Beaker': return <Beaker size={32} />;
            default: return <BookOpen size={32} />;
        }
    };

    if (!selectedSubject) {
        return (
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8 text-indigo-900">Select a Subject</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SUBJECTS.map((subject) => (
                        <div
                            key={subject.id}
                            onClick={() => setSelectedSubject(subject)}
                            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center justify-center border-2 border-transparent hover:border-indigo-500 cursor-pointer"
                        >
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                                <div className="text-indigo-600 group-hover:text-white transition-colors duration-300">
                                    {getIcon(subject.icon)}
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-slate-700 group-hover:text-indigo-700">{subject.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => setSelectedSubject(null)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2"
                >
                    ← Back to Subjects
                </button>
                <h2 className="text-3xl font-bold text-indigo-900">Select Grade for {selectedSubject.name}</h2>
                <div className="w-24"></div> {/* Spacer */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {selectedSubject.grades.map((grade) => (
                    <Link
                        key={grade.id}
                        to={`/subject/${selectedSubject.id}/grade/${grade.id}`}
                        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center justify-center border-2 border-transparent hover:border-indigo-500 cursor-pointer"
                    >
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                            <Star className="text-indigo-600 group-hover:text-white transition-colors duration-300" size={32} />
                        </div>
                        <span className="text-lg font-semibold text-slate-700 group-hover:text-indigo-700">{grade.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default GradeSelector;
