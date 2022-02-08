import { PromiseTools } from "./PromiseTools.js";
export class BackgroundManager {
    constructor(backgroundPane) {
        this.backgroundPane = backgroundPane;
    }
    reset(backgroundImageSrc) {
        this.backgroundPane.src = backgroundImageSrc !== null && backgroundImageSrc !== void 0 ? backgroundImageSrc : '';
        return PromiseTools.waitForDOMEvent(this.backgroundPane, 'load');
    }
}
