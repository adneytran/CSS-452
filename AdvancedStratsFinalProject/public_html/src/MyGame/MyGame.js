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
//document.addEventListener('contextmenu', event => event.preventDefault());

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
    this.messageTimer = 0;
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
    MouseGestures.Flick.setKeybind(gEngine.Input.mouseButton.Right);
    this.mGrid = new Grid(myCamera);
    this.testRenderable = new Renderable();
    this.testRenderable.getXform().setSize(1.9, 1.9);
    this.testRenderable.setColor([1, 0, 0, 1]);
    this.testRenderable2 = new Renderable();
    this.testRenderable2.getXform().setSize(1.9, 1.9);
    this.testRenderable2.setColor([0, 1, 0, 1]);
    this.renderableStorage[5][5] = this.testRenderable;
    this.renderableStorage[3][7] = this.testRenderable2;

    var newCell = this.mGrid.convertCellCoordinateToWC(5, 5);
    var newCell2 = this.mGrid.convertCellCoordinateToWC(3, 7);
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
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    myCamera.setupViewProjection();
    this.mGrid.draw(myCamera);
    this.testRenderable.draw(myCamera);
    this.testRenderable2.draw(myCamera);
    this.mMsg.draw(myCamera);
    if (this.messageTimer > 0)
    {
        this.secondMsg.draw(myCamera);
    }
};

MyGame.prototype.update = function () {
    myCamera.update();  // to ensure proper interpolated movement effects

    MouseGestures.Drag.checkForDrag(
        this.selectRenderable.bind(this),
        this.dragRenderable.bind(this),
        this.releaseRenderable.bind(this)
    );

    MouseGestures.Flick.checkForFlick();
    if (MouseGestures.Flick.hasBeenFlicked()) {
        var direction = MouseGestures.Flick.getFlickDirection();
        var speed = -MouseGestures.Flick.getFlickSpeed();
        var theCameraLocation = myCamera.getWCCenter();
        var theNewCameraLocation = [theCameraLocation[0] + direction[0] * speed / 50, theCameraLocation[1] + direction[1] * speed / 50];
        myCamera.setWCCenter(theNewCameraLocation[0], theNewCameraLocation[1]);
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.V))
    {
        this.unloadScene("Velocity");
    }
    this.updateMessage();
    this.checkSecondMessage();

    if (this.messageTimer > 0)
    {
        this.messageTimer--;
    }
};

MyGame.prototype.selectRenderable = function () {
    var cellPosition = this.mGrid.getCellWCPositionFromMousePosition();
    if (cellPosition) {
        var cellCoordinate = this.mGrid.convertWCtoCellCoordinate(cellPosition[0], cellPosition[1]);
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
        var cellWCPosition = this.mGrid.getCellWCPositionFromMousePosition();
        var cellPosition = this.mGrid.convertWCtoCellCoordinate(cellWCPosition[0], cellWCPosition[1]);
        var otherRenderable = this.renderableStorage[cellPosition[0]][cellPosition[1]];

        var lastCellPosition = this.mGrid.convertWCtoCellCoordinate(MouseGestures.Drag.getStartingDragPosition()[0],
            MouseGestures.Drag.getStartingDragPosition()[1]);
        var lastCellPositionToWC = this.mGrid.convertCellCoordinateToWC(lastCellPosition[0], lastCellPosition[1]);


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
    var msg = "Drag State: " + MouseGestures.Drag.getDragState();
    this.mMsg.setText(msg);
};

MyGame.prototype.checkSecondMessage = function () {
    var msg = "";
    if (MouseGestures.Drag.getDragState() === MouseGestures.Drag.getDraggableStates().CLICK)
    {
        msg = "Mouse Clicked";
        this.timer = 60;
        this.secondMsg.setText(msg);
    }
    else if (MouseGestures.Drag.getDragState() === MouseGestures.Drag.getDraggableStates().RELEASE)
    {
        msg = "Mouse Released";
        this.timer = 60;
        this.secondMsg.setText(msg);
    }
};
