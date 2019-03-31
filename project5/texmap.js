
// Shengting Cao CS435 project5

var canvas;
var gl;

var numVertices = 36;
var texSize = 64;
var on = true;
var pause = true;
var program;
var modelViewMatrix = rotate(10, -1, 0, 0);
modelViewMatrix = mult(rotate(10,0,1,0),modelViewMatrix);
var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];
var pointsArrayNoTex = [];
var colorsArrayNoTex = [];
var texCoordsArrayNoTex = [];
var image = [];
var texture;
var change = 0;


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
  wallPaper = configureTexture(image[5]);
  holderPaper = configureTexture(image[4]);
  TVPaper = configureTexture(image[0]);
  floorPaper = configureTexture(image[6]);
  metalPaper = configureTexture(image[7]);
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

    TVPaper = configureTexture(image[change]);

    render();
  };

  document.getElementById("ButtonPrev").onclick = function () {
    change -= 1;
    if (change < 0) {
      change = 2;
    }
    if (on)
    TVPaper = configureTexture(image[change]);
    render();
  };

  document.getElementById("ButtonOn").onclick = function () {
    if (on == true) {
      on = false;
      TVPaper = configureTexture(image[3]);
    }
    else {
      on = true;
      TVPaper = configureTexture(image[change]);
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
    TVPaper = configureTexture[image[3]];
  }
  else TVPaper = configureTexture(image[change]);
  render();
}

var render = function () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //theta[axis] += 2.0;

  // printBase();
  drawTV();
  leftWall();
  rightWall();
  backWall();
  holder();
  backBoard();
  floor();
  table();
  tableLeg1();
  tableLeg2();
  neck();
  requestAnimFrame(render);
}

function drawTV() {
  var s = scalem(0.8, 0.55, 0.8);
  var instanceMatrix = mult(translate(0.0, 0.32, 0.1), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D,TVPaper);
  gl.drawArrays(gl.TRIANGLES, 24, 6);
}

function leftWall() {
  var s = scalem(1, 1, 1);
  var instanceMatrix = mult(translate(-0.8, 0.0, 0.0), s);
  instanceMatrix = mult(instanceMatrix, rotate(-270, 0, 1, 0));
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D,wallPaper);
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
  var s = scalem(1.8, 1, 1);
  var instanceMatrix = mult(translate(0.0, 0.0, 0.5), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function holder() {
  var s = scalem(0.6, 0.08, 1.5);
  var instanceMatrix = mult(translate(0.0, -0.1, -0.3), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D,metalPaper);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}
function backBoard(){
  var s = scalem(1, 0.6, 0.8);
  var instanceMatrix = mult(translate(0.0, 0.3, 0.18), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D,metalPaper);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}
function floor(){
  var s = scalem(1.8, 1, 1);
  var instanceMatrix = mult(translate(0.0, -0.6, 0.0), s);
  instanceMatrix = mult(instanceMatrix,rotate(90,1,0,0));
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D,floorPaper);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function table(){
  var s = scalem(0.8, 0.5, 0.5);
  var instanceMatrix = mult(translate(0.0, -0.2, -0.3), s);
  instanceMatrix = mult(instanceMatrix,rotate(90,1,0,0));
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D,holderPaper);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function tableLeg1(){
  var s = scalem(0.1, 0.3, 1.5);
  var instanceMatrix = mult(translate(0.3, -0.3, -0.3), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D,holderPaper);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function tableLeg2(){
  var s = scalem(0.1, 0.3, 1.5);
  var instanceMatrix = mult(translate(-0.3, -0.3, -0.3), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D,holderPaper);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function neck(){
  var s = scalem(0.1, 0.3, 0.7);
  var instanceMatrix = mult(translate(0.0, -0.1, 0.1), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.bindTexture(gl.TEXTURE_2D,metalPaper);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}