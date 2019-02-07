/*
University of Alabmama
Shengting Cao
CS 435 project#2
*/
"use strict"

var canvas;
var gl;

var projection; // projection matrix uniform shader variable location
var transformation; // projection matrix uniform shader variable location
var vPosition;
var vColor;

// state representation
var Blocks; // seven blocks
var BlockIdToBeMoved; // this black is moving
var MoveCount;
var OldX;
var OldY;
var cIndex = -1;

var colors = [

    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),   // cyan
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 0.0)
];

var rotIndex = 1; // default
var click = false;
function CPiece (n, color, x0, y0, x1, y1, x2, y2, x3, y3) {
  if(cIndex < 3){ //draw circle
    this.NumVertices = 100 ;
    this.color = color;
    this.points=[];
    var radius =20;
    for(var i=0; i< this.NumVertices; i++ ){
      var x = radius * Math.cos((i / this.NumVertices) * 2.0 * Math.PI)+x0;
      var y = radius * Math.sin((i / this.NumVertices) * 2.0 * Math.PI)+y0;
      this.points.push(vec2(x, y));
    }
    console.log(this.NumVertices);
    this.colors=[];
    for(var i=0; i< this.NumVertices; i++ ){
      this.colors.push(color);
    }
  }
  else{//draw square
    this.NumVertices = n + 1 ;
    this.color = color;
    this.points=[];
    this.points.push(vec2(x0, y0));
    this.points.push(vec2(x1, y1));
    this.points.push(vec2(x2, y2));
    this.points.push(vec2(x3, y3));
    this.points.push(vec2(x1, y1));
    this.colors=[];
    for (var i=0; i<5; i++) this.colors.push(color);
  }


    this.vBuffer=0;
    this.cBuffer=0;

    this.OffsetX=0;
    this.OffsetY=0;
    this.Angle=0;

    this.UpdateOffset = function(dx, dy) {
        this.OffsetX += dx;
        this.OffsetY += dy;
    }

    this.SetOffset = function(dx, dy) {
        this.OffsetX = dx;
        this.OffsetY = dy;
    }

    this.UpdateAngle = function(deg) {
        this.Angle += deg;
    }

    this.SetAngle = function(deg) {
        this.Angle = deg;
    }

    this.isInTriangle = function(px,py,ax,ay,bx,by,cx,cy){ //check if in triangle

      var v0 = [cx-ax,cy-ay];
      var v1 = [bx-ax,by-ay];
      var v2 = [px-ax,py-ay];

      var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
      var dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
      var dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
      var dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
      var dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

      var invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

      var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
      var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

      return ((u >= 0) && (v >= 0) && (u + v < 1));
    }

    this.transform = function(x, y) {
        var theta = -Math.PI/180*this.Angle;	// in radians
        var x2 = this.points[0][0] + (x - this.points[0][0]-this.OffsetX) * Math.cos(theta) - (y - this.points[0][1]-this.OffsetY) * Math.sin(theta);
        var y2 = this.points[0][1] + (x - this.points[0][0]-this.OffsetX) * Math.sin(theta) + (y - this.points[0][1]-this.OffsetY) * Math.cos(theta);
        return vec2(x2, y2);
    }

    this.isInside = function(x, y) {
        var p=this.transform(x, y);
        for (var i=0; i<this.NumVertices-1; i++) {
            if (this.isInTriangle(p[0], p[1],this.points[0][0],this.points[0][1], this.points[i][0],this.points[i][1],this.points[i+1][0],this.points[i+1][1])) return true;
        }
        return false;
    }

    this.init = function() {

        this.vBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );

        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW );

        this.cBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, this.cBuffer );

        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );

    }

    this.draw = function() {
        var tm=translate(this.points[0][0]+this.OffsetX, this.points[0][1]+this.OffsetY, 0.0);
        tm=mult(tm, rotate(this.Angle, vec3(0, 0, 1)));
        tm=mult(tm, translate(-this.points[0][0], -this.points[0][1], 0.0));
        gl.uniformMatrix4fv( transformation, gl.TRUE, flatten(tm) );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );


        gl.bindBuffer( gl.ARRAY_BUFFER, this.cBuffer );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );


        gl.drawArrays( gl.TRIANGLE_FAN, 0, this.NumVertices );

    }

}

window.onload = function initialize() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    document.addEventListener('keydown', function(event) {//check number key
        if(event.keyCode ==  49) {
            cIndex = 0;
        }
        else if(event.keyCode == 50) {
            cIndex = 1;
        }
        else if(event.keyCode == 51){
            cIndex = 2;
        }
        else if(event.keyCode == 52){
            cIndex = 3;
        }
        else if(event.keyCode == 53){
            cIndex = 4;
        }
        else if(event.keyCode == 54){
          cIndex = 5;
        }
    });
    document.addEventListener('keyup',function(event){
      cIndex = -1;
    });

  canvas.addEventListener("mousedown", function(event){
    if (event.button!=0) return; // left button only
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    y=canvas.height-y;
    if (cIndex >= 0){
      var  t1 = vec2(x-20,y-20);1
      var t2 = vec2(x+20,y+20);
      var t3 = vec2(t1[0],t2[1]);
      var t4 = vec2(t2[0],t1[1]);
      if(cIndex < 3 ){
        Blocks.push(new CPiece(4, colors[cIndex], x, y, t2[0], t2[1], t3[0], t3[1], t4[0], t4[1]));

      }else{
        Blocks.push(new CPiece(4, colors[cIndex], t1[0], t1[1], t2[0], t2[1], t3[0], t3[1], t4[0], t4[1]));
      }
      Blocks[Blocks.length-1].init();
      console.log("before render");
      window.requestAnimFrame(render);
      console.log("after render");
  }
    // console.log("mousedown, x="+x+", y="+y);
    if (event.shiftKey) {  // with shift key, rotate counter-clockwise
      for (var i=Blocks.length-1; i>=0; i--) {	// search from last to first
        if (Blocks[i].isInside(x, y)) {
          // move Blocks[i] to the top
          var temp=Blocks[i];
          for (var j=i; j<Blocks.length-1; j++) Blocks[j]=Blocks[j+1];
          Blocks[Blocks.length-1]=temp;
          // rotate the block
          //Blocks[Blocks.length-1].UpdateAngle(rotDegrees[rotIndex]);
          Blocks.pop();
          // redraw
          // render();
          window.requestAnimFrame(render);
          return;
        }
      }

      return;
    }
    for (var i=Blocks.length-1; i>=0; i--) {	// search from last to first
      console.log(Blocks[i].isInside(x, y));
      if (Blocks[i].isInside(x, y)) {
        // move Blocks[i] to the top
        var temp=Blocks[i];
        for (var j=i; j<Blocks.length-1; j++) Blocks[j]=Blocks[j+1];
        Blocks[Blocks.length-1]=temp;
        // remember the one to be moved
        BlockIdToBeMoved=Blocks.length-1;
        MoveCount=0;
        OldX=x;
        OldY=y;
        // redraw
        window.requestAnimFrame(render);
        // render();
        break;
      }
    }
  });

  canvas.addEventListener("mouseup", function(event){
    if (BlockIdToBeMoved>=0) {
      BlockIdToBeMoved=-1;
    }
  });

  canvas.addEventListener("mousemove", function(event){
    if (BlockIdToBeMoved>=0) {  // if dragging
      var x = event.pageX - canvas.offsetLeft;
      var y = event.pageY - canvas.offsetTop;
      y=canvas.height-y;
      Blocks[BlockIdToBeMoved].UpdateOffset(x-OldX, y-OldY);
      MoveCount++;
      OldX=x;
      OldY=y;
      window.requestAnimFrame(render);
      // render();
    }
  });

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    // Initial State
    Blocks=[];

    for (var i=0; i<Blocks.length; i++) {
        Blocks[i].init();
    }

    BlockIdToBeMoved=-1; // no piece selected

    projection = gl.getUniformLocation( program, "projection" );
    var pm = ortho( 0.0, canvas.width, 0.0, canvas.height, -1.0, 1.0 );
    gl.uniformMatrix4fv( projection, gl.TRUE, flatten(pm) );

    transformation = gl.getUniformLocation( program, "transformation" );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    vColor = gl.getAttribLocation( program, "vColor" );

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (var i=0; i<Blocks.length; i++) {
        Blocks[i].draw();
    }
    // window.requestAnimFrame(render);
}
