export class TriggerManager {
    constructor(triggerPane) {
        this.triggerPane = triggerPane;
    }
    addTrigger(x, y, clickCallback) {
        const trigger = this.createTrigger();
        trigger.style.left = (x * 100).toString() + '%';
        trigger.style.top = (y * 100).toString() + '%';
        trigger.addEventListener('click', clickCallback);
        this.triggerPane.insertBefore(trigger, null);
        return Promise.resolve();
    }
    clearTriggers() {
        Array.from(this.triggerPane.children).forEach(trigger => {
            trigger.remove();
        });
        return Promise.resolve();
    }
    createTrigger() {
        const trigger = document.createElement('div');
        const cue = document.createElement('div');
        trigger.classList.add(`trigger`);
        cue.classList.add(`trigger-cue`);
        trigger.insertBefore(cue, null);
        return trigger;
    }
}
;
