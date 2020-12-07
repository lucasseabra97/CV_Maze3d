//////////////////////////////////////////////////////////////////////////////
//
//  WebGL_example_20.js 
//
//  Animating models with global and local transformations.
//
//  References: www.learningwebgl.com + E. Angel examples
//
//  J. Madeira - October 2015
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null;

var triangleVertexPositionBuffer = null;
	
var triangleVertexColorBuffer = null;

// The GLOBAL transformation parameters

var globalAngleYY = 0.0;

var globalTz = 0.0;

// The local transformation parameters

// The translation vector

var tx = 0.0;

var ty = 0.0;

var tz = 0.0;

// The rotation angles in degrees

var angleXX = 0.0;

var angleYY = 0.0;

var angleZZ = 0.0;

// The scaling factors

var sx = 0.5;

var sy = 0.5;

var sz = 0.5;

// NEW - GLOBAL Animation controls

var globalRotationYY_ON = 1;

var globalRotationYY_DIR = 1;

var globalRotationYY_SPEED = 1;

// NEW - Local Animation controls

var rotationXX_ON = 1;

var rotationXX_DIR = 1;

var rotationXX_SPEED = 1;
 
var rotationYY_ON = 1;

var rotationYY_DIR = 1;

var rotationYY_SPEED = 1;
 
var rotationZZ_ON = 1;

var rotationZZ_DIR = 1;

var rotationZZ_SPEED = 1;
 
// To allow choosing the way of drawing the model triangles

var primitiveType = null;
 
// To allow choosing the projection type

var projectionType = 0;
 
// For storing the vertices defining the triangles

var vertices = [

    // FRONT FACE
     
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,

     
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0, -1.0,  1.0,
    
    // TOP FACE
    
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

     
     1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,  
    -1.0,  1.0,  1.0,
    
    // BOTTOM FACE 
    
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,

     
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    -1.0, -1.0, -1.0,
    
    // LEFT FACE 
    
    -1.0,  1.0,  1.0,
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
     
     
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
    -1.0, -1.0, -1.0,
    
    // RIGHT FACE 
    
     1.0,  1.0, -1.0,
     1.0, -1.0,  1.0,
     1.0, -1.0, -1.0,
     
     
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    
    // BACK FACE 
    
    -1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,
     
     
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,			 
];

// And their colour

var colors = [

     // FRONT FACE
         
     1.00,  0.00,  0.00,
     1.00,  0.00,  0.00,
     1.00,  0.00,  0.00,

         
     1.00,  1.00,  0.00,
     1.00,  1.00,  0.00,
     1.00,  1.00,  0.00,
                  
     // TOP FACE
         
     0.00,  0.00,  0.00,
     0.00,  0.00,  0.00,
     0.00,  0.00,  0.00,

         
     0.50,  0.50,  0.50,
     0.50,  0.50,  0.50,
     0.50,  0.50,  0.50,
                  
     // BOTTOM FACE
         
     0.00,  1.00,  0.00,
     0.00,  1.00,  0.00,
     0.00,  1.00,  0.00,

         
     0.00,  1.00,  1.00,
     0.00,  1.00,  1.00,
     0.00,  1.00,  1.00,
                  
     // LEFT FACE
         
     0.00,  0.00,  1.00,
     0.00,  0.00,  1.00,
     0.00,  0.00,  1.00,

         
     1.00,  0.00,  1.00,
     1.00,  0.00,  1.00,
     1.00,  0.00,  1.00,
                  
     // RIGHT FACE
         
     0.25,  0.50,  0.50,
     0.25,  0.50,  0.50,
     0.25,  0.50,  0.50,

         
     0.50,  0.25,  0.00,
     0.50,  0.25,  0.00,
     0.50,  0.25,  0.00,
                  
                  
     // BACK FACE
         
     0.25,  0.00,  0.75,
     0.25,  0.00,  0.75,
     0.25,  0.00,  0.75,

         
     0.50,  0.35,  0.35,
     0.50,  0.35,  0.35,
     0.50,  0.35,  0.35,			 			 
];

function initBuffers() {	
	
	// Coordinates
		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = vertices.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Colors
		
	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colors.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
			triangleVertexColorBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType ) {

    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
	
	// Drawing the contents of the vertex buffer
	
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	
	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
		
	}	
}

