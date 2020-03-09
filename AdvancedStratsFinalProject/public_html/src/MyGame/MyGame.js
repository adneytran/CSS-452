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
    this.kGridSprite = "assets/Grid.png";

    // The camera to view the scene
    this.mCamera = null;
    this.grid = null;
    this.verticalLines = [];
    this.horizontalLines = [];
    this.newCoordinates = [];
    this.testRenderable = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kGridSprite);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kGridSprite);
};

MyGame.prototype.initialize = function () {
    
    this.mCamera = new Camera(
        vec2.fromValues(10, 10), // position of the camera
        20,                       // width of camera
        [100, 100, 800, 800]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    
    
    
    for (var i = 0; i <=20; i += 2)
    {
        var lineRenderable = new LineRenderable(i, 0, i, 20);
        this.verticalLines.push(lineRenderable);
    }
    for (var i = 0; i <= 20; i += 2)
    {
        var lineRenderable = new LineRenderable(0, i, 20, i);
        this.horizontalLines.push(lineRenderable);
    }
    
    this.testRenderable = new Renderable();
    this.testRenderable.getXform().setSize(1.9, 1.9);
    this.testRenderable.setColor([1, 0, 0, 1]);
    var newCell = this.getCell(5, 5);
    this.testRenderable.getXform().setPosition(newCell[0], newCell[1]);

};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    
    for (var i = 0; i < this.verticalLines.length; i++)
    {
        this.verticalLines[i].draw(this.mCamera);
    }
    for (var i = 0; i < this.horizontalLines.length; i++)
    {
        this.horizontalLines[i].draw(this.mCamera);
    }
    this.testRenderable.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.mCamera.update();  // to ensure proper interpolated movement effects
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left))
    {
        var x = this.mCamera.mouseWCX();
        var y = this.mCamera.mouseWCY();
        x = Math.floor(x);
        y = Math.floor(y);
        if (x % 2 === 0)
        {
            x++;
        }
        if (y % 2 === 0)
        {
            y++;
        }
        this.testRenderable.getXform().setPosition(x, y);
    }
};

MyGame.prototype.getCell = function (cellX, cellY) {
    return [cellX * 2 + 1, cellY * 2 + 1];
};
