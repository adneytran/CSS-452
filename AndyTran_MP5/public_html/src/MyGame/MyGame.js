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
    // The camera to view the scene
    

    this.mMsg = null;

    this.mLineSet = [];
    this.mCurrentLine = null;
    this.mP1 = null;
}
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

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    MyGame.mMainCamera.setupViewProjection();
    //var i, l;
    //for (i = 0; i < this.mLineSet.length; i++) {
    //    l = this.mLineSet[i];
    //    l.draw(this.mCamera);
    //}
    this.hero.draw();
    this.patrol.draw();
    //this.dyePack.draw();
    //this.mMsg.draw(this.mCamera);   // only draw status in the main camera
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.hero.update();
    this.patrol.update();
    /*var msg = "Lines: " + this.mLineSet.length + " ";
    var echo = "";
    var x, y;

    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Middle)) {
        var len = this.mLineSet.length;
        if (len > 0) {
            this.mCurrentLine = this.mLineSet[len - 1];
            x = this.mMainCamera.mouseWCX();
            y = this.mMainCamera.mouseWCY();
            echo += "Selected " + len + " ";
            echo += "[" + x.toPrecision(2) + " " + y.toPrecision(2) + "]";
            this.mCurrentLine.setFirstVertex(x, y);
        }
    }

    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
        x = this.mMainCamera.mouseWCX();
        y = this.mMainCamera.mouseWCY();
        echo += "[" + x.toPrecision(2) + " " + y.toPrecision(2) + "]";

        if (this.mCurrentLine === null) { // start a new one
            this.mCurrentLine = new LineRenderable();
            this.mCurrentLine.setFirstVertex(x, y);
            this.mLineSet.push(this.mCurrentLine);
        } else {
            this.mCurrentLine.setSecondVertex(x, y);
        }
    } else {
        this.mCurrentLine = null;
        this.mP1 = null;
    }

    msg += echo;
    this.mMsg.setText(msg);*/
};