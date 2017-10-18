import { DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH } from '../constants/';
import Resizer from './Resizer';

class Shape {
    constructor (context, type, x, y, width, height, borderWidth = DEFAULT_BORDER_WIDTH, borderColor = DEFAULT_BORDER_COLOR) {
        this.show = true;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.borderWidth = borderWidth;
        this.borderColor = borderColor;
        this.context = context;
        this.type = type;

        this.resizer = new Resizer(context, x, y, width, height);
        this.showResizer = true;
    }

    getX () { return this.x; }
    getY () { return this.y; }
    getBorderWidth () { return this.borderWidth; }
    getBorderColor () { return this.borderColor; }

    getWidth () { return this.width; }
    getHeight () { return this.height; }

    setWidth (width) { this.width = width; }
    setHeight (height) { this.height = height; }

    setX (x) { this.x = x; }
    setY (y) { this.y = y; }
    setBorderWidth (width) { this.borderWidth = width; }
    setBorderColor (color) { this.borderColor = color; }

    resize (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.resizer.setDimensions(x, y, width, height);
    }

    updateData (data) {
        const { type, show, x, y, width, height, borderWidth, borderColor } = data;
        this.type = type;
        this.show = show;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.borderWidth = borderWidth;
        this.borderColor = borderColor;
    }

    drawShape (stroke) {
        if (this.showResizer) {
            this.resizer.drawFrame(this.x, this.y, this.width, this.height);
        }
        this.context.beginPath();
        this.context.strokeStyle = this.getBorderColor();
        this.context.lineWidth = this.getBorderWidth();
        this.context.strokeWidth = this.getBorderWidth();
        if (stroke) {
            stroke();
        }
        this.context.closePath();
        this.context.stroke();
    }
}

export default Shape;