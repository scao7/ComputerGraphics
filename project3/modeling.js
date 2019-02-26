/*
CS435 Graphics, Shengting Cao
University of Alabama
*/
var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];
var colors1 = [];
var axsis = [0, 1, 0];

var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0)
];

// RGBA colors
var vertexColors = [
  vec4(0.0, 0.0, 0.0, 1.0),  // black
  vec4(1.0, 0.0, 1.0, 1.0),  // magenta
  vec4(1.0, 0.0, 0.0, 1.0),  // red
  vec4(1.0, 1.0, 0.0, 1.0),  // yellow
  vec4(0.0, 1.0, 0.0, 1.0),  // green
  vec4(0.0, 0.0, 1.0, 1.0),  // blue
  // vec4(1.0, 1.0, 1.0, 1.0),  // white
  vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];


// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT = 2.0;
var BASE_WIDTH = 5.0;
var LOWER_ARM_HEIGHT = 5.0;
var LOWER_ARM_WIDTH = 0.5;
var UPPER_ARM_HEIGHT = 5.0;
var UPPER_ARM_WIDTH = 0.5;

// Shader transformation matrices

var modelViewMatrix, projectionMatrix, mdvStatic;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;

var theta = [0, 0, 0];

var angle = 0;

var modelViewMatrixLoc;

var vBuffer, cBuffer;

//----------------------------------------------------------------------------

function quad(a, b, c, d) {
  colors.push(vertexColors[a]);
  points.push(vertices[a]);
  colors.push(vertexColors[a]);
  points.push(vertices[b]);
  colors.push(vertexColors[a]);
  points.push(vertices[c]);
  colors.push(vertexColors[a]);
  points.push(vertices[a]);
  colors.push(vertexColors[a]);
  points.push(vertices[c]);
  colors.push(vertexColors[a]);
  points.push(vertices[d]);
}

function colorCube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

//____________________________________________

// Remmove when scale in MV.js supports scale matrices

function scale4(a, b, c) {
  var result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}


//--------------------------------------------------
function isLetter(str){
  return str.match(/[a-z]/i)||str.match(/[A-Z]/i);
}

var index =0;
  var word = "";
var intervalID = window.setInterval(function(){
  console.log(name);
  console.log(name.length);
  word = "";
  if (index >= name.length)
    index = 0;
  while(name[index] != " "&& index != name.length){
    if(isLetter(name[index]))
    word += name[index];
    index ++;
  }
  index ++;
  word = word.toLowerCase();
  console.log(word);

}, 1000);

window.onload = function init() {

  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL isn't available"); }

  document.getElementById("Button1").onclick= function(){theta[1] -= 10}
  document.getElementById("Button2").onclick= function(){theta[1] += 10}
  document.getElementById("Button3").onclick= function(){theta[0] -= 10}
  document.getElementById("Button4").onclick= function(){theta[0] += 10}
  document.addEventListener('keydown', function (event) {//check number key
    if (event.keyCode == 37) {
      theta[1] -=10;
    }
    if (event.keyCode == 38) {
      theta[0] += 10
    }
    if (event.keyCode == 39) {
      theta[1] += 10;
    }
    if (event.keyCode == 40) {
      theta[0] -= 10;
    }
  });
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");

  gl.useProgram(program);

  colorCube();

  // Load shaders and use the resulting shader program

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Create and initialize  buffer objects

  vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

  projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
  gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

  render();
}
function a() {
  left1();
  left2();
  right1();
  right2();
  TLeft();
  TRight();
  midLeft();
  midRight();
}
function b() {
  TLeft();
  TRight();
  BLeft();
  BRight();
  midUp()
  midDown();
  right1();
  right2();
  midRight();
}
function c() {
  left1();
  left2();
  TLeft();
  TRight();
  BLeft();
  BRight();
}
function d() {
  TLeft();
  TRight();
  BLeft();
  BRight();
  midUp()
  midDown();
  right1();
  right2();
}
function e() {
  left1();
  left2();
  TLeft();
  TRight();
  BLeft();
  BRight();
  midLeft();
}
function f() {
  left1();
  left2();
  TLeft();
  TRight();
  midLeft();
}
function g() {
  left1();
  left2();
  BLeft();
  BRight();
  right2();
  midRight();
  TLeft();
  TRight();
}
function h() {
  left1();
  left2();
  right1();
  right2();
  midRight();
  midLeft();

}
function i() {
  TLeft();
  TRight();
  BLeft();
  BRight();
  midUp();
  midDown();
}
function j() {
  right1();
  right2();
  BLeft();
  BRight();
  left2();
}
function k() {
  left1();
  left2();
  midLeft();
  upRight();
  downRight();
}
function l() {
  left1();
  left2();
  BLeft();
  BRight();
}
function m() {
  left1();
  left2();
  upLeft();
  upRight();
  right1();
  right2();
}
function n() {
  left1();
  left2();
  upLeft();
  downRight();
  right1();
  right2();
}
function o() {
  left1();
  left2();
  right1();
  right2();
  TLeft();
  TRight();
  BRight();
  BLeft();
}
function p() {
  left1();
  left2();
  TRight();
  TLeft();
  midLeft();
  midRight();
  right1();
}
function q() {
  left1();
  left2();
  right2();
  right1();
  right2();
  TLeft();
  TRight();
  BLeft();
  BRight();
  downRight();
}
function r() {
  left1();
  left2();
  right1();
  TRight();
  TLeft();
  midLeft();
  midRight();
  downRight();
}
function s() {
  left1();
  right2();
  TLeft();
  TRight();
  BLeft();
  BRight();
  midLeft();
  midRight();
}
function t() {
  TLeft();
  TRight();
  midUp();
  midDown();
}
function u() {
  left1();
  left2();
  BLeft();
  BRight();
  right1();
  right2();
}
function v() {
  left1();
  left2();
  downLeft();
  upRight();
}
function w() {
  left1();
  left2();
  downLeft();
  downRight();
  right1();
  right2();
}
function x() {
  upLeft();
  upRight();
  downLeft();
  downRight();
}
function y() {
  left1();
  right1();
  midLeft();
  midRight();
  BLeft();
  BRight();
  right1();
  right2();
}
function z() {
  TLeft();
  TRight();
  upRight();
  downLeft();
  BLeft();
  BRight();
}
//----------------------------------------------------------------------------
function printLetter(count) {
  switch (word[count]) {
    case 'a':
      a();
      break;
    case 'b':
      b();
      break;
    case 'c':
      c();
      break;
    case 'd':
      d();
      break;
    case 'e':
      e();
      break;
    case 'f':
      f();
      break;
    case 'g':
      g();
      break;
    case 'h':
      h();
      break;
    case 'i':
      i();
      break;
    case 'j':
      j();
      break;
    case 'k':
      k();
      break;
    case 'l':
      l();
      break;
    case 'm':
      m();
      break;
    case 'n':
      n();
      break;
    case 'o':
      o();
      break;
    case 'p':
      p();
      break;
    case 'q':
      q();
      break;
    case 'r':
      r();
      break;
    case 's':
      s();
      break;
    case 't':
      t();
      break;
    case 'u':
      u();
      break;
    case 'v':
      v();
      break;
    case 'w':
      w();
      break;
    case 'x':
      x();
      break;
    case 'y':
      y();
      break;
    case 'z':
      z();
      break;

    default:

  }
}

function printWords(cword) {
   modelViewMatrix =  rotate(0,0,1,0);


  modelViewMatrix = mult(modelViewMatrix,rotate(theta[0], 1,0,0));
  modelViewMatrix = mult(modelViewMatrix,rotate(theta[1], 0,1,0));

  modelViewMatrix = mult(modelViewMatrix, scalem(0.3, 0.3, 0.3));
  modelViewMatrix = mult(modelViewMatrix, translate(-22, 10, 0.0));

  mdvStatic = rotate(15, 1, 1, 0);
  mdvStatic = mult(mdvStatic, scalem(0.3, 0.3, 0.3));
  mdvStatic = mult(mdvStatic, translate(25, 10, 0.0));

  for (var lo = 0; lo < 12; lo++) {
    printLetter(lo);
    modelViewMatrix = mult(modelViewMatrix, translate(4, 0.0, 0.0));
  }
}

function printBase() {
  var s = scale4(50, 30, 1);
  var instanceMatrix = mult(translate(-25, 0.0, 2), s);
  modelViewMatrix = mult(modelViewMatrix, rotate(180, 1, 0, 0));
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
  modelViewMatrix = mult(modelViewMatrix, rotate(180, 1, 0, 0));
}
/*segments */
function left1() {
  var s = scale4(0.25, 1.5, 3);
  var instanceMatrix = mult(translate(-1.5, 0.75, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
function left2() {
  var s = scale4(0.5, 1.5, 3);
  var instanceMatrix = mult(translate(-1.5, -0.75, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
function right1() {
  var s = scale4(0.5, 1.5, 3);
  var instanceMatrix = mult(translate(1.5, 0.75, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

function right2() {
  var s = scale4(0.5, 1.5, 3);
  var instanceMatrix = mult(translate(1.5, -0.75, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
function TLeft() {
  var s = scale4(1.5, 0.25, 3);
  var instanceMatrix = mult(translate(-0.75, 1.5, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

function TRight() {
  var s = scale4(1.5, 0.25, 3);
  var instanceMatrix = mult(translate(0.75, 1.5, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
function BLeft() {
  var s = scale4(1.5, 0.25, 3);
  var instanceMatrix = mult(translate(-0.75, -1.5, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
};
function BRight() {
  var s = scale4(1.5, 0.25, 3);
  var instanceMatrix = mult(translate(0.75, -1.5, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
function midRight() {
  var s = scale4(1.5, 0.25, 3);
  var instanceMatrix = mult(translate(0.75, 0, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
};
function midLeft() {
  var s = scale4(1.5, 0.25, 3);
  var instanceMatrix = mult(translate(-0.75, 0, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
function midUp() {
  var s = scale4(0.5, 1.5, 3);
  var instanceMatrix = mult(translate(0.0, 0.75, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
function midDown() {
  var s = scale4(0.5, 1.5, 3);
  var instanceMatrix = mult(translate(0.0, -0.75, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
function upLeft() {
  var s = scale4(0.25, 2, 0.25);
  modelViewMatrix = mult(modelViewMatrix, rotate(45, 0, 0, 1));
  var instanceMatrix = mult(translate(0.0, 1, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
  modelViewMatrix = mult(modelViewMatrix, rotate(-45, 0, 0, 1));
}
function upRight() {
  var s = scale4(0.25, 2, 0.25);
  modelViewMatrix = mult(modelViewMatrix, rotate(-45, 0, 0, 1));
  var instanceMatrix = mult(translate(0.0, 1, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
  modelViewMatrix = mult(modelViewMatrix, rotate(45, 0, 0, 1));
}
function downLeft() {
  var s = scale4(0.25, 2, 0.25);
  modelViewMatrix = mult(modelViewMatrix, rotate(-45, 0, 0, 1));
  var instanceMatrix = mult(translate(0.0, -1, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
  modelViewMatrix = mult(modelViewMatrix, rotate(45, 0, 0, 1));
};
function downRight() {
  var s = scale4(0.25, 2, 0.25);
  modelViewMatrix = mult(modelViewMatrix, rotate(45, 0, 0, 1));
  var instanceMatrix = mult(translate(0.0, -1, 0.0), s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
  modelViewMatrix = mult(modelViewMatrix, rotate(-45, 0, 0, 1));
};

function bottomBase() {
  var s = scale4(50, 5, 50);
  var instanceMatrix = mult(translate(-25, -30, -2), s);
  var t = mult(mdvStatic, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
function holder() {
  var s = scale4(5, 15, 3);
  var instanceMatrix = mult(translate(-25, -20, -10), s);
  var t = mult(mdvStatic, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
//----------------------------------------------------------------------------

var render = function () {

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  printWords(word);
  printBase();
  bottomBase();
  holder();

  requestAnimFrame(render);
}
