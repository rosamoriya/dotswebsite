// Global variables
var data = {
  canvas: null,
  ctx: null,
  clickedDot: null,
  dotsConnected: [],
  dots: [
    { x: 300, y: 380 + 40 }, //Botton center
    { x: 230 - 35, y: 320 + 20 }, //Botton left
    { x: 260 - 30, y: 250 - 30 }, //Left heart peak
    { x: 300, y: 290 - 10 }, //Top center
    { x: 340 + 30, y: 250 - 30 }, //Right heart peak
    { x: 370 + 35, y: 320 + 20 }, //Botton right
  ],
  // Sequence to form the heart shape
  correctOrder: [2, 3, 4, 5, 0, 1, 2],
};

// Draw instructions at the top of the canvas
function drawInstructions() {
  var instructions =
    "1.Connect the dots following the numbers to create a heart." +
    "\n2.If you connect them in the right order, there will be a surprise.";
  var lines = instructions.split("\n");
  var x = 50;
  var y = 50;

  data.ctx.font = "20px Arial";
  data.ctx.fillStyle = "black";
  data.ctx.textAlign = "left";

  // Loop through each line of the instructions and draw it
  for (var i = 0; i < lines.length; i++) {
    data.ctx.fillText(lines[i], x, y + i * 20); // Move down 20 pixels per line
  }
}

// Finds if circles are colliding
function circleCollision(c1, c2) {
  var a = c1.r + c2.r,
    x = c1.x - c2.x,
    y = c1.y - c2.y;

  if (a > Math.sqrt(x * x + y * y)) return true;
  else return false;
}

// Scales canvas
function prepCanvas() {
  var res = window.devicePixelRatio || 1,
    scale = 1 / res;
  data.canvas = document.getElementById("dots");
  data.ctx = data.canvas.getContext("2d");

  data.canvas.width = window.innerWidth * res;
  data.canvas.height = window.innerHeight * res;
  data.canvas.style.width = window.innerWidth + "px";
  data.canvas.style.height = window.innerHeight + "px";

  data.ctx.scale(res, res);

  data.canvas.addEventListener("mousedown", function (e) {
    checkForDot(e);
  });

  drawInstructions(); // Draw instructions when canvas is prepared
  drawDots(); // Then draw dots
}

// Draw the dots and draw sequence numbers on the side of the circles
function drawDots() {
  var i = 0;
  for (; i < data.dots.length; i++) {
    var d = data.dots[i];
    data.ctx.beginPath();
    data.ctx.arc(d.x, d.y, 10, 0, 2 * Math.PI);
    data.ctx.fillStyle = "#FF0000";
    data.ctx.fill();
    data.ctx.closePath();

    // Determine the sequence number from correctOrder
    var sequenceNumber = data.correctOrder.indexOf(i) + 1;

    // Draw the sequence number
    data.ctx.fillStyle = "black";
    data.ctx.font = "16px Arial";
    data.ctx.fillText(sequenceNumber.toString(), d.x + 12, d.y - 12);
  }
}

// Draw line that connects the dots
function drawLine(toDot) {
  data.ctx.beginPath();
  data.ctx.moveTo(data.clickedDot.x, data.clickedDot.y);
  data.ctx.lineTo(toDot.x, toDot.y);
  data.ctx.lineWidth = 5;
  data.ctx.strokeStyle = "#FF0000";
  data.ctx.stroke();
  data.ctx.closePath();
}

// Figures out if the user is clicking in the dot
function checkForDot(e) {
  var i = 0,
    col = null;
  for (; i < data.dots.length; i++) {
    var d = data.dots[i],
      c1 = { x: d.x, y: d.y, r: 10 },
      c2 = { x: e.pageX, y: e.pageY, r: 10 };
    if (circleCollision(c1, c2)) col = d;
  }
  if (col !== null) {
    if (data.clickedDot !== null) drawLine(col);
    data.clickedDot = col;
    data.dotsConnected.push(data.dots.indexOf(col));
    checkCompletion();
  } else data.clickedDot = null;
}

// Fills the heart
function fillHeart() {
  data.ctx.fillStyle = "#FF0000";
  data.ctx.beginPath();
  data.ctx.moveTo(
    data.dots[data.correctOrder[0]].x,
    data.dots[data.correctOrder[0]].y
  );
  data.correctOrder.slice(1).forEach((index) => {
    data.ctx.lineTo(data.dots[index].x, data.dots[index].y);
  });
  data.ctx.closePath();
  data.ctx.fill();
}

// Styles and places the text messages in the canvas
function displayMessage(message) {
  var x = 800;
  var y = 350;

  data.ctx.font = "20px Arial";
  var metrics = data.ctx.measureText(message);
  var textWidth = metrics.width;

  data.ctx.fillStyle = "#000";
  data.ctx.textAlign = "center";
  data.ctx.fillText(message, x, y);
}

// Clears the canvas and reset the game
function resetGame() {
  data.ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);
  data.clickedDot = null;
  data.dotsConnected = [];
  drawInstructions(); // Redraw instructions after clearing
  drawDots();
}

// Displays message once every dot is connected  in the correct order and the heart is filled, else it will display Try again and will reset
function checkCompletion() {
  if (data.dotsConnected.length === data.correctOrder.length) {
    var isCorrect = data.dotsConnected.every(
      (element, index) => element === data.correctOrder[index]
    );
    if (isCorrect) {
      fillHeart();
      displayMessage("Thank you for being the best teacher ♡");
    } else {
      displayMessage("Try again");
      setTimeout(resetGame, 2000);
    }
  }
}

prepCanvas();
drawDots();
