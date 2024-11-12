
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
    data: {
        dataTable: DataTable
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
