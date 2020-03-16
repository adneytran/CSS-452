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
    this.testRenderable = null;
}

gEngine.Core.inheritPrototype(VelocityLevel, Scene);

VelocityLevel.prototype.unloadScene = function (type) {
    var nextLevel = null;
    if (type === "MyGame")
    {
        nextLevel = new MyGame();  // load the next level
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
    MouseGestures.setCamera(this.mCamera);

    this.testRenderable = new Renderable();
    this.testRenderable.getXform().setSize(1.9, 1.9);
    this.testRenderable.setColor([1, 0, 0, 1]);
    this.testRenderable.getXform().setPosition(10, 10);
};

VelocityLevel.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.testRenderable.draw(this.mCamera);
};

VelocityLevel.prototype.update = function () {
    this.mCamera.update();  // to ensure proper interpolated movement effects
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.unloadScene("MyGame");
    }
    MouseGestures.Flick.checkForFlick();
    if (MouseGestures.Flick.hasBeenFlicked()) {
        var direction = MouseGestures.Flick.getFlickDirection();
        var speed = MouseGestures.Flick.getFlickSpeed() / 100;
        this.testRenderable.getXform().incXPosBy(direction[0] * speed);
        this.testRenderable.getXform().incYPosBy(direction[1] * speed);
    }

};