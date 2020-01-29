'use strict';

// let N = process.argv[2];

function drawTriangle(n: number): void {
  for (let i: number = 0; i < n; i++) {
    let currentLine = '';
    for (let j: number = i; j < n; j++) {
      currentLine += ' ';
    }
    for (let j: number = n - i - 1; j < n; j++) {
      currentLine += '* ';
    }
    console.log(currentLine);
  }
}

function drawReflectedTriangle(n: number): void {
  for (let i: number = 0; i < n; i++) {
    let currentLine = '';
    for (let j: number = n - i - 1; j < n; j++) {
      currentLine += ' ';
    }
    for (let j: number = i; j < n; j++) {
      currentLine += '* ';
    }
    console.log(currentLine);
  }
}

function drawDiamond(n: number): void {
  if (n > 1 && n < 11) {
    drawTriangle(n);
    drawReflectedTriangle(n);
  } else {
    console.log('Invalid number of lines');
  }
}

export default drawDiamond;
