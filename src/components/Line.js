import Shape from './Shape';

class Line extends Shape {
    constructor (context, x = 20, y = 20, width = 80, height = 40) {
        super(context, 'Line', x, y, width, height);
    }

    draw () {
        this.drawShape(() => {
            this.context.moveTo(this.x, this.y);
            this.context.lineTo(this.x + this.width, this.y + this.height);
        });
    }
}

export default Line;