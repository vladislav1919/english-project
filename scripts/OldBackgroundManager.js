import { Bitmap } from "./Bitmap.js";
export class OldBackgroundManager {
    constructor(backgroundElement, collisionCanvas) {
        this.backgroundElement = backgroundElement;
        this.collisionCanvas = collisionCanvas;
        this.clickCallbacks = new Map();
        const that = this;
        backgroundElement.addEventListener('click', function (e) {
            if (that.collisionBitmap === undefined) {
                return;
            }
            const color = that.collisionBitmap.getPixelColor(e.offsetX / this.clientWidth * that.collisionCanvas.width, e.offsetY / this.clientHeight * that.collisionCanvas.height);
            console.log(color);
            const cbArr = that.clickCallbacks.get(color);
            if (cbArr !== undefined) {
                cbArr.forEach((cb) => { cb(); });
            }
        });
        backgroundElement.addEventListener('mousemove', function (e) {
            if (that.collisionBitmap === undefined) {
                return;
            }
            const color = that.collisionBitmap.getPixelColor(e.offsetX / this.clientWidth * that.collisionCanvas.width, e.offsetY / this.clientHeight * that.collisionCanvas.height);
            if (color === '00000000') {
                this.classList.remove('pointed-at');
            }
            else {
                this.classList.add('pointed-at');
            }
        });
    }
    addClickCallback(color, cb) {
        let cbArr = this.clickCallbacks.get(color);
        if (cbArr === undefined) {
            cbArr = [cb];
            this.clickCallbacks.set(color, cbArr);
        }
        else {
            cbArr.push(cb);
        }
    }
    clearCallbacks() {
        this.clickCallbacks.clear();
    }
    reset(backgroundImageSrc, collisionImage) {
        this.clearCallbacks();
        if (backgroundImageSrc !== undefined && collisionImage !== undefined) {
            this.backgroundElement.src = backgroundImageSrc;
            this.collisionBitmap = new Bitmap(this.collisionCanvas, collisionImage);
        }
        else {
            this.backgroundElement.src = '';
            this.collisionBitmap = undefined;
        }
    }
}
