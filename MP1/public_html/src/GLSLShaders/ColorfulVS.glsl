// For NetBeans Syntax Highlight: http://plugins.netbeans.org/plugin/46515/glsl-syntax-highlighter 
//
// This is the vertex shader

precision mediump float;
attribute vec3 aSquareVertexPosition;  // Vertex shader expects one vertex position
attribute vec4 vertColor;
uniform vec2 uPixelOffset;
uniform vec2 uScale;
varying vec4 uPixelColor;

void main(void) {
    // Convert the vec3 into vec4 for scan conversion and
    // assign to gl_Position to pass the vertex to the fragment shader
    gl_Position = vec4(aSquareVertexPosition, 1.0);
    gl_Position.x = uScale.x * gl_Position.x + uPixelOffset.x;
    gl_Position.y = uScale.y * gl_Position.y + uPixelOffset.y;

    uPixelColor = vertColor;
}
