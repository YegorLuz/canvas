class Resizer {
    constructor (context, x, y, width, height) {
        this.context = context;
        this.setDimensions(x, y, width, height);
        this.borderWidth = 1;
        this.borderColor = '#aaaaaa';
    }

    updatePointersDimensions () {
        this.pointers = {
            topLeft: { id: 1, x: this.x, y: this.y },
            topRight: { id: 2, x: this.x + this.width, y: this.y },
            bottomLeft: { id: 3, x: this.x, y: this.y + this.height },
            bottomRight: { id: 4, x: this.x + this.width, y: this.y + this.height }
        };
    }

    getPointers () { return this.pointers; }

    drawPointer (x, y) {
        this.context.beginPath();
        this.context.strokeStyle = this.borderColor;
        this.context.strokeWidth = this.borderWidth;
        this.context.fillStyle = this.borderColor;
        this.context.arc(x, y, 5, 0, 2*Math.PI);
        this.context.closePath();
        this.context.fill();
    }

    setDimensions (x, y, w, h) {
        this.x = x - 7;
        this.y = y - 7;
        this.width = w + 14;
        this.height = h + 14;

        this.updatePointersDimensions();
    }

    drawFrame (x, y, width, height) {
        this.setDimensions(x, y, width, height);

        this.context.beginPath();
        this.context.strokeStyle = this.borderColor;
        this.context.fillStyle = 'transparent';
        this.context.lineWidth = this.borderWidth;
        this.context.rect(this.x, this.y, this.width, this.height);
        this.context.stroke();
        this.context.closePath();

        this.drawPointer(this.x, this.y);
        this.drawPointer(this.x + this.width, this.y);
        this.drawPointer(this.x, this.y + this.height);
        this.drawPointer(this.x + this.width, this.y + this.height);
    }
}

export default Resizer;