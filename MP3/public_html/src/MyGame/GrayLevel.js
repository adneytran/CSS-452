/*
 * File: BlueLevel.js
 * This is the logic of our game.
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, MyGame: false, SceneFileParser: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GrayLevel()
{
  // scene file name
  this.kSceneFile = "assets/scene.json";
  // all squares
  this.mSqSet = [];        // these are the Renderable objects

  // The camera to view the scene
  this.mCamera = null;
}

gEngine.Core.inheritPrototype( GrayLevel, Scene );

GrayLevel.prototype.loadScene = function ()
{
  // load the scene file
  gEngine.TextFileLoader.loadTextFile( this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eTextFile );
};

GrayLevel.prototype.unloadScene = function ()
{
  // unload the scene flie and loaded resources
  gEngine.TextFileLoader.unloadTextFile( this.kSceneFile );

  var nextLevel = new BlueLevel();  // load the next level
  gEngine.Core.startScene( nextLevel );
};

GrayLevel.prototype.initialize = function ()
{
  var jsonString = gEngine.ResourceMap.retrieveAsset(this.kSceneFile);
  var sceneInfo = JSON.parse(jsonString);
  for (var i in sceneInfo.Square)
  {
    var square = new Renderable(gEngine.DefaultResources.getConstColorShader());
    square.setColor(sceneInfo.Square[i].Color);
    square.getXform().setPosition(sceneInfo.Square[i].Pos[0], sceneInfo.Square[i].Pos[1]);
    square.getXform().setRotationInDegree(sceneInfo.Square[i].Rotation);
    square.getXform().setSize(sceneInfo.Square[i].Width, sceneInfo.Square[i].Height);

    this.mSqSet.push(square);
  }
  var cameraInfo = sceneInfo.Camera;

  // Step A: Read in the camera
  this.mCamera = new Camera(cameraInfo.Center, cameraInfo.Width, cameraInfo.Viewport);
  this.mCamera.setBackgroundColor(cameraInfo.BgColor);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
GrayLevel.prototype.draw = function ()
{
  // Step A: clear the canvas
  gEngine.Core.clearCanvas( [0.9, 0.9, 0.9, 1.0] ); // clear to light gray
  // Step  B: Activate the drawing Camera
  if (this.mCamera) {
  this.mCamera.setupViewProjection();
  }
  // Step  C: draw all the squares
  var i;
  for ( i = 0; i < this.mSqSet.length; i++ )
  {
    this.mSqSet[i].draw( this.mCamera.getVPMatrix() );
  }
  MyGame.gCamera.setupViewProjection();
  for ( i = 0; i < this.mSqSet.length; i++ )
  {
    this.mSqSet[i].draw( MyGame.gCamera.getVPMatrix() );
  }
};

// The update function, updates the application state. Make sure to _NOT_ draw
function switchScene() {
  if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
    this.unloadScene()
  }
}

function rotateRedSquare() {
  var redSquare = this.mSqSet[1];
  var rotateSpeed = 72/60;
  redSquare.getXform().incRotationByDegree(rotateSpeed);
}

function moveWhiteSquare() {
  var whiteSquareTransform = this.mSqSet[0].getXform();
  var moveSpeed = -1/9;
  whiteSquareTransform.incXPosBy(moveSpeed);

  if (whiteSquareTransform.getXPos() < 10) {
    whiteSquareTransform.setXPos(30)
  }
}

// anything from this function!
GrayLevel.prototype.update = function ()
{
  switchScene.call(this);
  rotateRedSquare.call(this);
  moveWhiteSquare.call(this);
  MyGame.inputCameraControl();
  this.inputWorldCoordinateControl();
  this.inputWorldCoordinateZoom();
};

GrayLevel.prototype.inputWorldCoordinateControl = function () {
  var currentWC = this.mCamera.getWCCenter();
  const cameraSpeed = 0.3;
  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.F)) {
    currentWC[1] += cameraSpeed;
    this.mCamera.setWCCenter(currentWC[0], currentWC[1]);
  }
  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.C)) {
    currentWC[0] -= cameraSpeed;
    this.mCamera.setWCCenter(currentWC[0], currentWC[1]);
  }
  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.V)) {
    currentWC[1] -= cameraSpeed;
    this.mCamera.setWCCenter(currentWC[0], currentWC[1]);
  }
  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.B)) {
    currentWC[0] += cameraSpeed;
    this.mCamera.setWCCenter(currentWC[0], currentWC[1]);
  }
};

GrayLevel.prototype.inputWorldCoordinateZoom = function () {
  var currentWCWidth = this.mCamera.getWCWidth();
  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
    currentWCWidth += 1;
    this.mCamera.setWCWidth(currentWCWidth);
  }
  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
    currentWCWidth -= 1;
    this.mCamera.setWCWidth(currentWCWidth);
  }
};