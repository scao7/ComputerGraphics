
// Shengting Cao CS435 project5

var canvas;
var gl;

var numVertices = 36;
var texSize = 64;
var on = true;
var pause = true;
var program;
var modelViewMatrix = rotate(10, -1, 0, 0);
modelViewMatrix = mult(rotate(10, 0, 1, 0), modelViewMatrix);
// modelViewMatrix = mult(scalem(1.2,2,1),modelViewMatrix);
var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];
var pointsArrayNoTex = [];
var colorsArrayNoTex = [];
var texCoordsArrayNoTex = [];
var image = [];
var texture;
var change = 0;

var moveX = 0.0;
var moveY = 0.0;
var wallPaper;
var holderPaper;
var TVPaper;
var floorPaper;
var metalPaper;
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

  // gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

  return texture;
}

function configureTextureRGBA(image) {
  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
    gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

  return texture;
}

function quad(a, b, c, d) {
  pointsArray.push(vertices[a]);
  colorsArray.push(vertexColors[6]);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[b]);
  colorsArray.push(vertexColors[6]);
  texCoordsArray.push(texCoord[1]);

  pointsArray.push(vertices[c]);
  colorsArray.push(vertexColors[6]);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[a]);
  colorsArray.push(vertexColors[6]);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[c]);
  colorsArray.push(vertexColors[6]);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[d]);
  colorsArray.push(vertexColors[6]);
  texCoordsArray.push(texCoord[3]);
}

function quadWithoutTex(a, b, c, d) {
  pointsArrayNoTex.push(vertices[a]);
  colorsArrayNoTex.push(vertexColors[2]);
  texCoordsArray.push(texCoord[0]);

  pointsArrayNoTex.push(vertices[b]);
  colorsArrayNoTex.push(vertexColors[2]);
  texCoordsArray.push(texCoord[1]);

  pointsArrayNoTex.push(vertices[c]);
  colorsArrayNoTex.push(vertexColors[2]);
  texCoordsArray.push(texCoord[2]);

  pointsArrayNoTex.push(vertices[a]);
  colorsArrayNoTex.push(vertexColors[2]);
  texCoordsArray.push(texCoord[0]);

  pointsArrayNoTex.push(vertices[c]);
  colorsArrayNoTex.push(vertexColors[2]);
  texCoordsArray.push(texCoord[2]);

  pointsArrayNoTex.push(vertices[d]);
  colorsArrayNoTex.push(vertexColors[2]);
  texCoordsArray.push(texCoord[3]);
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
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  colorCube();
  // colorCubeWithoutTex()
  //buffer for tex instance 
  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  //add newbuffer for NoTex instance
  // var cBufferNoTex = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, cBufferNoTex);
  // gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArrayNoTex), gl.STATIC_DRAW);

  // var vBufferNoTex = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, vBufferNoTex);
  // gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArrayNoTex), gl.STATIC_DRAW);


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
  image[4] = document.getElementById("texImage4");
  image[5] = document.getElementById("texImage5");
  image[6] = document.getElementById("texImage6");
  image[7] = document.getElementById("texImage7");
  image[8] = document.getElementById("texImage8");
  image[9] = document.getElementById("texImage9");
  wallPaper = configureTexture(image[5]);
  holderPaper = configureTexture(image[4]);
  TVPaper = configureTexture(image[0]);
  floorPaper = configureTexture(image[6]);
  metalPaper = configureTexture(image[7]);
  outsidePaper = configureTexture(image[9]);
  windowPaper = configureTextureRGBA(image[8]);
  //configureTexture(image[change]);
  configureTexture(image[change]);


  thetaLoc = gl.getUniformLocation(program, "theta");


  document.getElementById("ButtonLeft").onclick = function () {
    moveX -= 0.1;

    render();
  };

  document.getElementById("ButtonRight").onclick = function () {
    moveX += 0.1;
    render();
  };

  document.getElementById("ButtonUp").onclick = function () {
    moveY += 0.1;
    render();
  };

  document.getElementById("ButtonDown").onclick = function () {
    moveY -= 0.1;
    render();
  };

  document.addEventListener("keyup", function () {
    if (event.keyCode == 37) {
      moveX -= 0.1;
      render();
    }
    else if (event.keyCode == 38) {
      moveY += 0.1;
      render();
    }
    else if (event.keyCode == 40) {
      moveY -= 0.1;
      render();
    }
    else if (event.keyCode == 39) {
      moveX += 0.1;
      render();
    }
  })

  render();

}


var render = function () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  leftWall();
  rightWall();
  outside();
  backWall();
  floor();
  requestAnimFrame(render);
}

function leftWall() {
  var s = scalem(1, 1, 1);
  var instanceMatrix = mult(translate(-0.8, 0.0, 0.0), s);
  instanceMatrix = mult(instanceMatrix, rotate(-270, 0, 1, 0));
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D, wallPaper);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function rightWall() {
  var s = scalem(1, 1, 1);
  var instanceMatrix = mult(translate(0.8, 0.0, 0.0), s);
  instanceMatrix = mult(instanceMatrix, rotate(-270, 0, 1, 0));
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function backWall() {
  var s = scalem(1.8, 1, 1);
  var instanceMatrix = mult(translate(0.0, 0.0, 0.4), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D, windowPaper);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function outside() {
  var s = scalem(2, 2, 2);
  var instanceMatrix = mult(translate(moveX, moveY, 0.8), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D, outsidePaper);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function backBoard() {
  var s = scalem(1, 0.6, 0.8);
  var instanceMatrix = mult(translate(0.0, 0.3, 0.18), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D, metalPaper);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function floor() {
  var s = scalem(1.8, 1, 1);
  var instanceMatrix = mult(translate(0.0, -0.6, 0.0), s);
  instanceMatrix = mult(instanceMatrix, rotate(90, 1, 0, 0));
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D, floorPaper);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}
