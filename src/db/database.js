import { PAINTER_STEPS } from '../constants/';

class DataBase {
    constructor () {
        this.getData();
    };

    clear () {
        localStorage.removeItem(PAINTER_STEPS);
    }

    add (data) {
        const newData = {...data, show: true};
        this.getData();
        this.history.push(newData);
        this.history = this.history.filter(v => v.show);
        this.saveData();
    }

    remove () {
        this.getData();
        this.history.pop();
        this.saveData();
    }

    undo () {
        let data = {};
        this.getData();
        const history = this.history;
        for (let i = 0; i < history.length; ++i) {
            if (!history[i].show) {
                history[i].show = true;
                data = history[i];
                break;
            }
        }
        this.saveData();
        return data;
    }

    redo () {
        let data = {};
        this.getData();
        const history = this.history;
        for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].show) {
                history[i].show = !i;
                data = i - 1 >= 0 ? history[i - 1] : history[i];
                break;
            }
        }
        this.saveData();
        return data;
    }

    saveData () {
        localStorage.setItem(PAINTER_STEPS, JSON.stringify(this.history));
    }

    getData () {
        this.history = JSON.parse(localStorage.getItem(PAINTER_STEPS) || '[]');
    }

    getLastHistory () {
        let data = {};
        const history = this.history;
        this.getData();
        for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].show) {
                data = history[i];
                break;
            }
        }
        return data;
    }
}

export default DataBase;