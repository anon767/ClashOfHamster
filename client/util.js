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
    var axisOf = function(point1, point2) {
        return { x: point1.x - point2.x, y: point1.y - point2.y }
    };
    var axes = [
        axisOf(rect1[1], rect1[0]),
        axisOf(rect1[1], rect1[2]),
        axisOf(rect2[0], rect2[3]),
        axisOf(rect2[0], rect2[1])
    ];
    var calculatePosition = function(axis, rect) {
        return rect.map(function(point) {
            var factor = ((point.x * axis.x) + (point.y * axis.y)) / (Math.pow(axis.x, 2) + Math.pow(axis.y, 2));
            return {
                x: axis.x * factor,
                y: axis.y * factor
            }
        }).map(function (projectedPoint) {
            return (axis.x * projectedPoint.x) + (axis.y * projectedPoint.y);
        });
    };
    var overlapsOnAxis = function(axis) {
        var rect1Pos = calculatePosition(axis, rect1);
        var rect2Pos = calculatePosition(axis, rect2);
        return (Math.min.apply(null, rect1Pos) <= Math.max.apply(null, rect2Pos)
            && Math.max.apply(null, rect1Pos) >= Math.min.apply(null, rect2Pos));
    };
    for (var i = 0; i < axes.length; i++) {
        if(!overlapsOnAxis(axes[i])){
            return false;
        }
    }
    return true;
}

function id(value) {
    return value;
}
