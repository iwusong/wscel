import GC from "@grapecity-software/spread-sheets";
import "@grapecity-software/spread-sheets-io/dist/gc.spread.sheets.io.min.js";


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

export async function FileToJson(path:string){
    let workbook = new GC.Spread.Sheets.Workbook();
    let response = await fetch( path);
    let blob = await response.blob();
    let file = new File([blob], "ex.xlsx");
    let workbook1 = await load(file, workbook);
    console.log(workbook1.toJSON())
// @ts-ignore
    return Object.values(workbook1.toJSON().sheets)
}