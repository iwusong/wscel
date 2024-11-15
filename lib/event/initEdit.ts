import { InitConfig } from "../types";
import {
  defaultEditing,
  getCellInfoAtPosition,

} from "../utils.ts";

export function customEdit(
  event: MouseEvent,
  config: InitConfig,
  ctx: CanvasRenderingContext2D,
) {
  const { offsetX, offsetY } = event;
  const cellInfo = getCellInfoAtPosition(offsetX, offsetY, config);

  if (cellInfo) {
    const { rowIndex, colIndex } = cellInfo;
    if (config.editorialControl?.editAllowed) {
      if (
        config.editorialControl.editTable[rowIndex] &&
        config.editorialControl.editTable[rowIndex][colIndex]
      ) {
        let editTableRow =
          config.editorialControl.editTable[rowIndex][colIndex];
        if (!editTableRow.openEdit) {
          return;
        }
        if (
          editTableRow.customMethods.handle &&
          editTableRow.customMethods.open
        ) {
          editTableRow.customMethods.handle(config, ctx, cellInfo);
          return;
        } else {
          defaultEditing(config, ctx, cellInfo);
        }
      } else {
        // 默认编辑
        defaultEditing(config, ctx, cellInfo);
      }
    }
  }
}

export default function initEdit(
  config: InitConfig,
  ctx: CanvasRenderingContext2D,
) {
  ctx.canvas.addEventListener("dblclick", (event) => {
    customEdit(event, config, ctx);
  });
}
