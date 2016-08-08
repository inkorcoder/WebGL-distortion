var canvas, createGeometry, createShaders, gl, gui, i, image, lastTime, mask, mask2, positionLocation, program, render, setTexture, textures, u_imageLoc, u_matrixLoc, variables, x, y;

canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

gl = canvas.getContext("webgl");

program = positionLocation = u_imageLoc = u_matrixLoc = void 0;

image = new Image();

image.src = "img/cry.png";

mask = new Image();

mask.src = "img/mask.png";

mask2 = new Image();

mask2.src = "img/mask2.png";

variables = {
  Frequency: 100,
  Amplitude: 0.001,
  r: 1.0,
  g: 1.0,
  b: 1.0,
  sinX: 1.5,
  sinY: 1.5
};

gui = new dat.GUI();

gui.add(variables, 'Frequency').min(50).max(150).step(10).onChange(function(val) {
  variables.r = val;
});

gui.add(variables, 'Amplitude').min(0.0005).max(0.002).step(0.0002).onChange(function(val) {
  variables.g = val;
});

createShaders = function() {
  var u_image0Location, u_image1Location, u_image2Location;
  program = createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
  gl.useProgram(program);
  positionLocation = gl.getAttribLocation(program, "a_position");
  u_image0Location = gl.getUniformLocation(program, "u_image0");
  u_image1Location = gl.getUniformLocation(program, "u_image1");
  u_image2Location = gl.getUniformLocation(program, "u_image2");
  gl.uniform1i(u_image0Location, 0);
  gl.uniform1i(u_image1Location, 1);
  gl.uniform1i(u_image2Location, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures[0]);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, textures[1]);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, textures[2]);
  u_matrixLoc = gl.getUniformLocation(program, "u_matrix");
  gl.uniform1f(gl.getUniformLocation(program, 'Frequency'), variables.Frequency);
  gl.uniform1f(gl.getUniformLocation(program, 'Amplitude'), variables.Amplitude);
  gl.uniform1f(gl.getUniformLocation(program, 'uB'), variables.b);
  gl.uniform1f(gl.getUniformLocation(program, 'sinX'), variables.sinX);
  gl.uniform1f(gl.getUniformLocation(program, 'sinY'), variables.sinY);
  gl.uniform1f(gl.getUniformLocation(program, 'time'), i);
};

createGeometry = function() {
  var positionBuffer;
  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
};

textures = [];

setTexture = function(_is) {
  var clipHeight, clipWidth, clipX, clipY, dstHeight, dstWidth, dstX, dstY, img, j, len, ref, texture;
  if (!_is) {
    ref = [image, mask];
    for (j = 0, len = ref.length; j < len; j++) {
      img = ref[j];
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      textures.push(texture);
    }
  }
  dstX = 0;
  dstY = 0;
  dstWidth = gl.canvas.width;
  dstHeight = gl.canvas.height;
  clipX = dstX / gl.canvas.width * 2 - 1;
  clipY = dstY / gl.canvas.height * -2 + 1;
  clipWidth = dstWidth / gl.canvas.width * 2;
  clipHeight = dstHeight / gl.canvas.height * -2;
  gl.uniformMatrix3fv(u_matrixLoc, false, [clipWidth, 0, 0, 0, clipHeight, 0, clipX, clipY, 1]);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

i = 0;

lastTime = 0;

render = function() {
  requestAnimationFrame(render);
  variables.sinX = Math.sin(i);
  variables.sinY = Math.cos(i);
  createShaders();
  gl.uniform1f(gl.getUniformLocation(program, 'mouseY'), y);
  gl.uniform1f(gl.getUniformLocation(program, 'mouseX'), x);
  setTexture(true);
  return i += .05;
};

y = 0;

x = 0;

document.addEventListener('mousemove', function(event) {
  x = -.5 + event.clientX / canvas.width;
  return y = event.clientY / canvas.height;
});

image.onload = function() {
  createShaders();
  createGeometry();
  setTexture();
  render();
};
