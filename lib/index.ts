import { initGrid } from "./grid.ts";
import { InitConfig } from "./types";
import initEvent, { Events } from "./event/initEvent.ts";
import mitt, { Emitter } from "./mitt.ts";
import { isString } from "./utils.ts";

export default class Wscel {
  private readonly ctx: CanvasRenderingContext2D;
  private config: InitConfig;
  public emitter: Emitter<Events> = mitt<Events>();

  constructor(div: Element, config: InitConfig) {
    this.config = config;
    Wscel.fillDefaultRowsAndColumns(config);

    const canvas = document.createElement("canvas");
    canvas.width = Wscel.calculateCanvasWidth(config) + 3;
    canvas.height = Wscel.calculateCanvasHeight(config) + 3;
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
      (totalWidth, col) =>
        totalWidth + (col ? col.size : config.defaults.colWidth),
      0,
    );
  }

  static calculateCanvasHeight(config: InitConfig): number {
    return config.rows.reduce(
      (totalHeight, row) =>
        totalHeight + (row ? row.size : config.defaults.rowHeight),
      0,
    );
  }

  private static fillDefaultRowsAndColumns(config: InitConfig) {
    while (config.rows.length < config.rowCount) {
      config.rows.push({ size: config.defaults.rowHeight });
    }
    while (config.columns.length < config.columnCount) {
      config.columns.push({ size: config.defaults.colWidth });
    }
  }

  private init() {
    // 设置画布背景颜色
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    initGrid(this.config, this.ctx);
    initEvent(this.config, this.ctx, this.emitter);
  }

  public redrawTable() {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    initGrid(this.config, this.ctx);
  }

  public setCellValue(rowIndex: number, colIndex: number, value: string) {
    const cell = this.config.data.dataTable[rowIndex]?.[colIndex];
    if (cell) {
      if (isString(cell.value)) {
        cell.value = value;
      } else if (cell.value) {
        cell.value.value = value;
      } else if (!cell.value) {
        cell.value = value;
      }
      this.redrawTable();
    }
  }
}
