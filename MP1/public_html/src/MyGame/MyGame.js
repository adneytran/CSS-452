/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID) {
    // The shader for drawing
    this.mShader = null;

    // Step A: Initialize the webGL Context and the VertexBuffer
    gEngine.Core.initializeWebGL(htmlCanvasID);

    // Step B: Create, load and compile the shaders
    this.mShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",        // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");       // Path to the FragmentShader

    // Step C: Draw!
    // Step C1: Clear the canvas
    gEngine.Core.clearCanvas([0, 0.8, 0, 1]);

    this.drawSquare([0, 0, 1, 1], [-.25, -.25], [.1, .1]);
    this.drawCircle([1, 1, 0, 1], [0, 0], [.1, .1]);
    this.drawTriangle([.2, .3, .6, 1],[.25, .25],[.1, .1]);
}

MyGame.prototype.drawSquare = function (color, offset, scale) {
    this.mShader.setShaderPrimitive(gEngine.VertexBuffer.getSquareVertices())
    this.mShader.activateShader(color, offset, scale);
    var gl = gEngine.Core.getGL();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

MyGame.prototype.drawTriangle= function (color, offset, scale) {
    this.mShader.setShaderPrimitive(gEngine.VertexBuffer.getTriangleVertices())
    this.mShader.activateShader(color, offset, scale);
    var gl = gEngine.Core.getGL();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
};

MyGame.prototype.drawCircle = function (color, offset, scale) {
    this.mShader.setShaderPrimitive(gEngine.VertexBuffer.getCircleVertices())
    this.mShader.activateShader(color, offset, scale);
    var gl = gEngine.Core.getGL();
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 60);
};