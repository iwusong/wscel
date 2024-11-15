import { getCellValue } from "../utils";
import { CellInfo, InitConfig } from "../types";
import { Emitter } from "../mitt.ts";
import { Events } from "./initEvent.ts";

export function cellTextClick(
  config: InitConfig,
  ctx: CanvasRenderingContext2D,
  cellInfo: CellInfo,
  event: MouseEvent,
  emitter: Emitter<Events>,
) {
  const { rowIndex, colIndex, x, y, width, height } = cellInfo;
  const { offsetX, offsetY } = event;
  const cellValue = getCellValue(rowIndex, colIndex, config);
  const startX = (width - ctx.measureText(cellValue).width) / 2;
  const textY = y + height / 2 + 5; // 已渲染的字符Y位置
  const charHeight = parseInt(ctx.font.match(/\d+/)?.[0] || "16", 10); // 提取字体高度

  // 检查 y 方向是否在字符高度范围内
  if (offsetY >= textY - charHeight / 2 && offsetY <= textY + charHeight / 2) {
    // 计算并找出点击位置的字符
    let widthAccumulated = 0;
    let index = 0;
    for (const char of cellValue) {
      index++;
      const charWidth = ctx.measureText(char).width;
      widthAccumulated += charWidth;
      if (widthAccumulated > offsetX - x - startX && offsetX - x - startX > 0) {
        emitter.emit(`click-${rowIndex}-${colIndex}-text`, {
          value: cellValue,
          char: char,
          index: index,
        });
        break;
      }
    }
  }
}
