import { Point } from "../Types/Point";
import { TruthTable } from "../Types/TruthTable";

let fontSize = 40;

export function draw(
    ctx: CanvasRenderingContext2D,
    table: TruthTable,
    width: number,
    height: number,
    theme: string,
    lineWidth = 1,
    radius = 165,
    size = 40
) {
    fontSize = size;
    const variables = table.variables;
    const body = table.body;
    const circles = getCircles(variables, width, height, radius);
    circles.forEach((circle) => {
        drawCircle(ctx, lineWidth, circle.center, radius, theme);
        drawText(ctx, circle.name, circle.namePosition, theme);
    });

    for (let i = 0; i < width; i += 2) {
        for (let j = 0; j < height; j += 2) {
            const curPoint: Point = { x: i, y: j };
            body.forEach((row) => {
                const expressionIsTrue = row[row.length - 1];
                if (expressionIsTrue) {
                    let subResult = true;
                    for (let k = 0; k < row.length - 1; k++) {
                        const circle = circles[k];
                        subResult =
                            subResult &&
                            ((getDistance(circle.center, curPoint) < radius) === Boolean(row[k]));
                    }
                    if (subResult) {
                        ctx.lineWidth = lineWidth;
                        ctx.fillStyle = theme === "light" ? "#00c049" : "#d4a9f1";
                        ctx.fillRect(i, j, 1, 1);
                    }
                }
            });
        }
    }
    ctx.stroke();
}

function drawCircle(
    ctx: CanvasRenderingContext2D,
    lineWidth: number,
    center: Point,
    radius: number,
    theme: string
) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = theme === "light" ? "black" : "white";
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
}

function drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    position: Point,
    theme: string
) {
    const oldColor = ctx.fillStyle;
    const oldFont = ctx.font;
    ctx.fillStyle = theme === "light" ? "black" : "white";
    ctx.font = `${fontSize}px serif`;
    ctx.fillText(text, position.x, position.y);
    ctx.fillStyle = oldColor;
    ctx.font = oldFont;
}

function getDistance(point1: Point, point2: Point) {
    const dx = Math.abs(point1.x - point2.x);
    const dy = Math.abs(point1.y - point2.y);
    return Math.sqrt(dx * dx + dy * dy);
}

function getCircles(
    variables: string[],
    width: number,
    height: number,
    circleRadius: number
) {
    const result = [];
    const centres = getCentres(variables.length, width, height, circleRadius);
    for (let i = 0; i < centres.length; i++) {
        const namePosition = getNamePosition(
            centres[i],
            circleRadius,
            width,
            height
        );
        result.push({
            name: variables[i],
            center: centres[i],
            namePosition: namePosition,
        });
    }
    return result;
}
function getNamePosition(
    circleCenter: Point,
    radius: number,
    canvasWidth: number,
    canvasHeight: number
) {
    const center: Point = { x: canvasWidth / 2, y: canvasHeight / 2 };
    const positionOffset = 1.15 * radius;
    const nonCetrePositionOffset = 0.7 * positionOffset;
    const fontOffset = fontSize / 2;
    if (circleCenter.x === center.x) {
        return { x: circleCenter.x, y: circleCenter.y + positionOffset } as Point;
    } else if (circleCenter.x < center.x) {
        return circleCenter.y === center.y
            ? ({ x: circleCenter.x - positionOffset, y: circleCenter.y } as Point)
            : circleCenter.y < center.y
                ? ({
                    x: circleCenter.x - nonCetrePositionOffset,
                    y: circleCenter.y - nonCetrePositionOffset,
                } as Point)
                : ({
                    x: circleCenter.x - nonCetrePositionOffset,
                    y: circleCenter.y + nonCetrePositionOffset + fontOffset,
                } as Point);
    } else {
        return circleCenter.y === center.y
            ? ({
                x: circleCenter.x + positionOffset - fontOffset,
                y: circleCenter.y,
            } as Point)
            : circleCenter.y < center.y
                ? ({
                    x: circleCenter.x + nonCetrePositionOffset - fontOffset,
                    y: circleCenter.y - nonCetrePositionOffset,
                } as Point)
                : ({
                    x: circleCenter.x + nonCetrePositionOffset - fontOffset,
                    y: circleCenter.y + nonCetrePositionOffset + fontOffset,
                } as Point);
    }
}

function getCentres(
    pointsCount: number,
    width: number,
    height: number,
    circleRadius: number
) {
    const result: Point[] = [];
    const center: Point = { x: width / 2, y: height / 2 };
    if (pointsCount === 1) {
        result.push({ x: center.x, y: center.y });
    } else if (pointsCount === 2) {
        result.push(
            ...[
                { x: center.x - circleRadius / 2, y: center.y },
                { x: center.x + circleRadius / 2, y: center.y },
            ]
        );
    } else if (pointsCount === 3) {
        result.push(
            ...[
                { x: center.x - circleRadius / 2, y: center.y - circleRadius / 2 },
                { x: center.x + circleRadius / 2, y: center.y - circleRadius / 2 },
                { x: center.x, y: center.y + circleRadius / 2 },
            ]
        );
    } else if (pointsCount === 4) {
        result.push(
            ...[
                { x: center.x - circleRadius / 2, y: center.y - circleRadius / 2 },
                { x: center.x + circleRadius / 2, y: center.y - circleRadius / 2 },
                { x: center.x - circleRadius / 2, y: center.y + circleRadius / 2 },
                { x: center.x + circleRadius / 2, y: center.y + circleRadius / 2 },
            ]
        );
    }
    return result;
}
