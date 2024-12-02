import wscel from "../lib";
// @ts-ignore
import swal from "sweetalert";

import { FileToJson } from "./FileToJson.ts";

let sheets: any = await FileToJson("/x3.xlsx");
let sheet1: any = sheets[1];

let app = document.querySelector("#app");
if (app) {
  // @ts-ignore
  let wscel1 = new wscel(app, sheet1);
  wscel1.openEdit();
  wscel1.openEditArea(0, 0, 0, 0);
  wscel1.disableEdit();
  wscel1.emitter.on("click-text", (a) => {
    console.log(a);
    if (a.char === "□") {
      wscel1.setCellValue(a.cellInfo.rowIndex, a.cellInfo.colIndex, replaceCharAt(a, "☑"));
      wscel1.redrawTable()
    }
    if (a.char === "☑") {
      wscel1.setCellValue(a.cellInfo.rowIndex, a.cellInfo.colIndex,  replaceCharAt(a, "□"));
      wscel1.redrawTable()
    }
  });
  //
  // wscel1.emitter.on("*", (...arg) => {
  //   console.log(arg);
  //   swal(JSON.stringify(arg), {
  //     buttons: [false],
  //     timer: 3000,
  //   });
  // });
  // wscel1.emitter.on("click-1-0-cell", () => {
  //     console.log(wscel1.getConfig());
  // });
}

/**
 * 单行使用
 * @param a
 * @param replacement
 */
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
