class Sheet {
        index: number;
    
        columnsNames: string[];
    
        data: object;
    
        constructor({ index, columnsNames, data }: Sheet) {
            this.index = index;
            this.columnsNames = columnsNames;
            this.data = data;
        }
    }
    
    export default Sheet;