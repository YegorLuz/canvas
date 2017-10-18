import Rectangle from '../components/Rectangle';
import Line from '../components/Line';
import Circle from '../components/Circle';
import ImageElement from '../components/ImageElement';

import { DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH } from '../constants/';
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "../constants/index";

export function initSlider () {
    const _self = this;
    const slider = document.getElementById('width-range');
    const output = document.getElementById('width-range-value');
    output.innerHTML = slider.value;

    slider.oninput = function () {
        output.innerHTML = this.value;
        const activeShape = _self.shapes[_self.activeShapeIndex];
        activeShape.setBorderWidth(this.value);
        _self.redrawShapes();
    };

    slider.onmouseup = function () {
        _self.dataBase.add({
            shapes: [..._self.shapes],
            activeShapeIndex: _self.activeShapeIndex,
        });
    };

    return slider;
}

export function initColorPicker () {
    const _self = this;
    const colorPicker = document.getElementById('color-picker');

    colorPicker.oninput = function () {
        const activeShape = _self.shapes[_self.activeShapeIndex];
        activeShape.setBorderColor(this.value);
        _self.redrawShapes();

        _self.dataBase.add({
            shapes: [..._self.shapes],
            activeShapeIndex: _self.activeShapeIndex,
        });
    };

    return colorPicker;
}

export function setResizer () {
    const _self = this;
    _self.canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    for (let i = 0; i < _self.shapes.length; ++i) {
        _self.shapes[i].showResizer = false;
    }
    _self.shapes[_self.activeShapeIndex].showResizer = true;
    _self.redrawShapes();
}

export function initButtons () {
    const _self = this;
    const lineButton = document.getElementById('line');
    const rectButton = document.getElementById('rect');
    const circleButton = document.getElementById('circle');
    const clearButton = document.getElementById('clear');
    const imageButton = document.getElementById('image');

    const undoButton = document.getElementById('undo');
    const redoButton = document.getElementById('redo');

    lineButton.onclick = function () {
        const line = new Line(_self.canvasContext);
        _self.activeShapeIndex = _self.shapes.length;
        _self.shapes.push(line);
        line.draw();
        _self.updateShapesList();

        _self.dataBase.add({
            shapes: [..._self.shapes],
            activeShapeIndex: _self.activeShapeIndex,
        });

        _self.setResizer();
    };

    rectButton.onclick = function () {
        const rect = new Rectangle(_self.canvasContext);
        _self.activeShapeIndex = _self.shapes.length;
        _self.shapes.push(rect);
        rect.draw();
        _self.updateShapesList();

        _self.dataBase.add({
            shapes: [..._self.shapes],
            activeShapeIndex: _self.activeShapeIndex,
        });

        _self.setResizer();
    };

    circleButton.onclick = function () {
        const circle = new Circle(_self.canvasContext);
        _self.activeShapeIndex = _self.shapes.length;
        _self.shapes.push(circle);
        circle.draw();
        _self.updateShapesList();

        _self.dataBase.add({
            shapes: [..._self.shapes],
            activeShapeIndex: _self.activeShapeIndex
        });

        _self.setResizer();
    };

    clearButton.onclick = function () {
        _self.setDefaultData();

        _self.dataBase.clear();
    };

    imageButton.onclick = function () {
        const image = new ImageElement('img.jpg', _self.canvasContext);
        _self.activeShapeIndex = _self.shapes.length;
        _self.shapes.push(image);
        _self.updateShapesList();

        _self.dataBase.add({
            shapes: [..._self.shapes],
            activeShapeIndex: _self.activeShapeIndex
        });

        _self.setResizer();
    };

    undoButton.onclick = function () {
        const data = _self.dataBase.undo();
        if (!!data) {
            const { shapes, activeShapeIndex } = data;
            (shapes || []).forEach((shape, key) => {
                if (!_self.shapes[key]) {
                    _self.shapes[key].show = true;
                } else {
                    _self.shapes[key].updateData(shape);
                    _self.updateSlider(shape.borderWidth);
                    _self.updateColorPicker(shape.borderColor);
                }
            });
            _self.activeShapeIndex = activeShapeIndex;
            _self.setResizer();
        } else {
            _self.setDefaultData();
        }
    };

    redoButton.onclick = function () {
        const data = _self.dataBase.redo();
        if (!!data) {
            const { shapes, activeShapeIndex } = data;
            _self.shapes.forEach((shape, key) => {
                if (!!shapes[key]) {
                    shape.updateData(shapes[key]);
                    _self.updateColorPicker(shapes[key].borderColor);
                    _self.updateSlider(shapes[key].borderWidth);
                } else {
                    _self.shapes[key].show = false;
                }
            });
            _self.activeShapeIndex = activeShapeIndex;
            _self.setResizer();
        } else {
            _self.setDefaultData();
        }
    };
}

export function updateSlider (value) {
    const _self = this;
    _self.slider.value = value || DEFAULT_BORDER_WIDTH;
    document.getElementById('width-range-value').innerHTML = value || DEFAULT_BORDER_WIDTH;
}

export function updateColorPicker (value) {
    const _self = this;
    _self.colorPicker.value = value || DEFAULT_BORDER_COLOR;
}

export function setDefaultData () {
    const _self = this;

    _self.shapes = [];
    _self.activeShapeIndex = null;
    _self.canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _self.setActiveElement(_self.activeElementDefaultValue);
    _self.updateShapesList();
    _self.updateSlider(DEFAULT_BORDER_WIDTH);
    _self.updateColorPicker(DEFAULT_BORDER_COLOR);
}

export function initShapesSelector () {
    const _self = this;
    const list = document.getElementById('elements');

    list.oninput = function () {
        const parts = this.value.match(/(\w+)\s\((\d*)\)/i);
        _self.activeShapeIndex = parseInt(parts[2]);
        _self.setActiveElement();

        const activeShape = _self.shapes[_self.activeShapeIndex];
        _self.updateColorPicker(activeShape.getBorderColor());
        _self.updateSlider(activeShape.getBorderWidth());

        _self.setResizer();
    };

    return list;
}

export function setActiveElement (value = null) {
    const _self = this;
    const activeElement = document.getElementById('active-element');
    if (!value) {
        const index = _self.activeShapeIndex;
        const type = _self.shapes[_self.activeShapeIndex].type;
        activeElement.value = `${type} (${index})`;
    } else {{
        activeElement.value = value;
    }}
}

export function updateShapesList () {
    const _self = this;

    let html = '';
    _self.shapes.forEach((shape, key) => {
        const selected = key === _self.activeShapeIndex ? ' selected' : '';
        html += `<option${selected}>${shape.type} (${key})</option>`;

        if (key === _self.activeShapeIndex) {
            _self.updateColorPicker(shape.getBorderColor());
            _self.updateSlider(shape.getBorderWidth());
            _self.setActiveElement();
        }
    });

    _self.selector.innerHTML = html.length ? html : _self.elementsListDefaultOption;
}

export function initDragAndDrop () {
    const _self = this;

    _self.canvas.onmousedown = function (e) {
        const x = e.offsetX;
        const y = e.offsetY;
        _self.shapes.forEach((shape, key) => {
            const shapeX = shape.getX();
            const shapeY = shape.getY();
            const shapeWidth = shape.getWidth();
            const shapeHeight = shape.getHeight();
            if (x >= shapeX && x <= shapeX + shapeWidth && y >= shapeY && y <= shapeY + shapeHeight) {
                _self.draggableElementIndex = key;
                _self.activeShapeIndex = key;
                _self.updateSlider(shape.getBorderWidth());
                _self.updateColorPicker(shape.getBorderColor());
                _self.updateShapesList();
                _self.setResizer();
                return false;
            }
        });

        const currentShape = _self.shapes[_self.activeShapeIndex];
        const resizerPointers = currentShape.resizer.getPointers();
        const { topLeft, topRight, bottomLeft, bottomRight } = resizerPointers;
        const topLeftClicked = x >= topLeft.x-5 && x <= topLeft.x+5 && y >= topLeft.y-5 && y <= topLeft.y+5 ? topLeft.id : 0;
        const topRightClicked = x >= topRight.x-5 && x <= topRight.x+5 && y >= topRight.y-5 && y <= topRight.y+5 ? topRight.id : 0;
        const bottomLeftClicked = x >= bottomLeft.x-5 && x <= bottomLeft.x+5 && y >= bottomLeft.y-5 && y <= bottomLeft.y+5 ? bottomLeft.id : 0;
        const bottomRightClicked = x >= bottomRight.x-5 && x <= bottomRight.x+5 && y >= bottomRight.y-5 && y <= bottomRight.y+5 ? bottomRight.id : 0;
        if (topLeftClicked || topRightClicked || bottomLeftClicked || bottomRightClicked) {
            _self.resizingElementIndex = _self.activeShapeIndex;
            _self.resizerPointerId = topLeftClicked || topRightClicked || bottomLeftClicked || bottomRightClicked;
            _self.draggableElementIndex = -1;
        } else {
            _self.resizingElementIndex = -1;
        }
    };
    _self.canvas.onmouseup = function () {
        if (_self.draggableElementIndex !== -1 || _self.resizingElementIndex !== -1) {
            _self.dataBase.add({
                shapes: [..._self.shapes],
                activeShapeIndex: _self.activeShapeIndex,
            });
        }
        _self.draggableElementIndex = -1;
        _self.resizingElementIndex = -1;
    };
    _self.canvas.onmousemove = function (e) {
        const shape = _self.shapes[_self.activeShapeIndex];
        const x = e.offsetX;
        const y = e.offsetY;
        if (_self.draggableElementIndex !== -1) {
            const shapeHalfWidth = shape.getWidth() / 2;
            const shapeHalfHeight = shape.getHeight() / 2;
            const newX = x - shapeHalfWidth >= 0 ? x - shapeHalfWidth : 0;
            const newY = y - shapeHalfHeight >= 0 ? y - shapeHalfHeight : 0;
            shape.setX(newX);
            shape.setY(newY);
            _self.redrawShapes();
        } else if (_self.resizingElementIndex !== -1) {
            let rx = shape.getX();
            let ry = shape.getY();
            let rw = shape.width;
            let rh = shape.height;

            switch (_self.resizerPointerId) {
                case 1:
                    rx = x;
                    ry = y;
                    rw = rw + (shape.getX() - x);
                    rh = rh + (shape.getY() - y);
                    break;
                case 2:
                    ry = y;
                    rw = x - shape.getX();
                    rh = shape.getY() + shape.height - y;
                    break;
                case 3:
                    rx = x;
                    rw = rw + (shape.getX() - x);
                    rh = y - shape.getY();
                    break;
                case 4:
                    rx = shape.getX();
                    ry = shape.getY();
                    rw = x - shape.getX();
                    rh = y - shape.getY();
                    break;
            }

            shape.resize(rx, ry, rw, rh);
            _self.redrawShapes();
        }
    };
}