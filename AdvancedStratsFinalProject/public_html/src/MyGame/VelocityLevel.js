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

    this.lastPos = [];
    this.testRenderable = null;
    this.dragState = draggableStates.NEUTRAL;
    this.velocity = 0;
    this.direction = [0, 0];
    this.mMsg = null;
    this.secondMsg = null;
    this.timer = 0;
    this.doubleClick = false;
}

gEngine.Core.inheritPrototype(VelocityLevel, Scene);

VelocityLevel.prototype.unloadScene = function (type) {
    var nextLevel = null;
    if (type === "MyGame")
    {
        nextLevel = new MyGame();  // load the next level
    }
    else if (type === "DoubleClick")
    {
        nextLevel = new DoubleClick();
    }
    gEngine.Core.startScene(nextLevel);
};

VelocityLevel.prototype.initialize = function () {

    this.mCamera = new Camera(
        vec2.fromValues(10, 10), // position of the camera
        20,                       // width of camera
        [100, 100, 800, 800]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);


    this.testRenderable = new Renderable();
    this.testRenderable.getXform().setSize(1.9, 1.9);
    this.testRenderable.setColor([1, 0, 0, 1]);

    this.testRenderable.getXform().setPosition(10, 10);
    
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(10 - this.mCamera.getWCWidth() / 2 + .3, 10 - this.mCamera.getWCHeight() / 2 + .5);
    this.mMsg.setTextHeight(.5);
    
    this.secondMsg = new FontRenderable("Status Message");
    this.secondMsg.setColor([0, 0, 0, 1]);
    this.secondMsg.getXform().setPosition(10 - this.mCamera.getWCWidth() / 2 + 7, 10 - this.mCamera.getWCHeight() / 2 + .5);
    this.secondMsg.setTextHeight(.5);
};

VelocityLevel.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.testRenderable.draw(this.mCamera);
    this.mMsg.draw(this.mCamera);
    if (this.timer > 0)
    {
        this.secondMsg.draw(this.mCamera);
    }
};

VelocityLevel.prototype.update = function () {
    this.mCamera.update();  // to ensure proper interpolated movement effects
    this.configureDraggableState();
    if (this.dragState === draggableStates.CLICK) {
        this.selectRenderable();
    }
    if (this.dragState === draggableStates.DRAG) {
        this.dragRenderable();
    }
    if (this.dragState === draggableStates.RELEASE) {
        this.releaseRenderable();
    }
    if (this.dragState === draggableStates.NEUTRAL) {
        this.neutralRenderable();
    }
    this.updateMessage();
    this.checkSecondMessage();
    if (this.timer > 0)
    {
        this.timer--;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.unloadScene("MyGame");
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C)) {
        this.unloadScene("DoubleClick");
    }
};


VelocityLevel.prototype.selectRenderable = function () {
    this.testRenderable.getXform().setPosition(this.mCamera.mouseWCX(), this.mCamera.mouseWCY());
    this.lastPos = [this.mCamera.mouseWCX(), this.mCamera.mouseWCY()];
    this.velocity = 0;
    this.direction = [];
};

VelocityLevel.prototype.dragRenderable = function () {
    this.testRenderable.getXform().setPosition(this.mCamera.mouseWCX(), this.mCamera.mouseWCY());
};

VelocityLevel.prototype.releaseRenderable = function () {
    this.velocity = this.getVelocity([this.mCamera.mouseWCX(), this.mCamera.mouseWCY()]);
    console.log(this.velocity);
    this.direction = this.getDirection([this.mCamera.mouseWCX(), this.mCamera.mouseWCY()]);
};

VelocityLevel.prototype.neutralRenderable = function () {
    this.testRenderable.getXform().incXPosBy((-this.direction[0] * this.velocity) / 30);
    this.testRenderable.getXform().incYPosBy((-this.direction[1] * this.velocity) / 30);
};

VelocityLevel.prototype.configureDraggableState = function () {
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

VelocityLevel.prototype.getVelocity = function (newPos) {
    return Math.abs(Math.sqrt(
        Math.pow(newPos[0] - this.lastPos[0], 2) +
        Math.pow(newPos[1] - this.lastPos[1], 2)));
};

VelocityLevel.prototype.getDirection = function (newPos) {
    return [(newPos[0] - this.lastPos[0]) / this.velocity,
        (newPos[1] - this.lastPos[1]) / this.velocity];
};

VelocityLevel.prototype.updateMessage = function () {
    var msg = "Drag State: " + this.dragState;
    this.mMsg.setText(msg);
};

VelocityLevel.prototype.checkSecondMessage = function () {
    var msg = "";
    if (this.dragState === draggableStates.CLICK)
    {
        msg = "Mouse Clicked";
        this.timer = 60;
        this.secondMsg.setText(msg);
    }
    else if (this.dragState === draggableStates.RELEASE)
    {
        msg = "Mouse Released";
        this.timer = 60;
        this.secondMsg.setText(msg);
    }
};