// For NetBeans Syntax Highlight: http://plugins.netbeans.org/plugin/46515/glsl-syntax-highlighter 
//
// This is the vertex shader 
attribute vec3 aSquareVertexPosition;  // Vertex shader expects one vertex position
attribute vec4 aVertexColor;

// to transform the vertex position
uniform mat4 uModelTransform;
uniform mat4 uViewProjTransform;

varying vec4 uVColor;

void main(void) {
    // Convert the vec3 into vec4 for scan conversion and
    // transform by uModelTransform and uViewProjTransform before
    gl_Position = uViewProjTransform * uModelTransform * vec4(aSquareVertexPosition, 1.0); 

    uVColor = aVertexColor;
}
