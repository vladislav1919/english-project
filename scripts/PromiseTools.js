export const PromiseTools = {
    toVoid(promise) {
        return promise.then(() => { });
    },
    wait(milliseconds) {
        return new Promise(resolve => {
            window.setTimeout(resolve, milliseconds);
        });
    },
    waitForDOMEvent(node, eventType) {
        return new Promise(resolve => {
            node.addEventListener(eventType, () => {
                resolve();
            }, { once: true });
        });
    }
};
