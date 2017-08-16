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

        this.hitsAPaddle = function(paddle) {
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