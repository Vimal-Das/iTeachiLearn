import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameById } from '../services/gameRegistry';
import { storageService } from '../services/storage';
import { ArrowLeft, RefreshCw, Maximize2 } from 'lucide-react';

const GameView = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const iframeRef = useRef(null);
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const foundGame = getGameById(gameId);
        if (foundGame) {
            setGame(foundGame);
        } else {
            navigate('/');
        }
    }, [gameId, navigate]);

    useEffect(() => {
        const handleMessage = (event) => {
            // Security check: In production, verify event.origin

            const { type, payload } = event.data;

            if (type === 'GAME_INIT') {
                // Send initial progress to game
                const progress = storageService.getGameProgress(gameId);
                iframeRef.current.contentWindow.postMessage({
                    type: 'INIT_DATA',
                    payload: {
                        levelsUnlocked: progress.levelsUnlocked,
                        highScore: progress.highScore
                    }
                }, '*');
            } else if (type === 'LEVEL_COMPLETE') {
                const { score, level } = payload;
                storageService.updateGameProgress(gameId, score, level);
                // Optional: Show toast or celebration in parent
            } else if (type === 'GAME_OVER') {
                // Handle game over
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [gameId]);

    if (!game) return null;

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 font-medium transition"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Chapters</span>
                </button>
                <h1 className="text-2xl font-bold text-indigo-900">{game.name}</h1>
                <div className="w-24"></div> {/* Spacer for centering */}
            </div>

            <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                    </div>
                )}
                <iframe
                    ref={iframeRef}
                    src={game.path}
                    className="w-full h-full border-0"
                    title={game.name}
                    onLoad={() => setLoading(false)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
            </div>
        </div>
    );
};

export default GameView;
