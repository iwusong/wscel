import { CellInfo, InitConfig } from "../types";
import { Emitter } from "../mitt.ts";
import { getCellInfoAtPosition } from "../utils.ts";
import { cellTextClick } from "./clickEvent.ts";
import { customEdit } from "./initEdit.ts";

export type Events = ClickCellEvents & ClickCellTextEvents;
type ClickCellEvents = {
  [key in `click-${string}-${string}-cell`]: CellInfo; // 这里使用模板字面量类型
};
type ClickCellTextEvents = {
  [key in `click-${string}-${string}-text`]: {
    value: string;
    char: string;
    index: number;
  }; // 这里使用模板字面量类型
};

export default function initEvent(
  config: InitConfig,
  ctx: CanvasRenderingContext2D,
  emitter: Emitter<Events>,
) {
  ctx.canvas.addEventListener("click", (event) => {
    const { offsetX, offsetY } = event;
    const cellInfo = getCellInfoAtPosition(offsetX, offsetY, config);
    if (cellInfo) {
      const { rowIndex, colIndex } = cellInfo;
      emitter.emit(`click-${rowIndex}-${colIndex}-cell`, cellInfo);
      cellTextClick(config, ctx, cellInfo, event, emitter);
    }
  });
  ctx.canvas.addEventListener("dblclick", (event) => {
    customEdit(event, config, ctx);
  });
}
