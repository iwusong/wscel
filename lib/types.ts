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
  value: string | number;
  richText?: RichText[];
  text?: string; // 兼容原始的 text 字段
};

type DataTableRow = {
  [colIndex: number]: {
    value?: CellValue | (string | number); // 每个单元格的内容，可以有 value 和 richText
    style?: string; // 样式，可能是内置样式
  };
};

type DataTable = {
  [rowIndex: number]: DataTableRow;
};
type EditTable = {
  [rowIndex: number]: EditTableRow | undefined;
};

type EditTableRow = {
  [colIndex: number]: {
    //true 允许编辑,根据customMethods.open 选择默认编辑还是自定义编辑  false关闭则禁止编辑
    open: boolean;
    // customMethods: {
    //   // handle存在且open为true使用自定义编辑,否则使用默认编辑,open为false时也使用默认编辑
    //   open: boolean;
    //   handle?: (
    //     config: InitConfig,
    //     ctx: CanvasRenderingContext2D,
    //     info: CellInfo,
    //   ) => void;
    // };
  };
};
export type InitConfig = {
  data: {
    dataTable: DataTable;
  };
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

  editorialControl: {
    /**
     *  编辑功能控制
     */
    editAllowed: boolean;
    editTable: EditTable;

  };
};
export type Config = {
  data: {
    dataTable: DataTable;
  };
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

  editorialControl?: {
    /**
     * 开启编辑功能,使用默认编辑 关闭则全部禁止编辑
     */
    editAllowed: boolean;
    editTable: EditTable;
  };
};
export type CellInfo = {
  rowIndex: number;
  colIndex: number;
  // 单元格左上角位置相对于canvas x
  x: number;
  // 单元格左上角位置相对于canvas y
  y: number;
  width: number;
  height: number;
};
