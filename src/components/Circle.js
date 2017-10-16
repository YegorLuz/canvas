import Shape from './Shape';

class Circle extends Shape {
    constructor (context, x = 370, y = 270, r = 60) {
        super(context, 'Circle', x, y, r, r);
        this.r = r;
    }

    update (data) {
        this.updateData(data);
        this.r = data.r;
    }

    draw () {
        this.drawShape(() => this.context.arc(this.x, this.y, this.r, 0, 2*Math.PI));
    }
}

export default Circle;