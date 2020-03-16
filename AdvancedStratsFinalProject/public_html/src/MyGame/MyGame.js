/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.mGrid = null;

    this.renderableStorage = new Array(10);
    for (var i = 0; i < this.renderableStorage.length; i++) {
        this.renderableStorage[i] = new Array(10);
    }
    this.mMsg = null;
    this.secondMsg = null;
    this.selectedRenderable = null;
    this.testRenderable = null;
    this.testRenderable2 = null;
    this.velocity = 0;
    this.timer = 0;
    this.doubleClick = false;
    this.doubleClickTimer = 0;
}

var myCamera = new Camera(
    vec2.fromValues(10, 10), // position of the camera
    20,                       // width of camera
    [100, 100, 800, 800]           // viewport (orgX, orgY, width, height)
);

gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.unloadScene = function (type) {
    var nextLevel = null;
    if (type === "Velocity")
    {
        nextLevel = new VelocityLevel();  // load the next level
    }
    gEngine.Core.startScene(nextLevel);
};

myCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

MyGame.prototype.initialize = function () {
    MouseGestures.setCamera(myCamera);
    this.mGrid = new Grid();
    this.testRenderable = new Renderable();
    this.testRenderable.getXform().setSize(1.9, 1.9);
    this.testRenderable.setColor([1, 0, 0, 1]);
    this.testRenderable2 = new Renderable();
    this.testRenderable2.getXform().setSize(1.9, 1.9);
    this.testRenderable2.setColor([0, 1, 0, 1]);
    this.renderableStorage[5][5] = this.testRenderable;
    this.renderableStorage[3][7] = this.testRenderable2;

    var newCell = this.convertCellCoordinateToWC(5, 5);
    var newCell2 = this.convertCellCoordinateToWC(3, 7);
    this.testRenderable.getXform().setPosition(newCell[0], newCell[1]);
    this.testRenderable2.getXform().setPosition(newCell2[0], newCell2[1]);

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(10 - myCamera.getWCWidth() / 2 + .3, 10 - myCamera.getWCHeight() / 2 + .5);
    this.mMsg.setTextHeight(.5);
    
    this.secondMsg = new FontRenderable("Status Message");
    this.secondMsg.setColor([0, 0, 0, 1]);
    this.secondMsg.getXform().setPosition(10 - myCamera.getWCWidth() / 2 + 7, 10 - myCamera.getWCHeight() / 2 + .5);
    this.secondMsg.setTextHeight(.5);
};

MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    myCamera.setupViewProjection();
    this.mGrid.draw(myCamera);
    this.testRenderable.draw(myCamera);
    this.testRenderable2.draw(myCamera);
    this.mMsg.draw(myCamera);
    if (this.timer > 0)
    {
        this.secondMsg.draw(myCamera);
    }
};

var blah = function() {
    console.log('blah');
}

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    myCamera.update();  // to ensure proper interpolated movement effects
    this.configureClickState();
    if (this.doubleClick === true)
    {
        if (this.selectedRenderable)
        {
            this.selectedRenderable.setColor([0, 0, 1, 1]);
        }
    }

    MouseGestures.configureDraggableState(this, blah);
    // if (this.myDragGestures.dragState === draggableStates.CLICK) {
    //     this.selectRenderable();
    // }
    if (MouseGestures.dragState === MouseGestures.getDragState().DRAG) {
        this.dragRenderable();
    }
    if (MouseGestures.dragState === MouseGestures.getDragState().RELEASE) {
        this.releaseRenderable();
    }


    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.V))
    {
        this.unloadScene("Velocity");
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C))
    {
        this.unloadScene("DoubleClick");
    }
    this.updateMessage();
    this.checkSecondMessage();
    if (this.timer > 0)
    {
        this.timer--;
    }
    if (this.doubleClickTimer > 0)
    {
        this.doubleClickTimer--;
    }
    else
    {
        this.doubleClick = false;
    }
};

MyGame.prototype.convertCellCoordinateToWC = function (cellX, cellY) {
    return [cellX * 2 + 1, cellY * 2 + 1];
};

MyGame.prototype.convertWCtoCellCoordinate = function (wcX, wcY) {
    return [Math.floor(wcX / 2), Math.floor(wcY / 2)];
};

MyGame.prototype.getCellWCPositionFromMousePosition = function () {
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

MyGame.prototype.selectRenderable = function () {
    var cellPosition = this.getCellWCPositionFromMousePosition();
    if (cellPosition) {
        var cellCoordinate = this.convertWCtoCellCoordinate(cellPosition[0], cellPosition[1]);
        if (this.renderableStorage[cellCoordinate[0]][cellCoordinate[1]]) {
            this.selectedRenderable = this.renderableStorage[cellCoordinate[0]][cellCoordinate[1]];
        }
    }
};

MyGame.prototype.dragRenderable = function () {
    if (this.selectedRenderable) {
        this.selectedRenderable.getXform().setPosition(myCamera.mouseWCX(), myCamera.mouseWCY());
    }
};

MyGame.prototype.releaseRenderable = function () {
    if (this.selectedRenderable) {
        var cellWCPosition = this.getCellWCPositionFromMousePosition();
        var cellPosition = this.convertWCtoCellCoordinate(cellWCPosition[0], cellWCPosition[1]);
        var otherRenderable = this.renderableStorage[cellPosition[0]][cellPosition[1]];

        var lastCellPosition = this.convertWCtoCellCoordinate(this.myDragGestures.lastPos[0], this.myDragGestures.lastPos[1]);
        var lastCellPositionToWC = this.convertCellCoordinateToWC(lastCellPosition[0], lastCellPosition[1]);


        if (otherRenderable) {
            this.renderableStorage[cellPosition[0]][cellPosition[1]] = this.selectedRenderable;
            this.renderableStorage[lastCellPosition[0]][lastCellPosition[1]] = otherRenderable;

            otherRenderable.getXform().setPosition(lastCellPositionToWC[0], lastCellPositionToWC[1]);
            this.selectedRenderable.getXform().setPosition(cellWCPosition[0], cellWCPosition[1]);

        } else {
            this.renderableStorage[cellPosition[0]][cellPosition[1]] = this.selectedRenderable;
            this.renderableStorage[lastCellPosition[0]][lastCellPosition[1]] = null;
            this.selectedRenderable.getXform().setPosition(cellWCPosition[0], cellWCPosition[1]);
            this.selectedRenderable = null;
        }
    }
};

MyGame.prototype.updateMessage = function () {
    var msg = "Drag State: " + MouseGestures.getDragState();
    this.mMsg.setText(msg);
};

MyGame.prototype.checkSecondMessage = function () {
    var msg = "";
    if (MouseGestures.getDragState() === MouseGestures.getDraggableStates().CLICK)
    {
        msg = "Mouse Clicked";
        this.timer = 60;
        this.secondMsg.setText(msg);
    }
    else if (MouseGestures.getDragState() === MouseGestures.getDraggableStates().RELEASE)
    {
        msg = "Mouse Released";
        this.timer = 60;
        this.secondMsg.setText(msg);
    }
};

MyGame.prototype.configureClickState = function () {
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && this.doubleClickTimer === 0) {
        this.doubleClickTimer = 20;
        //aDragFunction();
    }
    else if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && this.doubleClickTimer > 0)
    {
        this.doubleClick = true;
    }
};
