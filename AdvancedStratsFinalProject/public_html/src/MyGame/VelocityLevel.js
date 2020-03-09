/*
 * File: VelocityLevel.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!



function VelocityLevel() {

    this.mCamera = null;
    this.mGrid = null;

    this.renderableStorage = new Array(10);
    for (var i = 0; i < this.renderableStorage.length; i++) {
        this.renderableStorage[i] = new Array(10);
    }

    this.lastPos = [];
    this.selectedRenderable = null;
    this.testRenderable = null;
    this.testRenderable2 = null;
    this.dragState = draggableStates.NEUTRAL;
    this.velocity = 0;
    this.direction = [];
}

gEngine.Core.inheritPrototype(VelocityLevel, Scene);

VelocityLevel.prototype.unloadScene = function () {
    var nextLevel = new VelocityLevel();  // load the next level
    gEngine.Core.startScene(nextLevel);
};

VelocityLevel.prototype.initialize = function () {

    this.mCamera = new Camera(
        vec2.fromValues(10, 10), // position of the camera
        20,                       // width of camera
        [100, 100, 800, 800]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray
    this.mGrid = new Grid();


    this.testRenderable = new Renderable();
    this.testRenderable.getXform().setSize(1.9, 1.9);
    this.testRenderable.setColor([1, 0, 0, 1]);
    //this.testRenderable2 = new Renderable();
    //this.testRenderable2.getXform().setSize(1.9, 1.9);
    //this.testRenderable2.setColor([0, 1, 0, 1]);
    var newCell = this.convertCellCoordinateToWC(5, 5);
    //var newCell2 = this.convertCellCoordinateToWC(3, 7);

    this.renderableStorage[5][5] = this.testRenderable;
    //this.renderableStorage[3][7] = this.testRenderable2;

    this.testRenderable.getXform().setPosition(newCell[0], newCell[1]);
    //this.testRenderable2.getXform().setPosition(newCell2[0], newCell2[1]);
    //this.lastPos = [5, 5];

};

VelocityLevel.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mGrid.draw(this.mCamera);
    this.testRenderable.draw(this.mCamera);
    //this.testRenderable2.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
VelocityLevel.prototype.update = function () {
    this.mCamera.update();  // to ensure proper interpolated movement effects
    this.configureDraggableState();
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
        this.selectRenderable();
    }
    if (this.dragState === draggableStates.DRAG) {
        this.dragRenderable();
    }

    if (this.dragState === draggableStates.RELEASE) {
        this.releaseRenderable();
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q))
    {
        this.unloadScene();
    }
};

VelocityLevel.prototype.convertCellCoordinateToWC = function (cellX, cellY) {
    return [cellX * 2 + 1, cellY * 2 + 1];
};

VelocityLevel.prototype.convertWCtoCellCoordinate = function (wcX, wcY) {
    return [Math.floor(wcX / 2), Math.floor(wcY / 2)];
};

VelocityLevel.prototype.getCellWCPositionFromMousePosition = function () {
    var x = this.mCamera.mouseWCX();
    var y = this.mCamera.mouseWCY();
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

// MyGame.prototype.swapRenderable = function() {
//     this.renderableStorage[cellPosition[0]][cellPosition[1]].getXform().setPosition(this.lastPos[0], this.lastPos[1]);
//     this.renderableStorage[cellPosition[0]][cellPosition[1]] = this.selectedRenderable;
//     this.renderableStorage[this.lastPos[0]][this.lastPos[1]] =
// };


VelocityLevel.prototype.selectRenderable = function () {
    var cellPosition = this.getCellWCPositionFromMousePosition();
    if (cellPosition) {
        var cellCoordinate = this.convertWCtoCellCoordinate(cellPosition[0], cellPosition[1]);
        if (this.renderableStorage[cellCoordinate[0]][cellCoordinate[1]]) {
            this.selectedRenderable = this.renderableStorage[cellCoordinate[0]][cellCoordinate[1]];
            this.lastPos = [cellCoordinate[0], cellCoordinate[1]];
        }
    }
};

VelocityLevel.prototype.dragRenderable = function () {
    if (this.selectedRenderable) {
        this.selectedRenderable.getXform().setPosition(this.mCamera.mouseWCX(), this.mCamera.mouseWCY());
    }
};

VelocityLevel.prototype.releaseRenderable = function () {
    if (this.selectedRenderable) {
        var cellWCPosition = this.getCellWCPositionFromMousePosition();
        var cellPosition = this.convertWCtoCellCoordinate(cellWCPosition[0], cellWCPosition[1]);
        /*var otherRenderable = this.renderableStorage[cellPosition[0]][cellPosition[1]];

        if (otherRenderable) {
            var lastWCPosition = this.convertCellCoordinateToWC(this.lastPos[0], this.lastPos[1]);
            this.renderableStorage[cellPosition[0]][cellPosition[1]] = this.selectedRenderable;
            this.renderableStorage[this.lastPos[0]][this.lastPos[1]] = otherRenderable;
            otherRenderable.getXform().setPosition(lastWCPosition[0], lastWCPosition[1]);
            this.selectedRenderable.getXform().setPosition(cellWCPosition[0], cellWCPosition[1]);

        } else {
            this.renderableStorage[cellPosition[0]][cellPosition[1]] = this.selectedRenderable;
            this.renderableStorage[this.lastPos[0]][this.lastPos[1]] = null;
            this.selectedRenderable.getXform().setPosition(cellWCPosition[0], cellWCPosition[1]);
            this.selectedRenderable = null;
            this.lastPos = null;
        }*/
        this.velocity = this.getVelocity(cellWCPosition);
        this.direction = this.getDirection(cellWCPosition);
        this.selectedRenderable.getXform().incXPosBy(-this.direction[0] * this.velocity);
        this.selectedRenderable.getXform().incYPosBy(-this.direction[1] * this.velocity);
        console.log(this.selectedRenderable.getXform().getPosition());
    }
};

VelocityLevel.prototype.configureDraggableState = function () {
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && this.dragState === draggableStates.NEUTRAL) {
        this.dragState = draggableStates.DRAG;
        //aDragFunction();
    } else if (gEngine.Input.isButtonReleased(gEngine.Input.mouseButton.Left) && this.dragState === draggableStates.DRAG) {
        this.dragState = draggableStates.RELEASE;
        //aReleaseFunction();
    } else if (this.dragState === draggableStates.RELEASE) {
        this.dragState = draggableStates.NEUTRAL;
    }
};

VelocityLevel.prototype.getVelocity = function (newPos) {
    return Math.abs(Math.sqrt(Math.pow(newPos[0] - this.lastPos[0], 2)
            + Math.pow(newPos[1] - this.lastPos[1], 2)));
};

VelocityLevel.prototype.getDirection = function (newPos) {
    return [(newPos[0] - this.lastPos[0]) / this.velocity, 
        (newPos[1] - this.lastPos[1]) / this.velocity];
};