import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModuleById } from '../services/gameRegistry';
import { storageService } from '../services/storage';
import { ArrowLeft, BookOpen } from 'lucide-react';

const ModuleView = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const iframeRef = useRef(null);
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const foundModule = getModuleById(moduleId);
        if (foundModule) {
            setModule(foundModule);
        } else {
            navigate('/');
        }
    }, [moduleId, navigate]);

    useEffect(() => {
        const handleMessage = (event) => {
            // Security check: In production, verify event.origin

            const { type, payload } = event.data;

            if (type === 'MODULE_INIT') {
                // Send initial progress to module
                const progress = storageService.getModuleProgress(moduleId);
                iframeRef.current.contentWindow.postMessage({
                    type: 'INIT_DATA',
                    payload: {
                        completedSteps: progress.completedSteps,
                        isCompleted: progress.isCompleted
                    }
                }, '*');
            } else if (type === 'STEP_COMPLETE') {
                const { step, totalSteps } = payload;
                const isCompleted = step >= totalSteps;
                storageService.updateModuleProgress(moduleId, step, isCompleted);
            } else if (type === 'MODULE_COMPLETE') {
                storageService.updateModuleProgress(moduleId, module.totalSteps, true);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [moduleId, module]);

    if (!module) return null;

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 font-medium transition"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Chapters</span>
                </button>
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <BookOpen size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-indigo-900">{module.name}</h1>
                </div>
                <div className="w-32"></div> {/* Spacer for centering */}
            </div>

            <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-2xl relative border border-slate-200">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                    </div>
                )}
                <iframe
                    ref={iframeRef}
                    src={module.path}
                    className="w-full h-full border-0"
                    title={module.name}
                    onLoad={() => setLoading(false)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
            </div>
        </div>
    );
};

export default ModuleView;
