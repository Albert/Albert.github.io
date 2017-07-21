var unitSize = 30;
var row = 0;
var col = 0;
var rowCount, colCount;
var lastKey;
var drops = [];
var animationLength = 1000;
var furthestDistance;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  background(0);
  rowCount = Math.floor((windowHeight - 5) / unitSize) - 1;
  colCount = Math.floor((windowWidth - 5) / unitSize) - 1;
  drop(row, col);
  furthestDistance = dist(0, 0, rowCount, colCount);
  textSize(32);
  textAlign(RIGHT, BOTTOM);
}

function draw() {
  if (drops[0]) {
    var earliestHasExpired = (drops[0].time + animationLength) < millis();
    if (earliestHasExpired) {
      drops.shift();
    }
  }

  for (var i = 0; i <= rowCount; i++) {
    for (var j = 0; j <= colCount; j++) {
      var triggered = false;

      for (var d = 0; d < drops.length; d++) {
        // distance from this point to drop point
        var dis = dist(i, j, drops[d].dropRow, drops[d].dropCol);
        var normDis = map(dis, 0, furthestDistance, 0, 1);
        // time since animation
        var timeSince = map(millis(), drops[d].time, drops[d].time + animationLength, 0, 1);
        if (normDis > timeSince && normDis < timeSince + 0.025) {
          triggered = true;
        }
      }

      if (triggered) {
        fill(255, 0, 0);
      } else {
        fill(0, 0, 0);
      }

      rect(unitSize * j, unitSize * i, unitSize, unitSize);
    }
  }
  fill(255);
  rect(unitSize * col, unitSize * row, unitSize, unitSize);
  text("Supports: hjkl, bew, {}, 0^$, G & gg", windowWidth, windowHeight);
}

function drop(inRow, inCol) {
  var thisDrop = {
    time: millis(),
    dropRow: inRow,
    dropCol: inCol,
  };
  drops.push(thisDrop);
}

function keyTyped() {
  var originalCol = col;
  var originalRow = row;

  if (key == 'h') {
    col -= 1;
  } else if (key == 'j') {
    row += 1;
  } else if (key == 'k') {
    row -= 1;
  } else if (key == 'l') {
    col += 1;
  } else if (key == 'b') {
    col -= 5;
  } else if (key == 'e' || key == 'w') {
    col += 5;
  } else if (key == '{') {
    row -= 5;
  } else if (key == '}') {
    row += 5;
  } else if (key == 'G') {
    row = 999;
    col = 0;
  } else if (key == 'g') {
    if (lastKey == 'g') {
      row = 0;
      gCounter = 0;
      col = 0;
    }
  } else if (key == '0' || key == '^') {
    col = 0;
  } else if (key == '$') {
    col = colCount;
  }

  if (col < 0) {
    col = 0;
  }
  if (col > colCount) {
    col = colCount;
  }
  if (row < 0) {
    row = 0;
  }
  if (row > rowCount) {
    row = rowCount;
  }
  lastKey = key;
  if (originalRow != row || originalCol != col) {
    drop(row, col);
  }
}
