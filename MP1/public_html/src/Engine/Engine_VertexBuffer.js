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

var gEngine = gEngine || { };

// The VertexBuffer object
gEngine.VertexBuffer = (function () {
    // reference to the vertex positions for the square in the gl context
    var mVertexBuffer = null;
    const VERTICES_IN_CIRCLE = 60;

    // First: define the vertices for a square
    var verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    var verticesOfTriangle = [
        0.0, 0.5, 0.0,
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0
    ]


    var getCircleArray = function (n) {
        let arr = [];
        let i;
        for (i = 0; i < n; i++) {
            let rad = (Math.PI / 180) * i * (360 / n);
            arr.push(Math.cos(rad) / 2)
            arr.push(Math.sin(rad) / 2)
            arr.push(0);
        }
        return arr;
    }

    var verticesOfCircle = getCircleArray(VERTICES_IN_CIRCLE);

    var initialize = function () {
        var gl = gEngine.Core.getGL();

        // Step A: Create a buffer on the gGL context for our vertex positions
        mVertexBuffer = gl.createBuffer();

        // Step B: Activate vertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, mVertexBuffer);

        // Step C: Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfCircle), gl.STATIC_DRAW);
    };

    var getGLVertexRef = function () { return mVertexBuffer; };
    var getSquareVertices = function () { return verticesOfSquare; };
    var getTriangleVertices = function () { return verticesOfTriangle; };
    var getCircleVertices = function () { return verticesOfCircle; };

    var mPublic = {
        initialize: initialize,
        getGLVertexRef: getGLVertexRef,
        getSquareVertices: getSquareVertices,
        getTriangleVertices: getTriangleVertices,
        getCircleVertices: getCircleVertices
    };

    return mPublic;
}());