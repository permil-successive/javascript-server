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

if(N > 1 && N <11) {
  drawTriangle(N);
} else {
  console.log("Invalid number of lines");
}
