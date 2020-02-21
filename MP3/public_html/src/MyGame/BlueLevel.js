/*
 * File: BlueLevel.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, MyGame: false, SceneFileParser: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function BlueLevel()
{
  // scene file name
  this.kSceneFile = "assets/BlueLevel.xml";
  // all squares
  this.mSqSet = [];        // these are the Renderable objects

  // The camera to view the scene
  this.mCamera = null;
}

gEngine.Core.inheritPrototype( BlueLevel, Scene );

BlueLevel.prototype.loadScene = function ()
{
  // load the scene file
  gEngine.TextFileLoader.loadTextFile( this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eXMLFile );
};

BlueLevel.prototype.unloadScene = function ()
{
  // unload the scene file and loaded resources
  gEngine.TextFileLoader.unloadTextFile( this.kSceneFile );

  var nextLevel = new GrayLevel();  // load the next level
  gEngine.Core.startScene( nextLevel );
};

BlueLevel.prototype.initialize = function ()
{
  var sceneParser = new SceneFileParser( this.kSceneFile );

  // Step A: Read in the camera
  this.mCamera = sceneParser.parseCamera();

  // Step B: Read all the squares
  sceneParser.parseSquares( this.mSqSet );

};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
BlueLevel.prototype.draw = function ()
{
  // Step A: clear the canvas
  gEngine.Core.clearCanvas( [0.9, 0.9, 0.9, 1.0] ); // clear to light gray

  // Step  B: Activate the drawing Camera
  if ( this.mCamera )
  {
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
// anything from this function!
BlueLevel.prototype.update = function ()
{
  switchScene.call(this);
  MyGame.inputCameraControl();
  this.inputWorldCoordinateControl();
  this.inputWorldCoordinateZoom();
};

function switchScene() {
  if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
    this.unloadScene()
  }
}

BlueLevel.prototype.inputWorldCoordinateControl = function () {
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

BlueLevel.prototype.inputWorldCoordinateZoom = function () {
  var currentWCWidth = this.mCamera.getWCWidth();
  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
    currentWCWidth += 1;
    this.mCamera.setWCWidth(currentWCWidth);
  }
  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
    currentWCWidth -= 1;
    this.mCamera  .setWCWidth(currentWCWidth);
  }
};