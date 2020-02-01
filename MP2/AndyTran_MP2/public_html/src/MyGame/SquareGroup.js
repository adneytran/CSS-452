"use strict";

function SquareGroup(initialPos, shader, shinyShader)
{
    this.numberOfSquares = Random.getRandomInt(10, 21);
    this.centerPosition = initialPos;
    this.squareArray = [];
    this.timeAlive = 0.0;
    this.mConstColorShader = shader;
    this.mShinyShader = shinyShader;
    this.generateRandomSquares();
}

SquareGroup.totalSquares = 0;
SquareGroup.shinyChance = 0;
SquareGroup.shinySquares = [];

SquareGroup.prototype.generateRandomSquares = function () {
    var i;
    for (i = 0; i < this.numberOfSquares; i++) {
        this.updateShinyChance();
        this.squareArray.push(this.renderSquare(this.mConstColorShader));
    }
};

SquareGroup.prototype.renderSquare = function () {
    var randomDisplacementX = Random.getRandomInt(-5, 6) * Math.random() + this.centerPosition[0];
    var randomDisplacementY = Random.getRandomInt(-5, 6) * Math.random() + this.centerPosition[1];
    var randomRotation = 180 * Math.random();
    var randomScaleX = 1 + (5 * Math.random());
    var randomScaleY = 1 + (5 * Math.random());
    var newSquare = null;
    var shinyRoll = 100 * Math.random();

    if (shinyRoll < SquareGroup.shinyChance) {
        newSquare = new Renderable(this.mShinyShader);
        SquareGroup.shinySquares.push(newSquare);
        this.resetShinyChance();
    } else {
        newSquare = new Renderable(this.mConstColorShader);
        newSquare.setColor([Math.random(), Math.random(), Math.random(), 1]);
    }
    newSquare.getXform().setPosition(randomDisplacementX, randomDisplacementY);
    newSquare.getXform().setSize(randomScaleX, randomScaleY);
    newSquare.getXform().setRotationInDegree(randomRotation);
    return newSquare;
};


SquareGroup.prototype.getSquares = function () {
    return this.squareArray;
};

SquareGroup.prototype.getShinySquares = function () {
    return this.shinySquares;
};

SquareGroup.prototype.drawSquares = function (VPMatrix) {
    var i;
    for (i = 0; i < this.squareArray.length; i++) {
        this.squareArray[i].draw(VPMatrix);
    }
};

SquareGroup.prototype.getNumberOfSquares = function () {
    return this.numberOfSquares;
};

SquareGroup.prototype.updateShinyChance = function () {
    SquareGroup.totalSquares += this.numberOfSquares;
    SquareGroup.shinyChance = SquareGroup.totalSquares / 200;
};

SquareGroup.prototype.resetShinyChance = function () {
    SquareGroup.totalSquares = 0;
    SquareGroup.shinyChance = 0;
};