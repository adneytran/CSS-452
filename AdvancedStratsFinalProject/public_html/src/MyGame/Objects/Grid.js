"use strict";

function Grid() {
    this.verticalLines = [];
    this.horizontalLines = [];
    for (var i = 0; i <=20; i += 2)
    {
        this.verticalLines.push(new LineRenderable(i, 0, i, 20));
    }
    for (var i = 0; i <= 20; i += 2)
    {
        this.horizontalLines.push(new LineRenderable(0, i, 20, i));
    }
}

Grid.prototype.draw = function(aCamera) {
    for (var i = 0; i < this.verticalLines.length; i++)
    {
        this.verticalLines[i].draw(aCamera);
    }
    for (var i = 0; i < this.horizontalLines.length; i++)
    {
        this.horizontalLines[i].draw(aCamera);
    }
};

Grid.prototype.convertCellCoordinateToWC = function (cellX, cellY) {
    return [cellX * 2 + 1, cellY * 2 + 1];
};

Grid.prototype.convertWCtoCellCoordinate = function (wcX, wcY) {
    return [Math.floor(wcX / 2), Math.floor(wcY / 2)];
};

Grid.prototype.getCellWCPositionFromMousePosition = function () {
    var x = myCamera.mouseWCX();
    var y = myCamera.mouseWCY();
    x = Math.floor(x);
    y = Math.floor(y);
    if (x % 2 === 0) {
        x++;
    }
    if (y % 2 === 0) {
        y++;
    }
    if (x > 20 || y > 20 || x < 0 || y < 0) {
        return null;
    }
    return [x, y];
};