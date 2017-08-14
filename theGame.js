
	var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    function Game() {
        this.score = 0;
        this.lives = 2;
        this.theBallIsSticked = true;
        this.balls = [ new Ball() ],
        this.allLevels = [ new LevelOne(), new LevelTwo() ];
        this.currentLevel = this.allLevels[0];
        this.mainGameColor = "#0095DD";
        this.mainInterval = null;
        this.currentLevelNumber = 0;
        this.addScore = function(brick) {
            this.score += this.currentLevel.changeStatus(brick);
            if(this.currentLevel.levelEndCheck()) {
                this.nextLevel();
            }
        };
        this.nextLevel = function() {
            this.currentLevelNumber++;
            if (!(this.allLevels[this.currentLevelNumber]) )
                this.wonAGame();
            else {
                textHelper.addFade('Level ' + (this.currentLevelNumber + 1));
                this.currentLevel = (this.allLevels[this.currentLevelNumber]);
                this.currentLevel.bricksInit();
                this.stateReset();
            }
        };
        this.loseAGame = function() {
            textHelper.loseAGame();
            this.endGame();
        };
        this.wonAGame = function() {
            textHelper.wonAGame();
            this.endGame();
        };
        this.endGame = function() {      
            textHelper.drawFading();
            textHelper.drawScore();
            drawVar = this.drawEndGame;
        };
        this.drawEndGame = function() {
        };
        this.stateReset = function() {
            ball.posReset();
            paddle.posReset();
            this.theBallIsSticked = true;
        },
        this.ballDrop = function() {
            this.lives--;
            if(!this.lives) {
                this.loseAGame();
            }
            else {
                this.stateReset();
            }
        };
        this.ballHitsAPaddle = function() {
            ball.hitsAPaddle();
        };
        this.bricksCollision = function() {
            for(var c = 0; c < theGame.currentLevel.bricks.length; c++) {
                for(var r = 0; r < theGame.currentLevel.bricks[c].length; r++) {
                    var b = theGame.currentLevel.bricks[c][r];
                    if(b.status == 1) {
                        ball.brickCollision(b) ? this.addScore(b) : 0;
                    }
                }
            }
        }
    };

    function TextHelperClass() {
        this.captionColor = "rgba(0, 101, 150, 1)"; //#006596
        this.fadeText = { text: 'Level 1', fontsize: '26px', durationStep: 1/80, durationLeft: 1 };
        this.addFade = function(txt, fnt = '26px', dur = 80) {
            this.fadeText = { text: txt, fontsize: fnt, durationStep: 1/dur, durationLeft: 1 };   
        };
        this.drawFading = function() {
            if (this.fadeText.durationLeft > 0) {
                ctx.font = this.fadeText.fontsize + " Arial Black";
                ctx.fillStyle = "rgba(0, 101, 150, " + this.fadeText.durationLeft + ")";
                this.fadeText.durationLeft -= this.fadeText.durationStep;
                ctx.textAlign="center";
                ctx.fillText(this.fadeText.text, canvas.width/2, canvas.height/2);     
            }
        };
        this.drawScore = function(score) {
            ctx.font = "16px Arial";
            ctx.fillStyle = this.captionColor;
            ctx.textAlign="left";
            ctx.fillText("Score: " + score, 8, 20);
        };
        this.drawLives = function(lives) {
            ctx.font = "16px Arial";
            ctx.fillStyle = this.captionColor;
            ctx.textAlign="left";
            ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
        };
        this.loseAGame = function() {
            this.addFade("GAME OVER", "20px");
        };
        this.wonAGame = function() {
            this.addFade("YOU WON, CONGRATULATIONS!", "20px");
        };
    };

    function Ball() {
        this.x = canvas.width/2;
        this.y = canvas.height-30;
        this.dxSpeed = 3;
        this.dySpeed = -3;
        this.dx = this.dxSpeed;
        this.dy = this.dySpeed;
        this.radius = 10;
        this.sticked = true;

        this.drawBall = function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fillStyle = theGame.mainGameColor;
            ctx.fill();
            ctx.closePath();
        };

        this.hitAWallCollision = function() {
            if(this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {
                this.dx = -this.dx;
            }
            if(this.y + this.dy < this.radius) {
                this.dy = -this.dy;
            } else if(this.y + this.dy > canvas.height - this.radius) {
                theGame.ballDrop();
            }
        };

        this.mustGoOn = function() {
            if (!theGame.theBallIsSticked) {
                this.x += this.dx;
                this.y += this.dy;
            }
        };
        
        this.posReset = function() {
            this.x = canvas.width/2;
            this.y = canvas.height-30;
            this.dx = this.dxSpeed;
            this.dy = this.dySpeed;
        };

        this.hitsAPaddle = function() {
            if(this.y + this.dy > canvas.height - this.radius - paddle.paddleHeight) {
                if(this.x > paddle.paddleX && this.x < paddle.paddleX + paddle.paddleWidth) {
                    this.dy = -this.dy;                    
                    for (var i = 0; i < paddle.segments*2; i++) {
                        if (this.x > paddle.paddleX + ( i ) * paddle.paddleWidth/(paddle.segments*2) && 
                            this.x < paddle.paddleX + (i+1) * paddle.paddleWidth/(paddle.segments*2)) {
                                var mult = (-1)*paddle.segments + i;
                                this.dx = this.dxSpeed*( mult >= 0 ? mult + 1 : mult );
                                break;
                        }
                    }                 
                }
            }
        };

        this.brickCollision = function(b) {
            //вертикальная коллизия
            if (this.x > b.x && this.x < b.x + b.width)
            {
                if (this.y - this.radius < b.y + b.height && this.y - this.radius > b.y) {
                    if (this.dy > 0)
                        this.dx = -this.dx;
                    else 
                        this.dy = -this.dy;
                    return true;
                } else if (this.y + this.radius > b.y && this.y + this.radius < b.y + b.height) {
                    if (this.dy < 0)
                        this.dx = -this.dx;
                    else 
                        this.dy = -this.dy;
                    return true;
                }
            } else //горизонтальная коллизия
            if ((this.y > b.y && this.y < b.y + b.height) && ( 
                    (this.x - this.radius < b.x + b.width && this.x - this.radius > b.x) ||
                    (this.x + this.radius > b.x && this.x + this.radius < b.x + b.width))
                    ) { 
                this.dx = -this.dx;
                return true;
            }
            return false;
        };
    }; 

    function Paddle() {
        this.paddleHeight = 10;
        this.paddleWidth = 75;
        this.paddleX = (canvas.width - this.paddleWidth)/2;
        this.keyboardMoveSpeed = 7;
        this.segments = 3;
        this.rightPressed = false;
        this.leftPressed = false;
        this.stickedBalls = [];
        this.readyToStick = false;
        this.isControllerByMouse = true;
        this.isControllerByKeyboard = true;

        this.drawPaddle = function() {
            ctx.beginPath();
            ctx.rect(this.paddleX, canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
            ctx.fillStyle = theGame.mainGameColor;
            ctx.fill();
            ctx.closePath();
        };
        this.ballHits = function(ball) {
            if (this.readyToStick) {
                this.stickBall(ball);
            }
        };
        this.unstick = function() {

        };
        this.stickBall = function() {

        };
        this.move = function(x) {
            this.paddleX = x;
            this.stickedBalls.forEach(function(element) {
                if (element.sticked) {
                    element.x = this.paddleX + this.paddleWidth/2;
                }
            }, this);
        };
        this.movedByKeyboard = function() {
            if (this.isControllerByKeyboard) {
                if(this.rightPressed && this.paddleX < canvas.width - this.paddleWidth) {
                    this.move(this.paddleX + this.keyboardMoveSpeed);
                }
                else if(this.leftPressed && this.paddleX > 0) {
                    this.move(this.paddleX - this.keyboardMoveSpeed);
                }
            }
        };
        this.mouseMoved = function(e) {
            if (this.isControllerByMouse) {
                var relativeX = e.clientX - canvas.offsetLeft;
                if(relativeX > 0 && relativeX < canvas.width) {
                    this.move(relativeX - this.paddleWidth/2);
                }
            }
        };
        this.keyHandler = function(key, dir) {
            if(key == 39) {
                this.rightPressed = dir;
            }
            else if(key == 37) {
                this.leftPressed = dir;
            }
        };
        this.posReset = function() {
            this.paddleX = (canvas.width - this.paddleWidth)/2;
        }
    };

    

    var theGame = new Game();

    var ball = new Ball(); 
    var paddle = new Paddle();
    var textHelper = new TextHelperClass();
    theGame.currentLevel.bricksInit();

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ball.drawBall();
        paddle.drawPaddle();        
        //drawBricks();
        theGame.currentLevel.drawBricks();
        textHelper.drawScore(theGame.score);
        textHelper.drawLives(theGame.lives);
        textHelper.drawFading();
        theGame.bricksCollision();
        //collisionDetection();        
        paddle.movedByKeyboard();
        ball.hitAWallCollision();
        theGame.ballHitsAPaddle();        
        ball.mustGoOn(); // \m/
        requestAnimationFrame(drawVar);
    }

    var drawVar = draw;

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener("mouseup", mouseUpHandler, false);
    document.addEventListener("keypress", keypressHandler, false);
    function mouseMoveHandler(e) {
        paddle.mouseMoved(e);
    }
    function keyDownHandler(e) {        
        paddle.keyHandler(e.keyCode, true);
    }
    function keyUpHandler(e) {        
        paddle.keyHandler(e.keyCode, false);        
    }
    function mouseUpHandler(e) {
        theGame.theBallIsSticked = false;
        paddle.unstick();
    }
    function keypressHandler(e) {
        if ((e.keyCode == 101) || (e.keyCode == 1091)) {
            ExplodeBonus.explode(theGame);
        }
    }

    //mainInterval = setInterval(draw, 10);
    draw();

