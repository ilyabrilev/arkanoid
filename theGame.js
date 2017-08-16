
	var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    function Game(gameStarted = false, twoPlayers = false) {
        this.score = 0;
        this.lives = 2;
        this.mainGameColor = "#0095dd";
        this.secondaryColor = "#00db0e";
        this.balls = [ new Ball() ],
        this.allLevels = [ new LevelOne(), new LevelTwo(), new LevelThree() ];
        this.paddles = [ new Paddle(this.balls, !gameStarted, !gameStarted) ];
        if (twoPlayers) {
            this.paddles = [ new Paddle(this.balls, true, false, this.mainGameColor),
                 new Paddle(this.balls, false, true, this.secondaryColor) ];
        }
        this.currentLevel = this.allLevels[0];        
        this.mainInterval = null;
        this.currentLevelNumber = 0;
        this.currentLevel.bricksInit();
        this.isStopped = false;
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
            textHelper.drawScore(this.score);
            this.drawVar = this.drawEndGame;
        };
        this.drawEndGame = function() {
        };
        this.stateReset = function() {
            ball.posReset();
            paddle.posReset([ball]);
        };
        this.createBallTwins = function() {
            this.balls.forEach(function(element) {
                element.createATwinn();
            }, this);
        };
        this.ballDrop = function(ball) {
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
                    if(b.status != 0) {
                        ball.brickCollision(b) ? this.addScore(b) : 0;
                    }
                }
            }
        };
        this.stopSwitcher = function() {
            if (this.isStopped) {
                this.drawVar = this.draw;
                this.draw();
            }
            else {
                this.drawVar = this.drawEndGame;                
            }
            this.isStopped = !this.isStopped;
        };
        this.draw = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            theGame.currentLevel.drawBricks();
            textHelper.drawScore(theGame.score);
            textHelper.drawLives(theGame.lives);
            textHelper.drawFading();
            theGame.bricksCollision();
            paddle.drawPaddle();
            paddle.movedByKeyboard();
            theGame.ballHitsAPaddle();
            ball.drawBall();
            ball.hitAWallCollision();        
            ball.mustGoOn(); // \m/
            requestAnimationFrame(theGame.drawVar);
        };
        this.drawVar = this.draw;
    };

    function TextHelperClass(initText, initFnt = '26px', initDur = 80) {
        this.captionColor = "rgba(0, 101, 150, 1)"; //#006596        
        this.addFade = function(txt, fnt = '26px', dur = 80) {
            this.fadeText = { text: txt, fontsize: fnt, durationStep: 1/dur, durationLeft: 1 };   
        };
        this.addFade(initText, initFnt, initDur);
        this.drawFading = function() {
            if ((this.fadeText.durationLeft > 0) || (this.fadeText.durationLeft == -1001)){
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
            this.addFade("YOU HAVE WON, CONGRATULATIONS!", "20px");
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

        this.bindedPaddle = null;

        this.bindPaddle = function(paddle) {
            this.bindedPaddle = paddle;
        };

        this.drawBall = function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fillStyle = theGame.mainGameColor;
            ctx.fill();
            ctx.closePath();
        };

        this.createATwinn = function() {
            var newball = new Ball();

            for (var attr in this) {
                if (newball.hasOwnProperty(attr)) newball[attr] = this[attr];
            }
            newball.sticked = false;
            newball.dx = -newball.dx;

            return newball;
        };

        this.hitAWallCollision = function() {
            if(this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {
                this.dx = -this.dx;
            }
            if(this.y + this.dy < this.radius) {
                this.dy = -this.dy;
            } else if(this.y + this.dy > canvas.height - this.radius) {
                theGame.ballDrop(this);
            }
        };

        this.mustGoOn = function() {
            if (!this.sticked) {
                this.x += this.dx;
                this.y += this.dy;
                if (this.bindedPaddle != null) {
                    this.bindedPaddle.move(this.x - this.bindedPaddle.paddleWidth/2);
                }
            }
        };
        
        this.posReset = function() {
            this.x = canvas.width/2;
            this.y = canvas.height-30;
            this.dx = this.dxSpeed;
            this.dy = this.dySpeed;
            if (this.bindedPaddle == null) {
                this.sticked = true;
            }
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

    function Paddle(balls, mouse = true, keyboard = true, color = "#0095DD") {
        this.paddleHeight = 10;
        this.paddleWidth = 75;
        this.paddleX = (canvas.width - this.paddleWidth)/2;
        this.keyboardMoveSpeed = 7;
        this.segments = 3;
        this.rightPressed = false;
        this.leftPressed = false;
        this.stickedBalls = balls;
        this.readyToStick = false;
        this.isControllerByMouse = mouse;
        this.isControllerByKeyboard = keyboard;
        this.color = color;

        this.drawPaddle = function() {
            ctx.beginPath();
            ctx.rect(this.paddleX, canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        };
        this.ballHits = function(ball) {
            if (this.readyToStick) {
                this.stickBall(ball);
            }
        };
        this.unstick = function() {
            this.stickedBalls.forEach(function(element) {
                element.sticked = false;
            });
            this.stickedBalls = [];
        };
        this.stickBall = function() {

        };
        this.move = function(x) {
            this.paddleX = x;
            //проверяем коллизию паддла с краем отрисовки, если есть - запускаем все шарики
            if ((this.paddleX < 0) || (this.paddleX + this.paddleWidth > canvas.width)) {
                this.stickedBalls.forEach(function(element) {
                    element.sticked = false;
                }, this);
                this.stickedBalls = [];
            }
            this.stickedBalls.forEach(function(element) {
                element.x = this.paddleX + this.paddleWidth/2;
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
        this.posReset = function(balls) {
            this.paddleX = (canvas.width - this.paddleWidth)/2;
            this.stickedBalls = balls;
        }


        if (!this.isControllerByMouse && !this.isControllerByKeyboard) {
            balls[0].bindPaddle(this);
            this.unstick();
        }
    };

    var theGame = new Game();
    var ball = new Ball(); 
    var paddle = new Paddle([ball], false, false);
    var textHelper = new TextHelperClass('WELCOME TO A GAME!', '26px', -1001);

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
        paddle.unstick();
    }
    function keypressHandler(e) {
        //e или у
        if ((e.keyCode == 101) || (e.keyCode == 1091)) {
            ExplodeBonus.explode(theGame);
        }
        //s или ы
        /*if ((e.keyCode == 115) || (e.keyCode == 1099)) {
            theGame.stopSwitcher();
        }*/
        //p или з
        if ((e.keyCode == 112) || (e.keyCode == 1079)) {
            theGame.stopSwitcher();
        }
        //n или т
        if ((e.keyCode == 110 ) || (e.keyCode == 1090)) {
            theGame.createBallTwins();
        }
    }
    /*
    function draw() {
        theGame.draw();
        requestAnimationFrame(drawVar);
    }
    var drawVar = draw;*/
    //mainInterval = setInterval(draw, 10);
    theGame.draw();

    function GameRestart() {
        theGame.endGame(); 
        theGame = new Game(true, false); 
        ball = new Ball(); 
        paddle = new Paddle([ball], true, false);
        textHelper = new TextHelperClass('Level 1');
        //theGame.draw(); 
    }
