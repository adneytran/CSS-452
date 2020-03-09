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
    this.selectedRenderable = null;
    this.renderableStorage = new Array(10);
    this.lastPos = [];
    for (var i = 0; i < this.renderableStorage.length; i++) {
        this.renderableStorage[i] = new Array(10);
    }
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
        this.verticalLines.push(new LineRenderable(i, 0, i, 20));
    }
    for (var i = 0; i <= 20; i += 2)
    {
        this.horizontalLines.push(new LineRenderable(0, i, 20, i));
    }
    
    this.testRenderable = new Renderable();
    this.testRenderable.getXform().setSize(1.9, 1.9);
    this.testRenderable.setColor([1, 0, 0, 1]);
    var newCell = this.convertCellCoordinateToWC(5, 5);
    this.testRenderable.getXform().setPosition(newCell[0], newCell[1]);
    this.lastPos = [5, 5];

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
        var cellPosition = this.getCellWCPositionFromMousePosition();
        if (cellPosition) {
            var cellCoordinate = this.convertWCtoCellCoordinate(cellPosition[0], cellPosition[1]);
            if (this.renderableStorage[cellCoordinate[0]][cellCoordinate[1]])
            {
                this.selectedRenderable = this.renderableStorage[cellCoordinate[0]][cellCoordinate[1]];
            }
            else
            {
                this.renderableStorage[this.lastPos[0]][this.lastPos[1]] = null;
                this.renderableStorage[cellCoordinate[0]][cellCoordinate[1]] = this.testRenderable;
                this.testRenderable.getXform().setPosition(cellPosition[0], cellPosition[1]);
                this.lastPos = this.convertWCtoCellCoordinate(cellPosition[0], cellPosition[1]);
            }
        }
    }

    if (gEngine.Input.isButtonReleased(gEngine.Input.mouseButton.Left)) {
        console.log("awawawawawa");
    }

};

MyGame.prototype.convertCellCoordinateToWC = function (cellX, cellY) {
    return [cellX * 2 + 1, cellY * 2 + 1];
};

MyGame.prototype.convertWCtoCellCoordinate = function (wcX, wcY) {
    return [Math.floor(wcX / 2), Math.floor(wcY / 2)];
};

MyGame.prototype.getCellWCPositionFromMousePosition = function () {
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
    if (x > 20 || y > 20 || x < 0 || y < 0) {
        return null;
    }
    return [x, y];
};
