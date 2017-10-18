import Shape from './Shape';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants/index";

class ImageElement extends Shape {
    constructor (src, context, x = CANVAS_WIDTH / 2, y = CANVAS_HEIGHT / 2, width = 200, height = 150) {
        super(context, 'Image', x - width / 2, y - height / 2, width, height);

        this.src = src;
        this.createImage(src);
    }

    update (data) {
        this.updateData(data);
        this.createImage(data.src);
    }

    createImage (src) {
        const _self = this;
        const img = new Image();
        img.src = src;
        img.onload = function () {
            const w = CANVAS_WIDTH / this.naturalWidth;
            const h = CANVAS_HEIGHT / this.naturalHeight;
            const padding = 60;
            let width = this.naturalWidth;
            let height = this.naturalHeight;
            if (this.naturalWidth > CANVAS_WIDTH - padding) {
                if (this.naturalHeight * w > CANVAS_HEIGHT - padding) {
                    height = CANVAS_HEIGHT - padding;
                    width = width * h;
                    _self.y = padding/2;
                    _self.x = (CANVAS_WIDTH - padding/2 - width)/2;
                } else {
                    height = height * w;
                    width = CANVAS_WIDTH - padding;
                    _self.y = (CANVAS_HEIGHT - padding/2 - height)/2;
                    _self.x = padding/2;
                }
            } else {
                if (this.naturalHeight > CANVAS_HEIGHT - padding) {
                    height = CANVAS_HEIGHT - padding;
                    width = width * h;
                    _self.y = padding/2;
                    _self.x = (CANVAS_WIDTH - padding/2 - width)/2;
                }
            }
            img.width = width;
            img.height = height;
            _self.setWidth(width);
            _self.setHeight(height);
            _self.resizer.width = width;
            _self.resizer.height = height;
            _self.img = img;
            _self.draw();
        };
    }

    draw () {
        if (!!this.img) {
            this.drawShape(() => {
                this.context.drawImage(this.img, this.x, this.y, this.width, this.height);
            });
        }
    }
}

export default ImageElement;