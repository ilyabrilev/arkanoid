class Brick {
    constructor(type) {
        this.type = type;
        this.width = 75;
        this.height = 20;
        this.padding = 10;
        this.offsetTop = 30;
        this.offsetLeft = 30;
        this.status = 1;
        this.x = 0;
        this.y = 0;
        this.color = "#0095DD";
    }
    draw() {
        if(this.status == 1) {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }
    changeStatus() {
        this.status = 0;
    }
}

class SimpleBrick extends Brick {
    constructor(col, row, color) {
        super("Simple");
        this.x = (col * (this.width + this.padding)) + this.offsetLeft;
        this.y = (row * (this.height + this.padding)) + this.offsetTop;
        this.color = color;
    }
}

class StickBrick extends Brick {
    constructor(col, row, color) {
        super("Stick");
        this.width = 70;
        this.x = (col * (this.width)) + this.offsetLeft;
        this.y = (row * (this.height)) + this.offsetTop;
        this.color = color;
    }
}

class ColorSwitcher {
    constructor(base, other) {
        this.baseColor = base;
        this.otherColor = other;
        this.currentColor = other;
    }
    next() {
        if (this.currentColor == this.baseColor)
            this.currentColor = this.otherColor;
        else this.currentColor = this.baseColor;
        return this.currentColor;
    }
    resetState() {
        this.currentColor = other;
    }
}

class Level {
    constructor(name) {
        this.name = name;
        this.bricks = [];
        this.brickAmonth = 0;
        this.levelScore = 0;
    }
    bricksInit() {}
    drawBricks() {
        for(var c = 0; c < this.bricks.length; c++) {
            for(var r = 0; r < this.bricks[c].length; r++) {
                this.bricks[c][r].draw();
            }
        }
    }
    changeStatus(brick) {
        brick.changeStatus();
        if (brick.status == 0) {
            this.levelScore++;
        }
    }
    levelEndCheck() {
        if (this.levelscore >= this.brickAmonth)
            return true;
        else 
            return false;
    }
}

class LevelOne extends Level{
    constructor() {
        super("One");
    }
    bricksInit() {
        var brickRowCount = 3;
        var brickColumnCount = 5;
        var color = new ColorSwitcher("#0095dd", "#00db0e");

        for(var c = 0; c < brickColumnCount; c++) {
            this.bricks[c] = [];
            for(var r = 0; r < brickRowCount; r++) {
                this.bricks[c][r] = new SimpleBrick(c, r, color.next());                    
                this.brickAmonth++;
            }
        }
    }
}

class LevelTwo extends Level{
    constructor() {
        super("One");
    }
    bricksInit() {
        var brickRowCount = 5;
        var brickColumnCount = 6;
        var color = new ColorSwitcher("#0095DD", "#00db0e");
        for(var c = 0; c < brickColumnCount; c++) {
            this.bricks[c] = [];
        }
        var rowSub = [2, 1, 0, 1, 2, 3];
        for(var r = 0; r < brickRowCount; r++) {
            for(var c = rowSub[r]; c < brickColumnCount - rowSub[r]; c++) {                    
                this.bricks[c][this.bricks[c].length] = new StickBrick(c, r, color.next());
                this.brickAmonth++;
            }
        }
    }
}