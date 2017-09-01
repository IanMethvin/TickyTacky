function init() {
    var s = new CanvasState(document.getElementById('tickTack'));
    s.drawBoard();
}

function reinit(cState) {
    cState.ctx.clearRect(0, 0, cState.width, cState.height);
    cState.drawBoard();
    cState.moves = [];
    cState.isX = 1;
}

function Symbol(x, y) {
    this.centerX = x;
    this.centerY = y;
    this.distFromCenter = 38;
    this.lineWidth = 3;
}

function O(x, y) {
    Symbol.call(this, x, y);
}

O.prototype.draw = function(ctx) {
    var x = this.centerX;
    var y = this.centerY;
    var l = this.distFromCenter;

    ctx.beginPath();
    ctx.arc(x, y, l, 0, 2*Math.PI);
    ctx.stroke();
}

function X(x, y) {
    Symbol.call(this, x, y);
}

X.prototype.draw = function(ctx) {
    var x = this.centerX;
    var y = this.centerY;
    var l = this.distFromCenter;

    ctx.beginPath();
    ctx.moveTo(x - l, y - l);
    ctx.lineTo(x + l, y + l);
    ctx.moveTo(x + l, y - l);
    ctx.lineTo(x - l, y + l);
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();
}

function CanvasState(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.isX = 1;
    this.moves = [];
    var cState = this;

    canvas.addEventListener('mousedown', function(e) {
        var mouse = cState.getMouse(e);
        var quad = cState.quadrant(mouse.x, mouse.y);

        if (quad && !cState.moveMade(quad)) {
            cState.makeMove(quad);
            setTimeout(function(){
                cState.aiMove();
            }, 350);
        }
    }, true);
      
    document.getElementById('restart').addEventListener('click', function (event) {
        reinit(cState);
    }, true);

    window.addEventListener('keyup', function(e) {
        if (e.which == 27) {
            reinit(cState);
        }
    }, true);
}

CanvasState.prototype.moveMade = function(quad) {
    return this.moves.contains(quad);
}

CanvasState.prototype.makeMove = function(quad) {
    var cState = this;
    cState.moves.push(quad);
    if (cState.isX) {
        var x = new X(quad.x, quad.y);
        x.draw(cState.ctx);
    }
    else {
        var o = new O(quad.x, quad.y);
        o.draw(cState.ctx);
    }
    //switch turns
    cState.isX = !cState.isX;
}

CanvasState.prototype.aiMove = function() {
    var cState = this;
    var rMove = getRandomMove(cState); //random click
    var pMove = cState.quadrant(rMove.x, rMove.y); //possible move
    while (cState.moveMade(pMove)) {
        rMove = getRandomMove(cState); 
        pMove = cState.quadrant(rMove.x, rMove.y);
    }
    cState.makeMove(pMove);
}

function getRandomMove(cState) {
    var move = 
    {
        x: randomIntFromInterval(0, cState.width),
        y: randomIntFromInterval(0, cState.height)
    };
    return move;
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

CanvasState.prototype.quadrant = function(x, y) {
    var maxX = this.width;
    var maxY = this.height;
    var qW = maxX / 3; //width of each quadrant
    var qH = maxY / 3; //height of each quadrant
    var xCenter = qW / 2; //x center of quadrant
    var yCenter = qH / 2 //y center of quadrant

    var xCord = (Math.floor(x / qW) * qW) + xCenter;
    var yCord = (Math.floor(y / qH) * qH) + yCenter;

    return { x: xCord, y: yCord }
}

CanvasState.prototype.drawBoard = function() {
    var ctx = this.ctx;
    var w = this.width;
    var h = this.height;
    var qW = w / 3; //width of each quadrant
    var qH = h / 3; //height of each quadrant
    ctx.beginPath();
    //vertical left
    ctx.moveTo(qW, 0);
    ctx.lineTo(qW, w);
    // //vertical right
    ctx.moveTo(w - qW, 0);
    ctx.lineTo(w - qW, w);
    // //horizontal top
    ctx.moveTo(0, qH);
    ctx.lineTo(h, qH);
    // //horizontal bottom
    ctx.moveTo(0, h - qH);
    ctx.lineTo(h, h - qH);

    ctx.lineWidth = 5;
    ctx.stroke();
}

CanvasState.prototype.getMouse = function(e) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
    
    // Compute the total offset
    if (element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }
  
    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
    
    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my};
  }

Array.prototype.contains = function(item) {
    for (arr = 0; arr < this.length; arr++) {
        if (this[arr].x == item.x && this[arr].y == item.y)
            return true;
    }
    return false;
}

