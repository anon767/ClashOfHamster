function toRadian(angle) {
    return angle * (Math.PI / 180);
}

function rotateClockwise(coords, angleInDegree) {
    var radian = toRadian(angleInDegree);
    return {
        x: coords.x * Math.cos(radian) - coords.y * Math.sin(radian),
        y: coords.x * Math.sin(radian) + coords.y * Math.cos(radian)
    }
}

function intersectRect(rect1, rect2) {
    // http://www.gamedev.net/page/resources/_/technical/game-programming/2d-rotated-rectangle-collision-r2604
    axes = [
        {
            x: rect1.x2 - rect1.x1,
            y: rect1.y2 - rect1.y1
        },
        {
            x: rect1.x2 - rect1.x3,
            y: rect1.y2 - rect1.y3
        },
        {
            x: rect2.x1 - rect2.x4,
            y: rect2.y1 - rect2.y4
        },
        {
            x: rect2.x1 - rect2.x2,
            y: rect2.y1 - rect2.y2
        }
    ];
    var projection = function(axis) {
        return {
            r11: projectPointToAxis({ x: rect1.x1, y: rect1.y1 }, axis),
            r12: projectPointToAxis({ x: rect1.x2, y: rect1.y2 }, axis),
            r13: projectPointToAxis({ x: rect1.x3, y: rect1.y3 }, axis),
            r14: projectPointToAxis({ x: rect1.x4, y: rect1.y4 }, axis),
            r21: projectPointToAxis({ x: rect2.x1, y: rect2.y1 }, axis),
            r22: projectPointToAxis({ x: rect2.x2, y: rect2.y2 }, axis),
            r23: projectPointToAxis({ x: rect2.x3, y: rect2.y3 }, axis),
            r24: projectPointToAxis({ x: rect2.x4, y: rect2.y4 }, axis)
        }
    };
    var projected = axes.map(projection);
    var pointPositionOnAxis = function(axisProjection) {
        return {
        r11: (axisProjection.r11.a.x * axisProjection.r11.x) + (axisProjection.r11.a.y * axisProjection.r11.y),
        r12: (axisProjection.r12.a.x * axisProjection.r12.x) + (axisProjection.r12.a.y * axisProjection.r12.y),
        r13: (axisProjection.r13.a.x * axisProjection.r13.x) + (axisProjection.r13.a.y * axisProjection.r13.y),
        r14: (axisProjection.r14.a.x * axisProjection.r14.x) + (axisProjection.r14.a.y * axisProjection.r14.y),
        r21: (axisProjection.r21.a.x * axisProjection.r21.x) + (axisProjection.r21.a.y * axisProjection.r21.y),
        r22: (axisProjection.r22.a.x * axisProjection.r22.x) + (axisProjection.r22.a.y * axisProjection.r22.y),
        r23: (axisProjection.r23.a.x * axisProjection.r23.x) + (axisProjection.r23.a.y * axisProjection.r23.y),
        r24: (axisProjection.r24.a.x * axisProjection.r24.x) + (axisProjection.r24.a.y * axisProjection.r24.y)
        }
    };
    var positions = projected.map(pointPositionOnAxis);
    var overlapsOnAxis = function(pointPositions) {
        return (Math.min(pointPositions.r11, pointPositions.r12, pointPositions.r13, pointPositions.r14)
            <= Math.max(pointPositions.r21, pointPositions.r22, pointPositions.r23, pointPositions.r24))
        && (Math.max(pointPositions.r11, pointPositions.r12, pointPositions.r13, pointPositions.r14)
            >= Math.min(pointPositions.r21, pointPositions.r22, pointPositions.r23, pointPositions.r24));
    };
    // todo optimise, do axis after axis. first non colliding axis determines overall result
    return positions.map(overlapsOnAxis);
}

function projectPointToAxis(point, axis) {
    var factor = ((point.x * axis.x) + (point.y * axis.y)) / (Math.pow(axis.x, 2) + Math.pow(axis.y, 2));
    return {
        x: axis.x * factor,
        y: axis.y * factor,
        a: axis
    }
}

function id(value) {
    return value;
}
