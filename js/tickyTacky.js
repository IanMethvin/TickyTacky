function init() {
    var s = new CanvasState(document.getElementById('tickTack'));
    s.drawBoard();
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
    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
    this.ctx = canvas.getContext('2d');
    var cState = this;
    var isX = 1;

    //alert(this.centerX + ", " + this.centerY);

    canvas.addEventListener('mousedown', function(e) {
        var mouse = cState.getMouse(e);
        var quad = cState.quadrant(mouse.x, mouse.y);

        //alert("(" + mouse.x + "," + mouse.y + ") " + quad.squar);
        if (quad) {
            if (isX) {
                var x = new X(quad.x, quad.y);
                x.draw(cState.ctx);
            }
            else {
                var o = new O(quad.x, quad.y);
                o.draw(cState.ctx);
            }
    
            //switch turns
            isX = !isX;
        }


      }, true);
}

CanvasState.prototype.quadrant = function(x, y) {
    var cX = this.centerX;
    var cY = this.centerY;
    var xDist = cX / 2 + 25; //+50 is temp
    var yDist = cX / 2 + 25;
    
    //better way to find quadrant (if all quads are equal size)
    //x / (max X / 3)
    //y / (may Y / 3)
    //will give quad as 0 based set (1,0) is quad 4

    if (y > 50 && y < 175) {
        if (x > 50 && x < 175)
            return { squar: 1, x: 113, y: 113 };
        if (x > 175 && x < 325)
            return { squar: 2, x: 250, y: 113 };
        if (x > 325 && x < 450)
            return { squar: 3, x: 390, y: 113 };
    }
    else if (y > 175 && y < 325) {
        if (x > 50 && x < 175)
            return { squar: 4, x: 113, y: 250 };
        if (x > 175 && x < 325)
            return { squar: 5, x: 250, y: 250 };
        if (x > 325 && x < 450)
            return { squar: 6, x: 390, y: 250 };
    }
    else if (y > 325 && y < 450) {
        if (x > 50 && x < 175)
            return { squar: 7, x: 113, y: 390 };
        if (x > 175 && x < 325)
            return { squar: 8, x: 250, y: 390 };
        if (x > 325 && x < 450)
            return { squar: 9, x: 390, y: 390 };
    }

}

CanvasState.prototype.drawBoard = function() {
    var ctx = this.ctx;
    ctx.beginPath();
    //vertical left
    ctx.moveTo(175, 50);
    ctx.lineTo(175, 450);
    //vertical right
    ctx.moveTo(325, 50);
    ctx.lineTo(325, 450);
    //horizontal top
    ctx.moveTo(50, 175);
    ctx.lineTo(450, 175);
    //horizontal bottom
    ctx.moveTo(50, 325);
    ctx.lineTo(450, 325);

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


