export class Bitmap {
    constructor(canvas, image) {
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (ctx == null) {
            throw new Error('Failed to get drawing context.');
        }
        ctx.drawImage(image, 0, 0, image.width, image.height);
        this.context = ctx;
    }
    getPixelColor(x, y) {
        const data = this.context.getImageData(x, y, 1, 1).data;
        console.log(`getting pixels {${x}, ${y}}`);
        let result = '';
        for (const value of data) {
            result += Number(value).toString(16).padStart(2, '0');
        }
        return result;
    }
}
