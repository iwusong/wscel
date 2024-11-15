import wscel from "../lib";
import json from "./z.json";
import { InitConfig } from "../lib/types";
import { disableEdit } from "../lib/utils.ts";

let app = document.querySelector("#app");
let config: InitConfig = json.sheets.Sheet1;
config.editorialControl = {
  editTable: {},
  editAllowed: true,
};
disableEdit(config, 1, 1, 33, 4);
// config.customEdit = {
//   editTable: {
//     31: {
//       0: {
//         customMethods: {
//           handle: e,
//           open: true,
//           handleStr: e.toString(),
//         },
//         openEdit: true,
//       },
//     },
//   },
//   open: true,
// };
// console.log(json1);

// function e(
//   config: InitConfig,
//   ctx: CanvasRenderingContext2D,
//   cellInfo: CellInfo,
// ) {
//   const { rowIndex, colIndex, x, y, width, height } = cellInfo;
//   let cellValue = getCellValue(rowIndex, colIndex, config);
//   console.log(cellValue);
//   let canvas = ctx.canvas;
//   // 创建输入框
//   const div = document.createElement("div");
//   div.style.display = "flex";
//   div.style.justifyContent = "center";
//   div.style.alignItems = "center";
//   div.textContent = cellValue;
//   div.style.position = "absolute";
//   div.style.background = "#ededed";
//   div.style.left = `${canvas.offsetLeft + x}px`;
//   div.style.top = `${canvas.offsetTop + y}px`;
//   div.style.width = `${width}px`;
//   div.style.height = `${height}px`;
//   div.style.border = "none";
//   div.style.padding = "0";
//   div.style.margin = "0";
//   div.style.font = ctx.font;
//
//   document.body.appendChild(div);
// }
if (app) {
  let wscel1 = new wscel(app, config);
  wscel1.emitter.on("click-31-0-text", (a) => {
    if (a.char === "口") {
      wscel1.setCellValue(31, 0, replaceCharAt(a, "☑"));
    }
    if (a.char === "☑") {
      wscel1.setCellValue(31, 0, replaceCharAt(a, "口"));
    }
  });
}

function replaceCharAt(
  a: {
    char: string;
    index: number;
    value: string;
  },
  replacement: string,
) {
  let str = a.value;
  let index = a.index - 1;
  if (index < 0 || index >= str.length) {
    throw new Error("Index out of bounds");
  }
  return str.slice(0, index) + replacement + str.slice(index + 1);
}
