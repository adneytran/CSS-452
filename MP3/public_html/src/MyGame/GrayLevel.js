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

  var nextLevel = new MyGame();  // load the next level
  gEngine.Core.startScene( nextLevel );
};

GrayLevel.prototype.initialize = function ()
{
  var jsonString = gEngine.ResourceMap.retrieveAsset(this.kSceneFile);
  var sceneInfo = JSON.parse(jsonString);
  for (var i in sceneInfo.Square)
  {
    console.log(sceneInfo.Square[i].Pos);
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
  console.log(this.mCamera);
  console.log(this.mSqSet);

};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
GrayLevel.prototype.draw = function ()
{
  // Step A: clear the canvas
  gEngine.Core.clearCanvas( [0.9, 0.9, 0.9, 1.0] ); // clear to light gray
  // Step  B: Activate the drawing Camera
  this.mCamera.setupViewProjection();

  // Step  C: draw all the squares
  var i;
  for ( i = 0; i < this.mSqSet.length; i++ )
  {
    this.mSqSet[i].draw( this.mCamera.getVPMatrix() );
  }
};

// The update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
GrayLevel.prototype.update = function ()
{
  // // For this very simple game, let's move the first square
  // var xform = this.mSqSet[1].getXform();
  // var deltaX = 0.05;
  //
  // /// Move right and swap over
  // if ( gEngine.Input.isKeyPressed( gEngine.Input.keys.Right ) )
  // {
  //   xform.incXPosBy( deltaX );
  //   if ( xform.getXPos() > 30 )
  //   { // this is the right-bound of the window
  //     xform.setPosition( 12, 60 );
  //   }
  // }
  //
  // // Step A: test for white square movement
  // if ( gEngine.Input.isKeyPressed( gEngine.Input.keys.Left ) )
  // {
  //   xform.incXPosBy( -deltaX );
  //   if ( xform.getXPos() < 11 )
  //   { // this is the left-boundary
  //     gEngine.GameLoop.stop();
  //   }
  // }
};