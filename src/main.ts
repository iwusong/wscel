import wscel from "../lib";
import { InitConfig } from "../lib/types";
import { disableEdit } from "../lib/utils.ts"; // @ts-ignore
import GC from "@grapecity-software/spread-sheets"; // @ts-ignore
import "@grapecity-software/spread-sheets-io/dist/gc.spread.sheets.io.min.js";

let workbook = new GC.Spread.Sheets.Workbook( );

let response = await fetch("/ex.xlsx");
let blob = await response.blob();
let file = new File([blob], "ex.xlsx");

let workbook1 = await load(file, workbook);
// @ts-ignore
let sheet1 =  workbook1.toJSON().sheets.Sheet1;

function load(file: File, workbook: GC.Spread.Sheets.Workbook) {
  return new Promise<GC.Spread.Sheets.Workbook>((resolve, reject) => {
    workbook.import(
      file,
      function () {
        resolve(workbook); // 成功回调函数
      },
      function (e: any) {
        reject(e);
      },
      {
        fileType: GC.Spread.Sheets.FileType.excel,
      },
    );
  });
}

let app = document.querySelector("#app");
let config: InitConfig = sheet1;
config.editorialControl = {
  editTable: {},
  editAllowed: true,
};
disableEdit(config, 1, 1, 33, 4);

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

  wscel1.emitter.on("click-0-0-cell",()=>{
    console.log(wscel1.getConfig())
  })
  wscel1.emitter.on("click-1-0-cell",()=>{
    console.log(wscel1.getConfig())
  })
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
