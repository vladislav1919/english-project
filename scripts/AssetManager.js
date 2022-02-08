export class AssetManager {
    constructor() {
        this.assets = new Map();
        this.downloading = new Set();
    }
    loadImage(filename) {
        const assetNode = this.assets.get(filename);
        if (assetNode !== undefined) {
            return Promise.resolve(assetNode);
        }
        this.downloading.add(filename);
        const tmpNode = new Image();
        const promise = new Promise(resolve => {
            tmpNode.addEventListener('load', () => {
                this.downloading.delete(filename);
                this.assets.set(filename, tmpNode);
                resolve(tmpNode);
            });
        });
        tmpNode.src = this.resolvePath(filename);
        return promise;
    }
    loadImages(filenames) {
        const promises = filenames.map(filename => this.loadImage(filename));
        return Promise.all(promises);
    }
    getImageSrc(filename) {
        return this.getImageElement(filename).src;
    }
    getImageElement(filename) {
        const el = this.assets.get(filename);
        if (el) {
            return el;
        }
        throw new Error(`No asset '${filename}' has been loaded.`);
    }
    isReady() {
        return this.downloading.size == 0;
    }
    resolvePath(filename) {
        return `../assets/${filename}`;
    }
}
