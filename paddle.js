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