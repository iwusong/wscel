import { initGrid } from "./grid.ts";
import { InitConfig } from "./types";

export default class Wscel {
  private readonly ctx: CanvasRenderingContext2D;

  constructor(div: Element, config: InitConfig) {
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
    this.init(config);
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

  // @ts-ignore
  private loadDate() {}

  private init(config: InitConfig) {
    // 设置画布背景颜色
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    initGrid(config, this.ctx);
  }
}
