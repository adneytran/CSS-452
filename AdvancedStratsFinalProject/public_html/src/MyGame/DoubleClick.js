/*
 * File: DoubleClick.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!



function DoubleClick() {

    this.mCamera = null;

    this.lastPos = [];
    this.testRenderable = null;
    this.dragState = draggableStates.NEUTRAL;
    this.velocity = 0;
    this.direction = [0, 0];
    this.mMsg = null;
    this.secondMsg = null;
    this.timer = 0;
    this.doubleClick = false;
    this.testRenderable = null;
    this.testRenderable2 = null;
    this.renderableStorage = new Array(10);
    for (var i = 0; i < this.renderableStorage.length; i++) {
        this.renderableStorage[i] = new Array(10);
    }
}

gEngine.Core.inheritPrototype(DoubleClick, Scene);

DoubleClick.prototype.unloadScene = function (type) {
    var nextLevel = null;
    if (type === "MyGame")
    {
        nextLevel = new MyGame();  // load the next level
    }
    else if (type === "Velocity")
    {
        nextLevel = new VelocityLevel();
    }
    gEngine.Core.startScene(nextLevel);
};

DoubleClick.prototype.initialize = function () {

    this.mCamera = new Camera(
        vec2.fromValues(10, 10), // position of the camera
        20,                       // width of camera
        [100, 100, 800, 800]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);


    this.mGrid = new Grid();


    this.testRenderable = new Renderable();
    this.testRenderable.getXform().setSize(1.9, 1.9);
    this.testRenderable.setColor([1, 0, 0, 1]);
    this.testRenderable2 = new Renderable();
    this.testRenderable2.getXform().setSize(1.9, 1.9);
    this.testRenderable2.setColor([0, 1, 0, 1]);
    var newCell = this.convertCellCoordinateToWC(5, 5);
    var newCell2 = this.convertCellCoordinateToWC(3, 7);

    this.renderableStorage[5][5] = this.testRenderable;
    this.renderableStorage[3][7] = this.testRenderable2;

    this.testRenderable.getXform().setPosition(newCell[0], newCell[1]);
    this.testRenderable2.getXform().setPosition(newCell2[0], newCell2[1]);
    
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(10 - this.mCamera.getWCWidth() / 2 + .3, 10 - this.mCamera.getWCHeight() / 2 + .5);
    this.mMsg.setTextHeight(.5);
};

DoubleClick.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mGrid.draw(this.mCamera);
    this.testRenderable.draw(this.mCamera);
    this.testRenderable2.draw(this.mCamera);
    if (this.msgTimer > 0)
    {
        this.mMsg.draw(this.mCamera);
    }
};

DoubleClick.prototype.update = function () {
    this.mCamera.update();  // to ensure proper interpolated movement effects
    this.configureDraggableState();
    this.configureClickState();
    if (this.doubleClick === true)
    {
        if (this.selectedRenderable)
        {
            this.selectedRenderable.setColor([0, 0, 1, 1]);
        }
    }
    if (this.dragState === draggableStates.CLICK) {
        this.selectRenderable();
    }
    if (this.dragState === draggableStates.DRAG) {
        this.dragRenderable();
    }

    if (this.dragState === draggableStates.RELEASE) {
        this.releaseRenderable();
    }
    this.updateMessage();
    if (this.timer > 0)
    {
        this.timer--;
    }
    else
    {
        this.doubleClick = false;
    }
    if (this.msgTimer > 0)
    {
        this.msgTimer--;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.unloadScene("MyGame");
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.V)) {
        this.unloadScene("Velocity");
    }
};

DoubleClick.prototype.convertCellCoordinateToWC = function (cellX, cellY) {
    return [cellX * 2 + 1, cellY * 2 + 1];
};

DoubleClick.prototype.convertWCtoCellCoordinate = function (wcX, wcY) {
    return [Math.floor(wcX / 2), Math.floor(wcY / 2)];
};

DoubleClick.prototype.getCellWCPositionFromMousePosition = function () {
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

DoubleClick.prototype.selectRenderable = function () {
    var cellPosition = this.getCellWCPositionFromMousePosition();
    if (cellPosition) {
        var cellCoordinate = this.convertWCtoCellCoordinate(cellPosition[0], cellPosition[1]);
        if (this.renderableStorage[cellCoordinate[0]][cellCoordinate[1]]) {
            this.selectedRenderable = this.renderableStorage[cellCoordinate[0]][cellCoordinate[1]];
            this.lastPos = [cellCoordinate[0], cellCoordinate[1]];
        }
    }
};

DoubleClick.prototype.dragRenderable = function () {
    if (this.selectedRenderable) {
        this.selectedRenderable.getXform().setPosition(this.mCamera.mouseWCX(), this.mCamera.mouseWCY());
    }
};

DoubleClick.prototype.releaseRenderable = function () {
    if (this.selectedRenderable) {
        var cellWCPosition = this.getCellWCPositionFromMousePosition();
        var cellPosition = this.convertWCtoCellCoordinate(cellWCPosition[0], cellWCPosition[1]);
        var otherRenderable = this.renderableStorage[cellPosition[0]][cellPosition[1]];


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
        }
    }
};

DoubleClick.prototype.configureDraggableState = function () {
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && this.dragState === draggableStates.NEUTRAL) {
        this.dragState = draggableStates.CLICK;
        //aDragFunction();
    }
    else if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && this.dragState === draggableStates.CLICK)
    {
        this.dragState = draggableStates.DRAG;
    } else if (gEngine.Input.isButtonReleased(gEngine.Input.mouseButton.Left) && this.dragState === draggableStates.DRAG) {
        this.dragState = draggableStates.RELEASE;
        //aReleaseFunction();
    } else if (this.dragState === draggableStates.RELEASE) {
        this.dragState = draggableStates.NEUTRAL;
    }
};

DoubleClick.prototype.configureClickState = function () {
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && this.timer === 0) {
        this.timer = 30;
        //aDragFunction();
    }
    else if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && this.timer > 0)
    {
        this.doubleClick = true;
    }
};

DoubleClick.prototype.getVelocity = function (newPos) {
    return Math.abs(Math.sqrt(
        Math.pow(newPos[0] - this.lastPos[0], 2) +
        Math.pow(newPos[1] - this.lastPos[1], 2)));
};

DoubleClick.prototype.getDirection = function (newPos) {
    return [(newPos[0] - this.lastPos[0]) / this.velocity,
        (newPos[1] - this.lastPos[1]) / this.velocity];
};

DoubleClick.prototype.updateMessage = function () {
    var msg = "";
    if (this.doubleClick === true)
    {
        msg = "Mouse Double Clicked";
        this.msgTimer = 60;
        this.mMsg.setText(msg);
    }
};