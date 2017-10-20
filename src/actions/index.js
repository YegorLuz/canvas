import Rectangle from '../components/Rectangle';
import Line from '../components/Line';
import Circle from '../components/Circle';
import ImageElement from '../components/ImageElement';

import { DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, BORDER_COLOR_PICKER, FILL_COLOR_PICKER, CANVAS_HEIGHT, CANVAS_WIDTH, DEFAULT_FILL_COLOR } from '../constants/';

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
        _self.saveData();
    };

    return slider;
}

export function initColorPicker () {
    const _self = this;
    const colorPickerElements = document.getElementsByClassName('color-picker');
    const colorPickers = {};

    for (let i = 0; i < colorPickerElements.length; ++i) {
        const colorPicker = colorPickerElements[i];
        colorPicker.oninput = function () {
            const activeShape = _self.shapes[_self.activeShapeIndex];

            if (this.id === BORDER_COLOR_PICKER) {
                activeShape.setBorderColor(this.value);
            } else if (this.id === FILL_COLOR_PICKER) {
                activeShape.setFillColor(this.value);
            }

            _self.redrawShapes();

            _self.saveData();
        };
        colorPickers[colorPicker.id] = colorPicker;
    }

    return colorPickers;
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
    const imagePath = document.getElementById('imagePath');

    imagePath.onchange = function () {
        if (!!this.value) {
            const img = new Image();
            img.onload = function () {
                const image = new ImageElement(this.src, _self.canvasContext);
                _self.activeShapeIndex = _self.shapes.length;
                _self.shapes.push(image);
                _self.updateShapesList();

                _self.saveData();

                _self.setResizer();
            };
            img.src = this.value;
        }
    };

    const undoButton = document.getElementById('undo');
    const redoButton = document.getElementById('redo');

    lineButton.onclick = function () {
        const line = new Line(_self.canvasContext);
        _self.activeShapeIndex = _self.shapes.length;
        _self.shapes.push(line);
        line.draw();
        _self.updateShapesList();

        _self.saveData();

        _self.setResizer();
    };

    rectButton.onclick = function () {
        const rect = new Rectangle(_self.canvasContext);
        _self.activeShapeIndex = _self.shapes.length;
        _self.shapes.push(rect);
        rect.draw();
        _self.updateShapesList();

        _self.saveData();

        _self.setResizer();
    };

    circleButton.onclick = function () {
        const circle = new Circle(_self.canvasContext);
        _self.activeShapeIndex = _self.shapes.length;
        _self.shapes.push(circle);
        circle.draw();
        _self.updateShapesList();

        _self.saveData();

        _self.setResizer();
    };

    clearButton.onclick = function () {
        _self.setDefaultData();
        imagePath.value = '';

        _self.dataBase.clear();
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
                    _self.updateColorPicker(BORDER_COLOR_PICKER, shape.borderColor);
                    _self.updateColorPicker(FILL_COLOR_PICKER, shape.fillColor);
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
                    _self.updateColorPicker(BORDER_COLOR_PICKER, shapes[key].borderColor);
                    _self.updateColorPicker(FILL_COLOR_PICKER, shapes[key].fillColor);
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

export function updateColorPicker (type = null, value = null) {
    const _self = this;
    if (type) {
        if (value) {
            _self.colorPickers[type].value = value;
        } else {
            _self.colorPickers[type].value = type === BORDER_COLOR_PICKER ? DEFAULT_BORDER_COLOR: DEFAULT_FILL_COLOR;
        }
    } else {
        for (let i in _self.colorPickers) {
            if (_self.colorPickers.hasOwnProperty(i)) _self.colorPickers[i].value = i === BORDER_COLOR_PICKER ? DEFAULT_BORDER_COLOR: DEFAULT_FILL_COLOR;
        }
    }
}

export function setDefaultData () {
    const _self = this;

    _self.shapes = [];
    _self.activeShapeIndex = null;
    _self.canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _self.updateShapesList();
    _self.updateSlider(DEFAULT_BORDER_WIDTH);
    _self.updateColorPicker();
}

export function initShapesSelector () {
    const _self = this;
    const list = document.getElementById('elements');

    list.oninput = function () {
        const parts = this.value.match(/(\w+)\s\((\d*)\)/i);
        _self.activeShapeIndex = parseInt(parts[2]);

        const activeShape = _self.shapes[_self.activeShapeIndex];
        _self.updateColorPicker(BORDER_COLOR_PICKER, activeShape.getBorderColor());
        _self.updateColorPicker(FILL_COLOR_PICKER, activeShape.getFillColor());
        _self.updateSlider(activeShape.getBorderWidth());

        _self.setResizer();
    };

    return list;
}

export function updateShapesList () {
    const _self = this;

    let html = '';
    _self.shapes.forEach((shape, key) => {
        const selected = key === _self.activeShapeIndex ? ' selected' : '';
        html += `<option${selected}>${shape.type} (${key})</option>`;

        if (key === _self.activeShapeIndex) {
            _self.updateColorPicker(BORDER_COLOR_PICKER, shape.getBorderColor());
            _self.updateColorPicker(FILL_COLOR_PICKER, shape.getFillColor());
            _self.updateSlider(shape.getBorderWidth());
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
                _self.updateColorPicker(BORDER_COLOR_PICKER, shape.getBorderColor());
                _self.updateColorPicker(FILL_COLOR_PICKER, shape.getFillColor());
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
            _self.saveData();
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

export function initFilters () {
    const _self = this;
    const filtersElement = document.getElementById('filters');
    const filterValueText = document.getElementById('filterValueText');

    const filters = _self.filters.filters;
    filterValueText.innerText = filters[_self.activeFilter].value === _self.filters.NONE_VALUE ? 'none' : `${filters[_self.activeFilter].unitText}: ${filters[_self.activeFilter].value}${filters[_self.activeFilter].unit}`;

    filtersElement.innerHTML = _self.buildFilterOptions(filters);

    filtersElement.onchange = function () {
        _self.activeFilter = this.options[this.selectedIndex].id;
        const activeFilter = _self.filters.filters[_self.activeFilter];
        const unit = activeFilter.unit;
        const unitText = activeFilter.unitText;
        const value = activeFilter.value;
        _self.filterValue.value = value;
        filterValueText.innerText = value === _self.filters.NONE_VALUE ? 'none' : `${unitText}: ${value}${unit}`;
    };

    return filtersElement;
}

export function buildFilterOptions (filters) {
    let options = '';
    for (let i in filters) {
        if (filters.hasOwnProperty(i)) {
            options += `<option id="${i}" ${i === this.activeFilter ? 'selected' : ''}>${i.replace('_', ' ')}</option>`;
        }
    }
    return options;
}

export function initFilterRangeSlider () {
    const _self = this;
    const filterValueElement = document.getElementById('filterValue');
    const filterValueText = document.getElementById('filterValueText');

    const activeFilter = _self.filters.filters[_self.activeFilter];
    const unit = activeFilter.unit;
    const unitText = activeFilter.unitText;
    filterValueText.innerHTML = parseInt(filterValueElement.value) === _self.filters.NONE_VALUE ? 'none' : `${unitText}: ${filterValueElement.value}${unit}`;

    filterValueElement.oninput = function () {
        const value = parseInt(this.value);
        activeFilter.value = value;
        filterValueText.innerHTML = value === _self.filters.NONE_VALUE ? 'none' : `${unitText}: ${value}${unit}`;
        _self.filters[_self.activeFilter](value);
    };

    filterValueElement.onmouseup = function () {
        _self.saveData();
        _self.redrawShapes();
    };

    return filterValueElement;
}

export function updateFiltersList () {
    const _self = this;
    const activeFilter = _self.filters.filters[_self.activeFilter];
    const value = activeFilter.value;
    const unit = activeFilter.unit;
    const unitText = activeFilter.unitText;
    _self.filterList.innerHTML = _self.buildFilterOptions(_self.filters.filters);
    document.getElementById('filterValueText').innerHTML = value === _self.filters.NONE_VALUE ? 'none' : `${unitText}: ${value}${unit}`;
    _self.filterValue.value = value;
}

export function saveData () {
    const _self = this;
    _self.dataBase.add({
        shapes: [..._self.shapes],
        filters: {..._self.filters.filters},
        activeShapeIndex: _self.activeShapeIndex,
        activeFilter: _self.activeFilter
    });
}