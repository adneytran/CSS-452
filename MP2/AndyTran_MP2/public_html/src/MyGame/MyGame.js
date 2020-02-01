/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, Camera: false, mat4: false, vec3: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID) {
    // variables of the constant color shader
    this.mConstColorShader = null;
    this.mShinyShader = null;
    this.mCursor = null;
    this.squareGroupArray = [];
    this.totalNumberOfSquares = 0;
    this.deleteMode = false;
    this.deleteTimer = 0.0;

    // The camera to view the scene
    this.mCamera = null;

    // Initialize the webGL Context
    gEngine.Core.initializeEngineCore(htmlCanvasID);

    // Initialize the game
    this.initialize();

}

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
            vec2.fromValues(0, 0), // position of the camera
            50, // width of camera
            [0, 0, 640, 480]         // viewport (orgX, orgY, width, height)
            );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray

    // Step  B: create the shader
    this.mConstColorShader = new SimpleShader(
            "src/GLSLShaders/Simple/SimpleVS.glsl", // Path to the VertexShader 
            "src/GLSLShaders/Simple/SimpleFS.glsl");    // Path to the Simple FragmentShader    

    this.mShinyShader = new RainbowShader(
            "src/GLSLShaders/Rainbow/RainbowVS.glsl", // Path to the VertexShader 
            "src/GLSLShaders/Rainbow/RainbowFS.glsl");    // Path to the Simple FragmentShader    

    // Step  C: Create the Renderable objects:
    this.mCursor = new Renderable(this.mConstColorShader);
    this.mCursor.setColor([1, 0, 0, 1]);

    // Step  E: Initialize the red Renderable object: centered 1x1
    this.mCursor.getXform().setPosition(0, 0);
    this.mCursor.getXform().setSize(1, 1);

    // Step F: Start the game loop running
    gEngine.GameLoop.start(this);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();
    for (var i = 0; i < this.squareGroupArray.length; i++) {
        this.squareGroupArray[i].drawSquares(this.mCamera.getVPMatrix());
    }
    this.mCursor.draw(this.mCamera.getVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.inputCursorPosition();
    this.inputSpawnSquares();
    this.inputDeleteMode();
    this.checkIfSquaresAlive();
    this.echoTextInfo();
};

MyGame.prototype.inputCursorPosition = function () {
    var cursorSpeed = 0.5;
    var redXform = this.mCursor.getXform();
    // Step  C: test for pulsing the red square
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        redXform.incYPosBy(-cursorSpeed);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        redXform.incYPosBy(cursorSpeed);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        redXform.incXPosBy(-cursorSpeed);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        redXform.incXPosBy(cursorSpeed);
    }
};

MyGame.prototype.inputSpawnSquares = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        var squares = new SquareGroup(this.mCursor.getXform().getPosition(), 
        this.mConstColorShader, this.mShinyShader);
        this.squareGroupArray.push(squares);
        this.totalNumberOfSquares += squares.numberOfSquares;
    }
};

MyGame.prototype.inputDeleteMode = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.D)) {
        if (this.deleteMode) {
            this.deleteMode = false;
            this.deleteTimer = 0.0;
        } else if (this.squareGroupArray.length !== 0) {
            this.deleteMode = true;
            this.deleteTimer = this.squareGroupArray[0].timeAlive;
        }
    }
};

MyGame.prototype.checkIfSquaresAlive = function () {
    if (!this.deleteMode) {
        for (var i = 0; i < this.squareGroupArray.length; i++) {
            this.squareGroupArray[i].timeAlive += gEngine.GameLoop.getMPF();
        }
    } else {
        this.deleteTimer -= gEngine.GameLoop.getMPF();
        for (var i = 0; i < this.squareGroupArray.length; i++) {
            if (this.squareGroupArray[i].timeAlive >= this.deleteTimer) {
                this.totalNumberOfSquares -= this.squareGroupArray[i].getNumberOfSquares();
                this.squareGroupArray.splice(i, 1);
            }
        }
        if (this.squareGroupArray.length === 0) {
            this.deleteMode = false;
        }
    }
};

MyGame.prototype.echoTextInfo = function () {
    document.getElementById('timeToUpdate').innerHTML = gEngine.GameLoop.getMPF();
    document.getElementById('FPS').innerHTML = gEngine.GameLoop.getFPS();
    document.getElementById('updateCounter').innerHTML = gEngine.GameLoop.getUpdateCounter();
    document.getElementById('lagTime').innerHTML = gEngine.GameLoop.getLagTime();
    document.getElementById('totalNumObjects').innerHTML = this.totalNumberOfSquares;
    document.getElementById('deleteMode').innerHTML = this.deleteMode;
    document.getElementById('shinyChance').innerHTML = SquareGroup.shinyChance;
};