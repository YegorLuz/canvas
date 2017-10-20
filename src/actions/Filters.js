class Filters {
    constructor (context) {
        this.context = context;
        this.NONE_VALUE = -1;
        this.filters = {
            grayscale: {
                value: this.NONE_VALUE,
                unit: '%',
                unitText: 'Percents'
            },
            blur: {
                value: this.NONE_VALUE,
                unit: 'px',
                unitText: 'Length'
            },
            brightness: {
                value: this.NONE_VALUE,
                unit: '%',
                unitText: 'Percents'
            },
            contrast: {
                value: this.NONE_VALUE,
                unit: '%',
                unitText: 'Percents'
            },
            hue_rotate: {
                value: this.NONE_VALUE,
                unit: 'deg',
                unitText: 'Angle'
            },
            invert: {
                value: this.NONE_VALUE,
                unit: '%',
                unitText: 'Percents'
            },
            opacity: {
                value: this.NONE_VALUE,
                unit: '%',
                unitText: 'Percents'
            },
            saturate: {
                value: this.NONE_VALUE,
                unit: '%',
                unitText: 'Percents'
            },
            sepia: {
                value: this.NONE_VALUE,
                unit: '%',
                unitText: 'Percents'
            }
        };
    }

    grayscale (percents = this.NONE_VALUE) {
        this.filters['grayscale'].value = percents;
        this.applyFilters();
    }

    blur (length = this.NONE_VALUE) {
        this.filters['blur'].value = length;
        this.applyFilters();
    }

    brightness (percents = this.NONE_VALUE) {
        this.filters['brightness'].value = percents;
        this.applyFilters();
    }

    contrast (percents = this.NONE_VALUE) {
        this.filters['contrast'].value = percents;
        this.applyFilters();
    }

    hue_rotate (degree = this.NONE_VALUE) {
        this.filters['hue_rotate'].value = degree;
        this.applyFilters();
    }

    invert (percents = this.NONE_VALUE) {
        this.filters['invert'].value = percents;
        this.applyFilters();
    }

    opacity (percents = this.NONE_VALUE) {
        this.filters['opacity'].value = percents;
        this.applyFilters();
    }

    saturate (percents = this.NONE_VALUE) {
        this.filters['saturate'].value = percents;
        this.applyFilters();
    }

    sepia (percents = this.NONE_VALUE) {
        this.filters['sepia'].value = percents;
        this.applyFilters();
    }

    updateData (data) {
        this.filters = {...this.filters, ...data};
        this.applyFilters();
    }

    applyFilters () {
        let filters = '';
        for (let i in this.filters) {
            if (this.filters.hasOwnProperty(i) && this.filters[i].value !== this.NONE_VALUE) {
                const filter = this.filters[i];
                filters += `${i.replace('_', '-')}(${filter.value}${filter.unit}) `;
            }
        }
        this.context.filter = filters;
    }

    clear () {
        for (let i in this.filters) {
            if (this.filters.hasOwnProperty(i)) this.filters[i].value = this.NONE_VALUE;
        }
        this.applyFilters();
    }
}

export default Filters;