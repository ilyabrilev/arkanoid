
	var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    function Game(gameStarted = false, twoPlayers = false) {
        this.score = 0;
        this.lives = 2;
        this.mainGameColor = "#0095dd";
        this.secondaryColor = "#00db0e";
        this.balls = [ new Ball() ],
        this.allLevels = [ new LevelOne(), new LevelTwo(), new LevelThree() ];
        if (!gameStarted) {
            this.paddles = [ new Paddle(this.balls, false, false) ];
        } else {
            if (!twoPlayers) {
                this.paddles = [ new Paddle(this.balls, true, true) ];
            }
            else {            
                this.paddles = [ new Paddle(this.balls, true, false, this.mainGameColor),
                    new Paddle([], false, true, this.secondaryColor) ];
            }
        }
        this.currentLevel = this.allLevels[0];        
        //this.mainInterval = null;
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
            this.balls.forEach(function(ball) {
                ball.posReset();
            }, this);            
            this.paddles.forEach(function(paddle) {
                paddle.posReset([]);
            }, this);
            if (this.paddles[0]) {
                this.paddles[0].posReset(this.balls);
            }
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
            this.paddles.forEach(function(paddle) {
                this.balls.forEach(function(ball) {
                    ball.hitsAPaddle(paddle);
                }, this);
            }, this);
        };
        this.bricksCollision = function() {
            this.balls.forEach(function(oneBall) {
                for(var c = 0; c < theGame.currentLevel.bricks.length; c++) {
                    for(var r = 0; r < theGame.currentLevel.bricks[c].length; r++) {
                        var b = theGame.currentLevel.bricks[c][r];
                        if(b.status != 0) {
                            oneBall.brickCollision(b) ? this.addScore(b) : 0;
                        }
                    }
                }
            }, this);
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

            theGame.paddles.forEach(function(paddle) {
                paddle.drawPaddle();
                paddle.movedByKeyboard();
            }, this);

            theGame.ballHitsAPaddle();

            theGame.balls.forEach(function(ball) {                
                ball.drawBall();
                ball.hitAWallCollision();        
                ball.mustGoOn(); // \m/
            }, this);

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

    var theGame = new Game();
    /*var ball = new Ball(); 
    var paddle = new Paddle([ball], false, false);*/
    var textHelper = new TextHelperClass('WELCOME TO A GAME!', '26px', -1001);

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener("mouseup", mouseUpHandler, false);
    document.addEventListener("keypress", keypressHandler, false);
    function mouseMoveHandler(e) {
        theGame.paddles.forEach(function(paddle) {
            paddle.mouseMoved(e);
        }, this);
    }
    function keyDownHandler(e) {
        theGame.paddles.forEach(function(paddle) {
            paddle.keyHandler(e.keyCode, true);
        }, this);
    }
    function keyUpHandler(e) {
        theGame.paddles.forEach(function(paddle) {
            paddle.keyHandler(e.keyCode, false);
        }, this);
    }
    function mouseUpHandler(e) {
        theGame.paddles.forEach(function(paddle) {
            paddle.unstick('mouse');
        }, this);
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
        //space
        if (e.keyCode == 32 ) {
            theGame.paddles.forEach(function(paddle) {
                paddle.unstick('kb');
            }, this);
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

    function GameRestart(twoP) {
        theGame.endGame(); 
        theGame = new Game(true, twoP); 
        /*ball = new Ball(); 
        paddle = new Paddle([ball], true, false);*/
        textHelper = new TextHelperClass('Level 1');
        //theGame.draw(); 
    }
