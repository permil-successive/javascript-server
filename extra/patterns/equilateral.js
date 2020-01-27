'use strict'

let N = process.argv[2];

function drawTriangle(n) {
  for(var i=0;i<n;i++) {
    let currentLine = "";
    for(var j=i; j<n;j++) {
      currentLine += " ";
    }
    for(var j=n-i-1; j<n;j++) {
      currentLine += "* ";
    }
    console.log(currentLine);
  }
}

function drawEquilateralTriangle(n) {
  if(n > 1 && n <11) {
    drawTriangle(n);
  } else {
    console.log("Invalid number of lines");
  }
}

export default drawEquilateralTriangle;
