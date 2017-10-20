import Shape from './Shape';
import { CANVAS_WIDTH, CANVAS_HEIGHT, DEFAULT_BORDER_WIDTH, DEFAULT_BORDER_COLOR } from "../constants/index";

class Rectangle extends Shape {
    constructor (context, x = CANVAS_WIDTH / 2, y = CANVAS_HEIGHT / 2, width = 80, height = 60, borderWidth = DEFAULT_BORDER_WIDTH, borderColor = DEFAULT_BORDER_COLOR) {
        super(context, 'Rectangle', x - width / 2, y - height / 2, width, height, borderWidth, borderColor);
    }

    draw () {
        this.drawShape(() => this.context.rect(this.x, this.y, this.width, this.height));
    }
}

export default Rectangle;