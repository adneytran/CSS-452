/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, BlueLevel: false, Camera: false, Renderable: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
}

gEngine.Core.inheritPrototype(MyGame, Scene);
MyGame.gCamera = new Camera(
    vec2.fromValues(20, 60),  // position of the camera
    20,                        // width of camera
    [300, 300, 100, 100]                  // viewport (orgX, orgY, width, height)
);
MyGame.gCamera.setBackgroundColor([0.2, 0.3, 0.6, 1]);

MyGame.prototype.unloadScene = function () {
    var nextLevel = new BlueLevel();  // next level to be loaded
    gEngine.Core.startScene(nextLevel);
};

MyGame.prototype.initialize = function () {
    var firstLevel = new BlueLevel();
    gEngine.Core.startScene(firstLevel);
};

MyGame.inputCameraControl = function () {
    var currentVP = MyGame.gCamera.getViewport();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        currentVP[1] += 10;
        MyGame.gCamera.setViewport(currentVP);
    }
    if (gEngine.Input.isKeyReleased(gEngine.Input.keys.A)) {
        currentVP[0] -= 10;
        MyGame.gCamera.setViewport(currentVP);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        currentVP[1] -= 10;
        MyGame.gCamera.setViewport(currentVP);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        currentVP[0] += 10;
        MyGame.gCamera.setViewport(currentVP);
    }
}