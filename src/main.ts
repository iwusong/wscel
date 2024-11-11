import wscel from "../lib";
import * as xlsx from 'xlsx'
import json from  './z.json'
let app = document.querySelector('#app');
let wscel1 = new wscel(app,json.sheets.Sheet1);

async function load() {
    const url = "/ex.xlsx";
    const file = await (await fetch(url)).arrayBuffer();
    const workbook = xlsx.read(file);
    let sheet = workbook.Sheets[workbook.SheetNames[0]]
    // console.log(sheet)


    // console.log(xlsx.utils.sheet_to_json(workbook))
}

load()
