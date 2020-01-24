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
    this.mColorShader = null;

    // Step A: Initialize the webGL Context and the VertexBuffer
    gEngine.Core.initializeWebGL(htmlCanvasID);

    // Step B: Create, load and compile the shaders
    this.mShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",        // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");       // Path to the FragmentShader

    this.mColorShader = new SimpleShader(
        "src/GLSLShaders/ColorfulVS.glsl",        // Path to the VertexShader
        "src/GLSLShaders/ColorfulFS.glsl");       // Path to the FragmentShader
    // Step C: Draw!
    // Step C1: Clear the canvas
    gEngine.Core.clearCanvas([0, 0.8, 0, 1]);

    var color1 = [0.1, 0.2, 0.3, 1];
    var color2 = [0.3, 0.5, 0.9, 1];
    var color3 = [0.6, 0.4, 1.0, 1];
    var color4 = [0.5, 0.5, 0.2, 1];
    var color5 = [0.8, 0.2, 0.6, 1];

    var scale1 = [0.1, 0.1];
    var scale2 = [0.4, 0.1];
    var scale3 = [0.3, 0.3];
    var scale4 = [0.3, 0.5];
    var scale5 = [0.5, 0.5];

    var squareRow = 0.7;
    var triangleRow = 0.0;
    var circleRow = -0.7;

    var col1 = -0.9;
    var col2 = -0.6;
    var col3 = -0.2;
    var col4 = 0.2;
    var col5 = 0.7;

    this.drawSquare(color1, [col1, squareRow], scale1);
    this.drawSquare(color2, [col2, squareRow], scale2);
    this.drawSquare(color3, [col3, squareRow], scale3);
    this.drawSquare(color4, [col4, squareRow], scale4);
    this.drawRainbowSquare([col5, squareRow], scale5);

    this.drawTriangle(color1, [col1, triangleRow], scale1);
    this.drawTriangle(color2, [col2, triangleRow], scale2);
    this.drawTriangle(color3, [col3, triangleRow], scale3);
    this.drawTriangle(color4, [col4, triangleRow], scale4);
    this.drawRainbowTriangle([col5, triangleRow], scale5);

    this.drawCircle(color1, [col1, circleRow], scale1);
    this.drawCircle(color2, [col2, circleRow], scale2);
    this.drawCircle(color3, [col3, circleRow], scale3);
    this.drawCircle(color4, [col4, circleRow], scale4);
    this.drawCircle(color5, [col5, circleRow], scale5);
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

MyGame.prototype.drawRainbowSquare = function (offset, scale) {
    this.mColorShader.setShaderPrimitive(gEngine.VertexBuffer.getRainbowSquareVertices())
    this.mColorShader.activateColorfulShader(offset, scale);
    var gl = gEngine.Core.getGL();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

MyGame.prototype.drawRainbowTriangle= function (offset, scale) {
    this.mColorShader.setShaderPrimitive(gEngine.VertexBuffer.getRainbowTriangleVertices())
    this.mColorShader.activateColorfulShader(offset, scale);
    var gl = gEngine.Core.getGL();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
};