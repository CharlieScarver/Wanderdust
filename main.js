var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Set initial canvas size
resizeCanvas();

var input = new Input();
attachListeners(input);
attachControls();

var paused = false,
    ticksPassed = 0,
    cleanTicks = 30;

var particles = [];
var indexesToClean = [];
var drawLinesBetween = [];

function update() {
    tick();
    render(ctx);
    requestAnimationFrame(update);
}

function tick() {
    // Pausing
    if (input.o) {
        if (paused) {
            paused = false;
            input.o = false;
        } else {
            paused = true;
            input.o = false;
        }
    }

    if (paused) {
        return;
    }

    // Cleaning needs to happen before adding to drawLinesBetween to make sure indexes are right
    if (ticksPassed === cleanTicks) {
        indexesToClean.forEach(function(ind) {
            particles.splice(ind, 1);
        });
        indexesToClean.clear();
        ticksPassed = 0;
    }

    // Spawning new particles
    if (particles.length < Options.MaxParticles - Options.ParticlesCreatedPerSpawn) {
        var randomX, randomY;
        var canBeIdle = particles.filter(p => p.movement.idle).length < Options.MaxIdleParticles;

        // Spawn five at a time to spawn faster
        randomX = Math.floor(Math.floor(Math.random() * 10000) % canvas.width);
        randomY = Math.floor(Math.floor(Math.random() * 10000) % canvas.height);
        particles.push(new Particle(randomX, randomY, canBeIdle));

        randomX = Math.floor(Math.floor(Math.random() * 10000) % canvas.width);
        randomY = Math.floor(Math.floor(Math.random() * 10000) % canvas.height);
        particles.push(new Particle(randomX, randomY, canBeIdle));

        randomX = Math.floor(Math.floor(Math.random() * 10000) % canvas.width);
        randomY = Math.floor(Math.floor(Math.random() * 10000) % canvas.height);
        particles.push(new Particle(randomX, randomY, canBeIdle));

        randomX = Math.floor(Math.floor(Math.random() * 10000) % canvas.width);
        randomY = Math.floor(Math.floor(Math.random() * 10000) % canvas.height);
        particles.push(new Particle(randomX, randomY, canBeIdle));

        randomX = Math.floor(Math.floor(Math.random() * 10000) % canvas.width);
        randomY = Math.floor(Math.floor(Math.random() * 10000) % canvas.height);
        particles.push(new Particle(randomX, randomY, canBeIdle));
    }

    // Clear particles which are outside
    particles = particles.filter(x => !x.isOutside);

    // Update, mark for cleanup and mark near particles
    particles.forEach(function(p, index) {
        // Update particles
        p.update(canvas.width, canvas.height);
        // Check for nearby particles to draw lines
        particles.forEach(function(p2, index2) {
            if (p.isOutside || index === index2) {
                return;
            }
            var isNear = checkIfPointIsInsideACircle(p.position.x, p.position.y, p2.position.x, p2.position.y, Options.DrawLinesInRadius);
            if (isNear) {
                drawLinesBetween.push({ from: index, to: index2 });
            }
        });
    });

    ticksPassed++;
    updateShownValues();
}

function render(ctx) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pause text
    if (paused) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '40px Arial';
        ctx.fillText('Paused', canvas.width / 2 - 100, 250);
    }

    // Draw the lines
    ctx.strokeStyle = '#FFFFFF';
    drawLinesBetween.forEach(function(o) {
        // Lucky particles get colored lines
        if (particles[o.from].ID % 19 === 0) {
            ctx.strokeStyle = '#FF0000';
        }
        /*
        if (particles[o.from].ID % 37 === 0) {
            ctx.strokeStyle = '#00FF00';
        }
        if (particles[o.from].ID % 17 === 0) {
            ctx.strokeStyle = '#FFFF00';
        }
        if (particles[o.from].ID % 19 === 0) {
            ctx.strokeStyle = '#0000FF';
        }
        if (particles[o.from].ID % 15 === 0) {
            ctx.strokeStyle = '#00FFFF';
        }
        if (particles[o.from].ID % 13 === 0) {
            ctx.strokeStyle = '#FF00FF';
        }
        */
        // Draw line
        ctx.beginPath();
        ctx.moveTo(particles[o.from].position.x, particles[o.from].position.y);
        ctx.lineTo(particles[o.to].position.x, particles[o.to].position.y);
        ctx.stroke();
        // Back to the default color
        ctx.strokeStyle = '#FFFFFF';
    });
    drawLinesBetween.clear();

    // Render particles
    particles.forEach(function(p) {
        p.render(ctx);
    });
}

update();
