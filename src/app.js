require('./styles.css');

import DataBase from './db/DataBase';

import Line from './components/Line';
import Rectangle from './components/Rectangle';
import Circle from './components/Circle';

import * as actions from './actions/';

(function () {
    const main = {
        slider: null,
        colorPicker: null,
        selector: null,
        canvas: null,
        canvasContext: null,
        dataBase: null,
        ...actions,
        shapes: null,
        activeShapeIndex: null,
        draggableElementIndex: -1,
        activeElementDefaultValue: 'Nothing Selected',
        elementsListDefaultOption: '<option selected>Empty List</option>',
        defaultBorderColor: '#333333',
        defaultBorderWidth: 2,
        redrawShapes: function () {
            this.canvasContext.clearRect(0, 0, 470, 370);
            this.shapes.forEach(shape => {
                if (shape.show) {
                    shape.draw();
                }
            });
        },
        loadSaved: function () {
            if (this.dataBase.history.length) {
                const _self = this;
                const { shapes, activeShapeIndex } = this.dataBase.getLastHistory();
                this.activeShapeIndex = activeShapeIndex;
                (shapes || []).forEach(v => {
                    let shape = null;
                    if (v.type === 'Rectangle') {
                        shape = new Rectangle(_self.canvasContext);
                        shape.updateData(v);
                    } else if (v.type === 'Circle') {
                        shape = new Circle(_self.canvasContext);
                        shape.update(v);
                    } else if (v.type === 'Line') {
                        shape = new Line(_self.canvasContext);
                        shape.updateData(v);
                    }
                    _self.shapes.push(shape);
                    shape.draw();
                });
                _self.updateShapesList();
                _self.setActiveElement();
            }
        },
        init () {
            this.canvas = document.getElementById('painter');
            this.canvasContext = this.canvas.getContext('2d');
            this.shapes = [];

            this.dataBase = new DataBase();

            this.slider = this.initSlider();
            this.colorPicker = this.initColorPicker();
            this.selector = this.initShapesSelector();

            this.initButtons();
            this.initDragAndDrop();

            this.loadSaved();
        }
    };

    main.init();
})();