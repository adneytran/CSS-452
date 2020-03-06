/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!



function MyGame() {
    this.hero = new Hero();
    this.dyePack = new DyePack();
    this.patrol = new Patrol();
    this.mMsg = null;

}

MyGame.dyePackSet = new GameObjectSet();

gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.mMainCamera = new Camera(
        vec2.fromValues(30, 30), // position of the camera
        200,                       // width of camera
        [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
    );

MyGame.prototype.initialize = function () {
    MyGame.mMainCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    this.hero.initialize();
    this.dyePack.initialize();
    this.patrol.initialize();
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(-19, -8);
    this.mMsg.setTextHeight(3);
};

MyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    MyGame.mMainCamera.setupViewProjection();
    this.hero.draw();
    this.patrol.draw();
    MyGame.dyePackSet.draw();
};

MyGame.prototype.update = function () {
    this.hero.update();
    this.patrol.update();
    MyGame.dyePackSet.update();
    checkIfDyePacksAreDestroyed();
};

function checkIfDyePacksAreDestroyed() {
    for (var i = 0; i < MyGame.dyePackSet.size(); i++) {
        if (MyGame.dyePackSet.mSet[i].shouldBeDestroyed) {
            MyGame.dyePackSet.mSet.splice(i, 1);
        }
    }
}

