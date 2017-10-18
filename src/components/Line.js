import Shape from './Shape';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants/index";

class Line extends Shape {
    constructor (context, x = CANVAS_WIDTH / 2, y = CANVAS_HEIGHT / 2, width = 80, height = 40) {
        super(context, 'Line', x - width / 2, y - height / 2, width, height);
    }

    draw () {
        this.drawShape(() => {
            this.context.moveTo(this.x, this.y);
            this.context.lineTo(this.x + this.width, this.y + this.height);
        });
    }
}

export default Line;