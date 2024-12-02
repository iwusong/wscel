import { InitConfig } from "../types.ts";
import { defaultEditing, getCellInfoAtPosition } from "../utils.ts";

export function customEdit(
  event: MouseEvent,
  config: InitConfig,
  ctx: CanvasRenderingContext2D,
) {
  const { offsetX, offsetY } = event;
  const cellInfo = getCellInfoAtPosition(offsetX, offsetY, config);

  if (cellInfo) {
    const { rowIndex, colIndex } = cellInfo;
    if (config.editorialControl.editAllowed) {
      if (
        config.editorialControl.editTable[rowIndex] &&
        config.editorialControl.editTable[rowIndex][colIndex]
      ) {
        let editTableRow =
          config.editorialControl.editTable[rowIndex][colIndex];
        if (!editTableRow.open) {
          return;
        }
        defaultEditing(config, ctx, cellInfo);
      }
    }
  }
}
