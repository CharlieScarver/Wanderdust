var Particle = (function() {
    Particle.prototype.Count = 0;

    function Particle(x, y) {
        this.ID = ++Particle.prototype.Count;
        this.position = {
            x: x,
            y: y
        };
        this.movement = {
            left: false,
            right: false,
            up: false,
            down: false,
            idle: false
        };

        this.width = 1;
        this.height = 1;
        this.minVelocity = 0;
        this.maxVelocity = 4;
        this.velocityX = Math.floor(Math.floor(Math.random()*100) % this.maxVelocity) + this.minVelocity;
        this.velocityY = Math.floor(Math.floor(Math.random()*100) % this.maxVelocity) + this.minVelocity;

        this.ticksNeededToChange = 100000;
        this.ticksPassed = 0;

        this.isOutside = false;

        this.randomizeMovement();
        //console.log(this.ID);
    }

    Particle.prototype.randomizeMovement = function() {
        this.movement = {
            left: false,
            right: false,
            up: false,
            down: false,
            idle: false
        };

        var random = Math.floor(Math.floor(Math.random()*100) % 13);
        switch (random) {
            case 1:
                this.movement.left = true;
                break;
            case 2:
                this.movement.right = true;
                break;
            case 3:
                this.movement.up = true;
                break;
            case 4:
                this.movement.down = true;
                break;
            case 5:
            case 6:
                this.movement.left = true;
                this.movement.up = true;
                break;
            case 7:
            case 8:
                this.movement.left = true;
                this.movement.down = true;
                break;
            case 9:
            case 10:
                this.movement.right = true;
                this.movement.up = true;
                break;
            case 11:
            case 12:
                this.movement.right = true;
                this.movement.down = true;
                break;
            case 0:
                this.movement.idle = true;
        };

        this.velocityX = Math.floor(Math.floor(Math.random()*100) % this.maxVelocity) + this.minVelocity;
        this.velocityY = Math.floor(Math.floor(Math.random()*100) % this.maxVelocity) + this.minVelocity;
    }

    Particle.prototype.update = function(width, height) {
        if (this.position.x < 0 || this.position.x > width ||
            this.position.y < 0 || this.position.y > height) {
            this.isOutside = true;
            //console.log(this.ID + ' is out');
            //return;
        }

        // randomize stuff
        if (this.ticksPassed === this.ticksNeededToChange) {
            //this.randomizeMovement();
            this.ticksPassed = 0;
        }

        // movement
        if(this.movement.left) {
            this.position.x -= this.velocityX;
        }
        if(this.movement.right) {
            this.position.x += this.velocityX;
        }
        if(this.movement.up) {
            this.position.y -= this.velocityY;
        }
        if(this.movement.down) {
            this.position.y += this.velocityY;
        }

        // tick
        this.ticksPassed++;
    };


    Particle.prototype.render = function(ctx) {
        if (this.isOutside) {  
            return; 
        }

        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    };

    return Particle;
}());