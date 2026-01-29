class GameSDK {
    constructor() {
        this.parent = window.parent;
        this.listeners = {};

        window.addEventListener('message', (event) => {
            const { type, payload } = event.data;
            if (this.listeners[type]) {
                this.listeners[type](payload);
            }
        });

        // Notify parent that game is ready
        this.sendMessage('GAME_INIT', {});
    }

    sendMessage(type, payload) {
        this.parent.postMessage({ type, payload }, '*');
    }

    onInit(callback) {
        this.listeners['INIT_DATA'] = callback;
    }

    reportLevelComplete(score, level) {
        this.sendMessage('LEVEL_COMPLETE', { score, level });
    }

    reportGameOver(score) {
        this.sendMessage('GAME_OVER', { score });
    }
}

window.GameSDK = GameSDK;
