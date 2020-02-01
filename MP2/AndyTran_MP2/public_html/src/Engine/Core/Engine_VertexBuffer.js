/*
 * File: EngineCore_VertexBuffer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gGL context
 * 
 * Notice, this is a singleton object.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Float32Array: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || {};

// The VertexBuffer object
gEngine.VertexBuffer = (function () {
    // reference to the vertex positions for the square in the gl context
    var mSquareVertexBuffer = null;
    var mRainbowSquareVertexBuffer = null;
    var mColorBuffer = null;

    // First: define the vertices for a square
    var verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    var colorBuffer = [Math.random(), Math.random(), Math.random(), 1.0];

    var initialize = function () {
        var gl = gEngine.Core.getGL();

        // Step A: Create a buffer on the gGL context for our vertex positions
        mSquareVertexBuffer = gl.createBuffer();

        // Step B: Activate vertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);

        // Step C: Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);

        mColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorBuffer), gl.STATIC_DRAW);
        
        
        mRainbowSquareVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mRainbowSquareVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getRainbowSquare()), gl.STATIC_DRAW);
    };

    var getSolidSquareVertexRef = function () {
        return mSquareVertexBuffer;
    };

    var getRainbowSquareVertexRef = function () {
        return mRainbowSquareVertexBuffer;
    };
    var getColorBuffer = function () {
        return mColorBuffer;
    };

    var getRainbowSquare = function() {
        return [
        0.5, 0.5, 0.0, Math.random(), Math.random(), Math.random(), 1,
        -0.5, 0.5, 0.0, Math.random(), Math.random(), Math.random(), 1,
        0.5, -0.5, 0.0, Math.random(), Math.random(), Math.random(), 1,
        -0.5, -0.5, 0.0, Math.random(), Math.random(), Math.random(), 1
    ];
    }

    var mPublic = {
        initialize: initialize,
        getSolidSquareVertexRef: getSolidSquareVertexRef,
        getRainbowSquareVertexRef: getRainbowSquareVertexRef,
        getColorBuffer: getColorBuffer,
        getRainbowSquare: getRainbowSquare
    };

    return mPublic;
}());