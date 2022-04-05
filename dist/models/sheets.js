"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sheet {
    index;
    columnsNames;
    data;
    constructor({ index, columnsNames, data }) {
        this.index = index;
        this.columnsNames = columnsNames;
        this.data = data;
    }
}
exports.default = Sheet;
