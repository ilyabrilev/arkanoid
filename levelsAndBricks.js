class Brick {
    constructor(type, col, row, color) {
        this.type = type;
        this.width = 70;
        this.height = 20;
        this.padding = 10;
        this.offsetTop = 30;
        this.offsetLeft = 30;
        this.status = 1;
        this.x = (col * (this.width)) + this.offsetLeft;
        this.y = (row * (this.height)) + this.offsetTop;
        this.color = color;
        this.scoreValue = 1;
    }
    draw() {
        if(this.status != 0) {
            this.drawARect(this.x, this.y, this.width, this.height, this.color);
        }
    }
    drawARect(x, y, width, height, color) { //megusta.jpg
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
    changeStatus() {
        if (this.status != 0) {
            this.status--;
            return this.scoreValue;
        }
        return 0;
    }
}

class SimpleBrick extends Brick {
    constructor(col, row, color) {
        super("Simple", col, row, color);
        this.width = 75;
        this.x = (col * (this.width + this.padding)) + this.offsetLeft;
        this.y = (row * (this.height + this.padding)) + this.offsetTop;
        
    }
}

class StickBrick extends Brick {
    constructor(col, row, color) {        
        super("Stick", col, row, color);
    }
}

class InvisibleBrick extends Brick {    
    constructor(col, row, color) {
        super("Invisible", col, row, color);
        this.status = 2;
    }
    draw() {
        if (this.status == 1) {
            this.drawARect(this.x, this.y, this.width, this.height, this.color);
        }
    }
}

class ThreeLifeBrick extends Brick {
    constructor(col, row, color) {
        super("ThreeLife", col, row, color);
        this.status = 3;
    }    
    draw() {
        var color = this.color;
        switch (this.status) {            
            case 3:
                color = '#000';
                break;
            case 2:
                color = '#444';
                break;
            case 1:
                color = '#999';
                break;
        }
        if(this.status != 0) {
            this.drawARect(this.x, this.y, this.width, this.height, color);
        }
    }
}

class ColorSwitcher {
    constructor(colors) {
        this.baseColor = colors[0];
        this.otherColor = colors[1];
        this.currentColor = colors[1];
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
        this.bricksDestroyed = 0;
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
        var score = brick.changeStatus();
        if (brick.status == 0) {
            this.bricksDestroyed++;
        }
        return score;
    }
    levelEndCheck() {
        if (this.bricksDestroyed >= this.brickAmonth)
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
        var color = new ColorSwitcher(["#0095dd", "#00db0e"]);

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
        super("Two");
    }
    bricksInit() {
        var brickRowCount = 5;
        var brickColumnCount = 6;
        var color = new ColorSwitcher(["#0095DD", "#00db0e"]);
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

class LevelThree extends Level{
    constructor() {
        super("Three");
    }
    bricksInit() {
        var brickColumnCount = 6;        
        for(var c = 0; c < brickColumnCount; c++) {
            this.bricks[c] = [];
            this.bricks[c][0] = new StickBrick(c, 0, "#0095DD");
            this.bricks[c][1] = new StickBrick(c, 1, "#00db0e");
            this.bricks[c][2] = new StickBrick(c, 2, "#0095DD");
            this.bricks[c][3] = new ThreeLifeBrick(c, 3, "#0095DD");
            this.bricks[c][4] = new InvisibleBrick(c, 4, "#00db0e");
            this.brickAmonth += 5;
        }   
    }
}


class Bonuses {

}

class ExplodeBonus extends Bonuses {
    static explode(game) {
        game.currentLevel.bricks.forEach(function(element) {
            element.forEach(function(element) {
                game.addScore(element);
            }, this);            
        }, this);
    }
}

