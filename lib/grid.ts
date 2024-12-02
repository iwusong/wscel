import {InitConfig, Span} from "./types.ts";
import {isString} from "./utils.ts";

export function initGrid(config: InitConfig, ctx: CanvasRenderingContext2D) {
    let currentY = 0;

    // 遍历每行
    for (let rowIndex = 0; rowIndex < config.rowCount; rowIndex++) {
        const rowHeight = config.rows[rowIndex]?.size ?? config.defaults.rowHeight;
        let currentX = 0;

        // 遍历每列
        for (let colIndex = 0; colIndex < config.columnCount; colIndex++) {
            const colWidth =
                config.columns[colIndex]?.size ?? config.defaults.colWidth;

            // 检查当前单元格是否在合并区域的起始位置
            const span = findSpan(rowIndex, colIndex, config.spans);
            if (span && span.row === rowIndex && span.col === colIndex) {
                // 计算合并单元格的宽度和高度
                const mergedWidth = calculateSpanWidth(span, config);
                const mergedHeight = calculateSpanHeight(span, config);

                // 绘制合并后的单元格
                drawCell(ctx, currentX, currentY, mergedWidth, mergedHeight);
                drawCellText(
                    currentX,
                    currentY,
                    mergedWidth,
                    mergedHeight,
                    rowIndex,
                    colIndex,
                    config,
                    ctx,
                );

                // 跳过合并区域内的列
                colIndex += span.colCount - 1;
                currentX += mergedWidth;
            } else if (!span) {
                // 绘制正常单元格
                drawCell(ctx, currentX, currentY, colWidth, rowHeight);
                drawCellText(
                    currentX,
                    currentY,
                    colWidth,
                    rowHeight,
                    rowIndex,
                    colIndex,
                    config,
                    ctx,
                );

                currentX += colWidth;
            } else {
                currentX += colWidth;
            }
        }

        currentY += rowHeight;
    }
}

export function findSpan(row: number, col: number, spans: Span[]): Span | null {
    return (
        spans.find(
            (span) =>
                row >= span.row &&
                row < span.row + span.rowCount &&
                col >= span.col &&
                col < span.col + span.colCount,
        ) || null
    );
}

export function calculateSpanWidth(span: Span, config: InitConfig): number {
    return Array.from(
        {length: span.colCount},
        (_, i) => config.columns[span.col + i]?.size ?? config.defaults.colWidth,
    ).reduce((acc, width) => acc + width, 0);
}

export function calculateSpanHeight(span: Span, config: InitConfig): number {
    return Array.from(
        {length: span.rowCount},
        (_, i) => config.rows[span.row + i]?.size ?? config.defaults.rowHeight,
    ).reduce((acc, height) => acc + height, 0);
}

function drawCell(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
) {
    ctx.strokeStyle = "#646464";
    ctx.strokeRect(x, y, width, height);
}

/**
 *
 * @param x  x坐标
 * @param y y坐标
 * @param width
 * @param height
 * @param rowIndex
 * @param colIndex
 * @param config
 * @param ctx
 */
function drawCellText(
    x: number,
    y: number,
    width: number,
    height: number,
    rowIndex: number,
    colIndex: number,
    config: InitConfig,
    ctx: CanvasRenderingContext2D,
) {
    // 获取当前单元格的文本
    const cell = config.data.dataTable[rowIndex]?.[colIndex];
    if (rowIndex === 28) console.log(cell)

    if (cell && cell.value) {
        // 设置字体样式
        ctx.font = "16px 'Times New Roman'"; // 默认字体，可以根据需要调整
        ctx.fillStyle = "#000000"; // 文本颜色
        let text: string
        if (typeof cell.value === "number") {
            text = cell.value.toString()
        } else {
            text = isString(cell.value) ? cell.value : cell.value.value.toString();
        }

        text = text.replace(/\r\n/g, '').replace(/\n/g, '')
        // 计算文本的绘制位置
        const textWidth = ctx.measureText(text).width;

        const textX = x + (width - textWidth) / 2; // 水平居中
        const textY = y + height / 2 + 5; // 垂直居中，适当调整
        if (textWidth > width) {
            drawWrappedText(text, x, y, width, 16, ctx)
        } else {
            ctx.fillText(text, textX, textY);
        }
        // 绘制文本
    }
}

function drawWrappedText(text: string, x: number, y: number, maxWidth: number, _lineHeight: number, ctx: CanvasRenderingContext2D) {
    let strings = Array.from(text);

    let length = strings.length;
    let s = '';
    let txth = 16;
    for (let i = 0; i < length; i++) {
        let shift = strings.shift()!;
        s = s + shift

        const width = ctx.measureText(s).width

        if (width > maxWidth) {
            strings.unshift(shift)
            let t = s.slice(0, s.length - 1);
            ctx.fillText(t, x, y + txth);
            s = ''
            txth = txth + 16
        }
    }
    ctx.fillText(s, x, y + txth);
}
