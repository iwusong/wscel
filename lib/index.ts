import {initGrid} from "./grid.ts";

export type Span = {
    row: number;
    col: number;
    rowCount: number;
    colCount: number;
};
export type Row = {
    size: number;
} | null;

export type Column = {
    size: number;
} | null;
type RichTextStyle = {
    foreColor: string;
    font: string;
};

type RichText = {
    text: string;
    style?: RichTextStyle;
};

type CellValue = {
    value: string;
    richText?: RichText[];
    text?: string;  // 兼容原始的 text 字段
};

type DataTableRow = {
    [colIndex: number]: {
        value?: CellValue | string;  // 每个单元格的内容，可以有 value 和 richText
        style?: string;      // 样式，可能是内置样式
    };
};

type DataTable = {
    [rowIndex: number]: DataTableRow;
};
export type InitConfig = {
    data:{
        dataTable:DataTable
    }
    spans: Span[];
    rows: Row[];
    columns: Column[];
    defaults: {
        colHeaderRowHeight: number;
        colWidth: number;
        rowHeaderColWidth: number;
        rowHeight: number;
        _isExcelDefaultColumnWidth: boolean;
    };
    rowCount: number;
    columnCount: number;
};

export default class Wscel {
    private readonly ctx: CanvasRenderingContext2D;

    constructor(div: Element, config: InitConfig) {
        Wscel.fillDefaultRowsAndColumns(config);
        const canvas = document.createElement('canvas');
        canvas.width = Wscel.calculateCanvasWidth(config) + 3;
        canvas.height = Wscel.calculateCanvasHeight(config) + 3;
        this.ctx = canvas.getContext('2d')!;
        div.appendChild(canvas);
        this.init(config);
    }

    private loadDate() {
    }

    private init(config: InitConfig) {
        // 设置画布背景颜色
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        initGrid(config,this.ctx)
    }



    private static fillDefaultRowsAndColumns(config: InitConfig) {
        while (config.rows.length < config.rowCount) {
            config.rows.push({size: config.defaults.rowHeight});
        }
        while (config.columns.length < config.columnCount) {
            config.columns.push({size: config.defaults.colWidth});
        }
    }

    static calculateCanvasWidth(config: InitConfig): number {
        return config.columns.reduce((totalWidth, col) =>
            totalWidth + (col ? col.size : config.defaults.colWidth), 0
        );
    }

    static calculateCanvasHeight(config: InitConfig): number {
        return config.rows.reduce((totalHeight, row) =>
            totalHeight + (row ? row.size : config.defaults.rowHeight), 0
        );
    }
}
