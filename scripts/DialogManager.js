export class DialogManager {
    constructor(dialogPane, dialogTextContainer, dialogResponseContainer) {
        this.dialogPane = dialogPane;
        this.dialogTextContainer = dialogTextContainer;
        this.dialogResponseContainer = dialogResponseContainer;
        this.revealTextPrematurely = false;
        this.dialogTextContainer.addEventListener('click', () => {
            this.revealTextPrematurely = true;
        });
    }
    setText(text) {
        this.dialogTextContainer.textContent = '';
        this.revealTextPrematurely = false;
        let revealCount = 1;
        const promise = new Promise(resolve => {
            const handle = window.setInterval(() => {
                if (revealCount > text.length || promise !== this.currentSetTextPromise) {
                    resolve({ handle, reveal: false });
                }
                else if (this.revealTextPrematurely) {
                    resolve({ handle, reveal: true });
                }
                else {
                    this.dialogTextContainer.textContent = text.slice(0, revealCount);
                    revealCount++;
                }
            }, 20);
        }).then(({ handle, reveal }) => {
            window.clearInterval(handle);
            if (reveal) {
                this.dialogTextContainer.textContent = text;
            }
        });
        this.currentSetTextPromise = promise;
        return promise;
    }
    addResponse(text, callback) {
        const el = document.createElement('div');
        el.textContent = text;
        el.classList.add('dialog-response');
        el.addEventListener('click', callback);
        this.dialogResponseContainer.appendChild(el);
    }
    clearResponses() {
        Array.from(this.dialogResponseContainer.children).forEach(response => {
            response.remove();
        });
    }
    reset(text, responses) {
        this.clearText();
        this.clearResponses();
        if (text === undefined || responses === undefined) {
            this.dialogPane.classList.add('undisplayed');
            return Promise.resolve();
        }
        else {
            for (const response of responses) {
                this.addResponse(...response);
            }
            this.dialogPane.classList.remove('undisplayed');
            return this.setText(text);
        }
    }
    clearText() {
        this.currentSetTextPromise = undefined;
        this.dialogTextContainer.textContent = '';
    }
}
