class ModuleToolkit {
    constructor(config) {
        this.totalSteps = config.totalSteps;
        this.currentStep = 0;
        this.isCompleted = false;

        // Listen for messages from parent
        window.addEventListener('message', this.handleMessage.bind(this));

        // Notify parent that module is ready
        this.sendMessage('MODULE_INIT', {});
    }

    handleMessage(event) {
        const { type, payload } = event.data;
        if (type === 'INIT_DATA') {
            this.currentStep = payload.completedSteps || 0;
            this.isCompleted = payload.isCompleted || false;
            this.onInit(payload);
        }
    }

    sendMessage(type, payload) {
        window.parent.postMessage({ type, payload }, '*');
    }

    completeStep(stepIndex) {
        if (stepIndex > this.currentStep) {
            this.currentStep = stepIndex;
            this.sendMessage('STEP_COMPLETE', {
                step: this.currentStep,
                totalSteps: this.totalSteps
            });
        }
    }

    completeModule() {
        this.isCompleted = true;
        this.sendMessage('MODULE_COMPLETE', {});
    }

    // Hook for module to override
    onInit(data) {
        console.log('Module initialized with data:', data);
    }
}

window.ModuleToolkit = ModuleToolkit;
