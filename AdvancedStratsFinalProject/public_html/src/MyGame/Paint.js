/*
 * File: Paint.js
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function Paint() {

    this.mCamera = null;
    this.renderableArray = [];
    this.boundArray = [];
}

gEngine.Core.inheritPrototype(Paint, Scene);


Paint.prototype.initialize = function () {
    this.mCamera = new Camera(
        vec2.fromValues(10, 10), // position of the camera
        20,                       // width of camera
        [100, 100, 800, 800]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    MouseGestures.setCamera(this.mCamera);
};

Paint.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setupViewProjection();
    for (var i = 0; i < this.renderableArray.length; i++) {
        this.renderableArray[i].draw(this.mCamera);
    }
    for (i = 0; i < this.boundArray.length; i++) {
        this.boundArray[i].draw(this.mCamera);
    }
};


Paint.prototype.update = function () {
    MouseGestures.Drag.checkForDrag(null, this.drawBounds.bind(this), this.drawSquare.bind(this))
    console.log(this.renderableArray.length)
};

Paint.prototype.drawBounds = function () {
    var startPos = MouseGestures.Drag.getStartingDragPosition();
    var endPos = [myCamera.mouseWCX(), myCamera.mouseWCY()];
    var x1 = startPos[0];
    var y1 = startPos[1];
    var x2 = endPos[0];
    var y2 = endPos[1];

    this.boundArray = [
        new LineRenderable(x1, y1, x2, y1),
        new LineRenderable(x2, y2, x1, y2),
        new LineRenderable(x2, y1, x2, y2),
        new LineRenderable(x1, y1, x1, y2)]
};

Paint.prototype.drawSquare = function () {
    this.boundArray = [];
    var startPos = MouseGestures.Drag.getStartingDragPosition();
    var endPos = [myCamera.mouseWCX(), myCamera.mouseWCY()];
    var x1 = startPos[0];
    var y1 = startPos[1];
    var x2 = endPos[0];
    var y2 = endPos[1];
    var center = [(x2 + x1) / 2, (y2 + y1) / 2];
    var width = Math.abs(x2 - x1);
    var height = Math.abs(y2 - y1);
    var ren = new Renderable();
    ren.getXform().setPosition(center[0], center[1]);
    ren.getXform().setSize(width, height);
    ren.setColor([Math.random(), Math.random(), Math.random(), 1]);
    this.renderableArray.push(ren);
};