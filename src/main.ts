import wscel from "../lib";
import * as xlsx from 'xlsx'
import json from  './z.json'
let app = document.querySelector('#app');
let wscel1 = new wscel(app,json.sheets.Sheet1);
