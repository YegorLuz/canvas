require('./styles.css');

import DataBase from './db/DataBase';
import ImageElement from "./components/ImageElement";
import Line from './components/Line';
import Rectangle from './components/Rectangle';
import Circle from './components/Circle';
import Filters from './actions/Filters';

import * as actions from './actions/';

import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants/index";

(function () {
    const main = {
        slider: null,
        colorPickers: null,
        selector: null,
        filterList: null,
        filterValue: null,
        filters: null,
        activeFilter: 'grayscale',
        canvas: null,
        canvasContext: null,
        dataBase: null,
        ...actions,
        shapes: null,
        activeShapeIndex: null,
        draggableElementIndex: -1,
        resizingElementIndex: -1,
        activeElementDefaultValue: 'Nothing Selected',
        elementsListDefaultOption: '<option selected>Empty List</option>',
        defaultBorderColor: '#333333',
        defaultBorderWidth: 2,
        redrawShapes: function () {
            this.canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            this.shapes.forEach(shape => {
                if (shape.show) {
                    shape.draw();
                }
            });
            this.filters.applyFilters();
        },
        loadSaved: function () {
            if (this.dataBase.history.length) {
                const _self = this;
                const { shapes, activeShapeIndex, filters, activeFilter } = this.dataBase.getLastHistory();
                _self.activeShapeIndex = activeShapeIndex;
                (shapes || []).forEach(v => {
                    let shape = null;
                    if (v.type === 'Rectangle') {
                        shape = new Rectangle(_self.canvasContext);
                        shape.updateData(v);
                        shape.draw();
                    } else if (v.type === 'Circle') {
                        shape = new Circle(_self.canvasContext);
                        shape.updateData(v);
                        shape.draw();
                    } else if (v.type === 'Line') {
                        shape = new Line(_self.canvasContext);
                        shape.updateData(v);
                        shape.draw();
                    } else if (v.type === 'Image') {
                        shape = new ImageElement(v.src, _self.canvasContext);
                        shape.update(v);
                    }
                    _self.shapes.push(shape);
                });
                _self.updateShapesList();

                if (!!filters && !!activeFilter) {
                    _self.activeFilter = activeFilter;
                    _self.filters = new Filters(_self.canvasContext);
                    _self.filters.updateData(filters);
                    _self.updateFiltersList();
                }
            }
        },
        init () {
            this.canvas = document.getElementById('painter');
            this.canvasContext = this.canvas.getContext('2d');
            this.shapes = [];

            this.dataBase = new DataBase();
            this.filters = new Filters(this.canvasContext);

            this.slider = this.initSlider();
            this.colorPickers = this.initColorPicker();
            this.selector = this.initShapesSelector();
            this.filterList = this.initFilters();
            this.filterValue = this.initFilterRangeSlider();

            this.initButtons();
            this.initDragAndDrop();

            this.loadSaved();
        }
    };

    main.init();
})();