import Shape from './Shape';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants/index";

class Circle extends Shape {
    constructor (context, x = CANVAS_WIDTH / 2, y = CANVAS_HEIGHT / 2, r = 60) {
        super(context, 'Circle', x, y, r*2, r*2);
    }

    draw () {
        const r = (this.width <= this.height ? this.width : this.height) / 2;
        this.drawShape(() => this.context.arc(this.x + this.width / 2, this.y + this.height / 2, r, 0, 2*Math.PI));
    }
}

export default Circle;