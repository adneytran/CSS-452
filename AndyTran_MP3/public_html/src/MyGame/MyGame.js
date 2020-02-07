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


MyGame.prototype.unloadScene = function () {
    var nextLevel = new BlueLevel();  // next level to be loaded
    gEngine.Core.startScene(nextLevel);
};

MyGame.prototype.initialize = function () {
    var firstLevel = new GrayLevel();
    gEngine.Core.startScene(firstLevel);
};

MyGame.prototype.update = function () {
    inputSwitchScene();
}

MyGame.prototype.inputSwitchScene = function () {
    if (gEngine.c)
}
