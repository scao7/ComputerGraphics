

var canvas;
var gl;

var numVertices = 36;
var texSize = 64;
var on = true;
var pause = true;
var program;
var modelViewMatrix = rotate(0, 0, 1, 1);
var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];
var image = [];
var texture;
var change = 0;

var mdvStatic = rotate(45, 1, 0, 0);
var texCoord = [
  vec2(0, 0),
  vec2(0, 1),
  vec2(1, 1),
  vec2(1, 0)
];

var vertices = [
  vec4(-0.5, -0.5, 0.1, 1.0),
  vec4(-0.5, 0.5, 0.1, 1.0),
  vec4(0.5, 0.5, 0.1, 1.0),
  vec4(0.5, -0.5, 0.1, 1.0),
  vec4(-0.5, -0.5, -0.1, 1.0),
  vec4(-0.5, 0.5, -0.1, 1.0),
  vec4(0.5, 0.5, -0.1, 1.0),
  vec4(0.5, -0.5, -0.1, 1.0)
];

var vertexColors = [
  vec4(0.0, 0.0, 0.0, 1.0),  // black
  vec4(1.0, 0.0, 0.0, 1.0),  // red
  vec4(1.0, 1.0, 0.0, 1.0),  // yellow
  vec4(0.0, 1.0, 0.0, 1.0),  // green
  vec4(0.0, 0.0, 1.0, 1.0),  // blue
  vec4(1.0, 0.0, 1.0, 1.0),  // magenta
  vec4(0.0, 1.0, 1.0, 1.0),  // white
  vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = [180, 0.0, 0.0];

var thetaLoc;

function configureTexture(image) {
  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
    gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}


function quad(a, b, c, d) {
  pointsArray.push(vertices[a]);
  colorsArray.push(vertexColors[2]);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[b]);
  colorsArray.push(vertexColors[2]);
  texCoordsArray.push(texCoord[1]);

  pointsArray.push(vertices[c]);
  colorsArray.push(vertexColors[2]);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[a]);
  colorsArray.push(vertexColors[2]);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[c]);
  colorsArray.push(vertexColors[2]);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[d]);
  colorsArray.push(vertexColors[2]);
  texCoordsArray.push(texCoord[3]);
}

function quadWithoutTex(a, b, c, d) {
  pointsArray.push(vertices[a]);
  colorsArray.push(vertexColors[2]);
  //texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[b]);
  colorsArray.push(vertexColors[2]);
  //texCoordsArray.push(texCoord[1]);

  pointsArray.push(vertices[c]);
  colorsArray.push(vertexColors[2]);
  //texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[a]);
  colorsArray.push(vertexColors[2]);
  //texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[c]);
  colorsArray.push(vertexColors[2]);
 // texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[d]);
  colorsArray.push(vertexColors[2]);
 //texCoordsArray.push(texCoord[3]);
}

function colorCube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

function colorCubeWithoutTex() {
  quadWithoutTex(1, 0, 3, 2);
  quadWithoutTex(2, 3, 7, 6);
  quadWithoutTex(3, 0, 4, 7);
  quadWithoutTex(6, 5, 1, 2);
  quadWithoutTex(4, 5, 6, 7);
  quadWithoutTex(5, 4, 0, 1);
}

window.onload = function init() {

  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL isn't available"); }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  colorCube();

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);


  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var tBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

  var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTexCoord);

  //
  // Initialize a texture
  //

  //var image = new Image();
  //image.onload = function() {
  //   configureTexture( image );
  //}
  //image.src = "SA2011_black.gif"

  image[0] = document.getElementById("texImage");
  image[1] = document.getElementById("texImage1");
  image[2] = document.getElementById("texImage2");
  image[3] = document.getElementById("texImage3");

  //configureTexture(image[change]);
  configureTexture(image[change]);


  thetaLoc = gl.getUniformLocation(program, "theta");

  // document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
  // document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
  // document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
  document.getElementById("ButtonNext").onclick = function () {
    change += 1;
    if (change > 2) {
      change = 0;
    }

    configureTexture(image[change]);

    render();
  };

  document.getElementById("ButtonPrev").onclick = function () {
    change -= 1;
    if (change < 0) {
      change = 2;
    }
    if (on)
      configureTexture(image[change]);
    render();
  };

  document.getElementById("ButtonOn").onclick = function () {
    if (on == true) {
      on = false;
      configureTexture(image[3]);
    }
    else {
      on = true;
      configureTexture(image[change]);
    }
  };

  document.getElementById("ButtonPause").onclick = function () {
    if (pause == true) {
      pause = false;
    }
    else {
      pause = true;
    }
    render();
  };


  setInterval(function () {
    if (pause) {
      render();
    }
    else requestAnimFrame(render2);
  }, 1000);

}


var render2 = function () {
  //theta[axis] += 2.0;
  change += 1;
  if (change > 2) {
    change = 0;
  }
  if (on == false) {
    configureTexture[image[3]];
  }
  else configureTexture(image[change]);
  render();
}

var render = function () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //theta[axis] += 2.0;

  printBase();
  drawTV();
  // printBase();
  leftWall();
  rightWall();
  backWall();
  holder();
  requestAnimFrame(render);
}

function drawTV() {
  var s = scalem(0.5, 0.5, 0.5);
  var instanceMatrix = mult(translate(0.0, 0.0, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function leftWall() {
  var s = scalem(1, 1, 1);
  var instanceMatrix = mult(translate(-0.6, 0.0, 0.0), s);
  instanceMatrix = mult(instanceMatrix, rotate(-270, 0, 1, 0));
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function rightWall() {
  var s = scalem(1, 1, 1);
  var instanceMatrix = mult(translate(0.6, 0.0, 0.0), s);
  instanceMatrix = mult(instanceMatrix, rotate(-270, 0, 1, 0));
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function printBase() {
  var s = scalem(0.5, 0.5, 0.5);
  var instanceMatrix = mult(translate(0.0, 0.0, 0.0), s);
  instanceMatrix = mult(rotate(90, 1, 0, 0), instanceMatrix);
  instanceMatrix = mult(translate(0.0, -0.5, 0.0), instanceMatrix);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function backWall() {
  var s = scalem(1, 1, 1);
  var instanceMatrix = mult(translate(0.0, 0.0, 0.5), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function holder() {
  var s = scalem(0.1, 0.5, 0.1);
  var instanceMatrix = mult(translate(0.0, 0.0, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}