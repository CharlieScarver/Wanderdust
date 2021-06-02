var Particle = (function() {
    Particle.prototype.Count = 0;

    function Particle(x, y, canBeIdle, debug = false) {
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
        this.minVelocity = Options.MinParticleVelocity;
        this.maxVelocity = Options.MaxParticleVelocity;
        // Max Velocity = maxVelocity + minVelocity - 1

        this.ticksNeededToChange = 100000;
        this.ticksPassed = 0;

        this.isOutside = false;
        this.canBeIdle = canBeIdle;

        this.debug = debug;

        this.randomizeMovement();
    }

    Particle.prototype.randomizeMovement = function() {
        this.movement = {
            left: false,
            right: false,
            up: false,
            down: false,
            idle: false
        };

        var random = Utils.generateNumber(Options.SpawnIdleParticles && this.canBeIdle ? 0 : 1, 12);

        switch (random) {
            case 0:
                this.movement.idle = true;
                break;
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
        };

        this.velocityX = Math.floor(Math.floor(Math.random() * 100) % this.maxVelocity) + this.minVelocity;
        this.velocityY = Math.floor(Math.floor(Math.random() * 100) % this.maxVelocity) + this.minVelocity;
    }

    Particle.prototype.update = function(width, height) {
        this.isOutside = false;

        if (this.position.x < 0 || this.position.x > width ||
            this.position.y < 0 || this.position.y > height) {
            this.isOutside = true;
        }

        // Randomize stuff
        if (this.ticksPassed === this.ticksNeededToChange) {
            this.ticksPassed = 0;
        }

        // Movement
        if (this.movement.left) {
            this.position.x -= this.velocityX;
        }
        if (this.movement.right) {
            this.position.x += this.velocityX;
        }
        if (this.movement.up) {
            this.position.y -= this.velocityY;
        }
        if (this.movement.down) {
            this.position.y += this.velocityY;
        }

        // Tick
        this.ticksPassed++;
    };

    Particle.prototype.render = function(ctx) {
        if (this.debug) {
            ctx.fillStyle = '#FFFF00';
            ctx.fillRect(this.position.x, this.position.y, 5, 5);
            return;
        }

        if (!Options.DrawParticles || this.isOutside) {
            return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    };

    Particle.prototype.log = function() {
        if (!this.debug) {
            return;
        }
        console.log(...arguments);
    }

    return Particle;
}());