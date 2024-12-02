import { initGrid } from "./grid.ts";
import { Config, InitConfig } from "./types.ts";
import initEvent, { Events } from "./event/initEvent.ts";
import mitt, { Emitter } from "./mitt.ts";
import { setCellValue, setEditArea } from "./utils.ts";

export default class Wscel {
  public emitter: Emitter<Events> = mitt<Events>();
  private readonly ctx: CanvasRenderingContext2D;
  private config: InitConfig;

  constructor(div: Element, config: Config) {
    this.config = Wscel.fillDefaultRowsColumnsAndEdit(config);
    const canvas = document.createElement("canvas");
    canvas.width = Wscel.calculateCanvasWidth(this.config) + 3;
    canvas.height = Wscel.calculateCanvasHeight(this.config) + 3;
    canvas.id = "wscel";
    this.ctx = canvas.getContext("2d")!;
    const element = document.getElementById("wscel");
    if (element) {
      document.body.removeChild(element);
    }
    div.appendChild(canvas);
    this.init();
  }

  static calculateCanvasWidth(config: InitConfig): number {
    return config.columns.reduce(
      (totalWidth, col) => totalWidth + col!.size,
      0,
    );
  }

  static calculateCanvasHeight(config: InitConfig): number {
    return config.rows.reduce((totalHeight, row) => totalHeight + row!.size, 0);
  }

  private static fillDefaultRowsColumnsAndEdit(config: Config) {
    while (config.rows.length < config.rowCount) {
      config.rows.push({ size: config.defaults.rowHeight });
    }
    while (config.columns.length < config.columnCount) {
      config.columns.push({ size: config.defaults.colWidth });
    }
    for (let i = 0; i < config.rows.length; i++) {
      if (config.rows[i] === null || config.rows[i] === undefined) {
        config.rows[i] = { size: config.defaults.rowHeight };
      }
    }
    for (let i = 0; i < config.columns.length; i++) {
      if (config.columns[i] === null || config.columns[i] === undefined) {
        config.columns[i] = { size: config.defaults.colWidth };
      }
    }
    if (!config.editorialControl) {
      config.editorialControl = {
        editAllowed: false,
        editTable: {},
      };
    }
    return <InitConfig>config;
  }

  public redrawTable() {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    initGrid(this.config, this.ctx);
  }

  public getConfig() {
    return this.config;
  }

  public setCellValue(rowIndex: number, colIndex: number, value: string) {
    setCellValue(rowIndex, colIndex, value, this.config);
  }

  private init() {
    // 设置画布背景颜色
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    initGrid(this.config, this.ctx);
    initEvent(this.config, this.ctx, this.emitter);
  }

  public openEditArea(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
  ) {
    setEditArea(this.config, startRow, startCol, endRow, endCol, true);
  }

  public disableEditArea(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
  ) {
    setEditArea(this.config, startRow, startCol, endRow, endCol, false);
  }

  public disableEdit() {
    this.config.editorialControl.editAllowed = false;
  }

  public openEdit() {
    this.config.editorialControl.editAllowed = true;
  }

  // public openEditAll() {
  //   this.config.editorialControl.editAllowed = false;
  //   this.config.editorialControl.all = true;
  //   this.config.editorialControl.editTable = {}; //todo 填入所有数据
  //   setEditArea(
  //       this.config,
  //       0,
  //       0,
  //       this.config.rowCount,
  //       this.config.columnCount,
  //       true,
  //   );
  // }
  // public disableEditAll() {
  //   this.config.editorialControl.editAllowed = false;
  //   this.config.editorialControl.all = true;
  //   this.config.editorialControl.editTable = {};
  //   setEditArea(
  //     this.config,
  //     0,
  //     0,
  //     this.config.rowCount,
  //     this.config.columnCount,
  //     false,
  //   );
  // }
}
