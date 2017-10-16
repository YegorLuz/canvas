import Shape from './Shape';

class Rectangle extends Shape {
    constructor (context, x = 170, y = 140, width = 80, height = 60) {
        super(context, 'Rectangle', x, y, width, height);
    }

    draw () {
        this.drawShape(() => this.context.strokeRect(this.x, this.y, this.width, this.height));
    }
}

export default Rectangle;