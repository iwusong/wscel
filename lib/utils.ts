import {
  calculateSpanHeight,
  calculateSpanWidth,
  findSpan,
  initGrid,
} from "./grid.ts";
import { CellInfo, InitConfig } from "./types.ts";

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isNumber(value: any): value is number {
  return typeof value === "number";
}

// 根据点击位置获取单元格信息，考虑到合并单元格
export function getCellInfoAtPosition(
  x: number,
  y: number,
  config: InitConfig,
): CellInfo | null {
  let currentY = 0;

  for (let rowIndex = 0; rowIndex < config.rowCount; rowIndex++) {
    const rowHeight = config.rows[rowIndex]?.size ?? config.defaults.rowHeight;
    let currentX = 0;

    for (let colIndex = 0; colIndex < config.columnCount; colIndex++) {
      const colWidth =
        config.columns[colIndex]?.size ?? config.defaults.colWidth;
      const span = findSpan(rowIndex, colIndex, config.spans);

      if (span && span.row === rowIndex && span.col === colIndex) {
        const mergedWidth = calculateSpanWidth(span, config);
        const mergedHeight = calculateSpanHeight(span, config);

        if (
          x >= currentX &&
          x < currentX + mergedWidth &&
          y >= currentY &&
          y < currentY + mergedHeight
        ) {
          return {
            rowIndex,
            colIndex,
            x: currentX,
            y: currentY,
            width: mergedWidth,
            height: mergedHeight,
          };
        }

        colIndex += span.colCount - 1;
        currentX += mergedWidth;
      } else if (!span) {
        if (
          x >= currentX &&
          x < currentX + colWidth &&
          y >= currentY &&
          y < currentY + rowHeight
        ) {
          return {
            rowIndex,
            colIndex,
            x: currentX,
            y: currentY,
            width: colWidth,
            height: rowHeight,
          };
        }
        currentX += colWidth;
      } else {
        currentX += colWidth;
      }
    }
    currentY += rowHeight;
  }
  return null;
}

export function getCellValue(
  rowIndex: number,
  colIndex: number,
  config: InitConfig,
): string {
  const cell = config.data.dataTable[rowIndex]?.[colIndex];
  if (cell) {
    if (cell.value) {
      if (isString(cell.value)) return cell.value;
      if (isNumber(cell.value)) return cell.value.toString();
      return isString(cell.value.value)
        ? cell.value.value
        : cell.value.value.toString();
    } else {
      return "";
    }
  } else {
    return "";
  }
}

export function setCellValue(
  rowIndex: number,
  colIndex: number,
  value: string | number,
  config: InitConfig,
) {
  const cell = config.data.dataTable[rowIndex]?.[colIndex];
  if (cell && cell.value != undefined) {
    if (isString(cell.value)) {
      cell.value = value;
      return;
    }
    if (isNumber(cell.value)) {
      cell.value = value;
      return;
    }
    cell.value.value = value;
  }
}

export function defaultEditing(
  config: InitConfig,
  ctx: CanvasRenderingContext2D,
  cellInfo: CellInfo,
) {
  const { rowIndex, colIndex, x, y, width, height } = cellInfo;
  let cellValue = getCellValue(rowIndex, colIndex, config);
  let canvas = ctx.canvas;
  // 创建输入框
  const input = document.createElement("input");
  input.type = "text";
  input.value = cellValue;
  input.style.position = "absolute";
  input.style.left = `${canvas.offsetLeft + x}px`;
  input.style.top = `${canvas.offsetTop + y}px`;
  input.style.width = `${width}px`;
  input.style.height = `${height}px`;
  input.style.border = "none";
  input.style.padding = "0";
  input.style.margin = "0";
  input.style.outlineColor = "blue";
  document.body.appendChild(input);
  input.focus();

  input.addEventListener("blur", () => {
    setCellValue(rowIndex, colIndex, input.value, config);
    document.body.removeChild(input);
    // 重绘表格
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initGrid(config, ctx);
  });
}

// 打开全局编辑后,关闭指定区域编辑功能
export function setEditArea(
  config: InitConfig,
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  isOpen: boolean,
) {


  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      if (!config.editorialControl.editTable[row]) {
        config.editorialControl.editTable[row] = {};
      }
      if (!config.editorialControl.editTable[row]![col]) {
        config.editorialControl.editTable[row]![col] = {
          open: isOpen,
          // customMethods: {
          //     open: true,
          // },
        };
        return;
      }
      config.editorialControl.editTable[row]![col].open = isOpen;
    }
  }
}
