import wscel from "../lib";
import json from "./z.json";

let app = document.querySelector("#app");
if (app) {
  new wscel(app, json.sheets.Sheet1);
}
