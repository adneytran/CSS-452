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