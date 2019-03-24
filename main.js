var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Set initial canvas size
resizeCanvas();

var input = new Input();
attachListeners(input);
attachControls();

var paused = false;
var ticksPassed = 0;
var CLEAN_TICKS = 30;

var particles = [];
var indexesToClean = [];
var linesToDraw = {};

function update() {
    tick();
    render(ctx);
    requestAnimationFrame(update);
}

function tick() {
    var isThereADebugParticle = !Options.SpawnDebugParticle;

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

    // Cleaning needs to happen before adding to linesToDraw to make sure indexes are right
    if (ticksPassed === CLEAN_TICKS) {
        indexesToClean.forEach(function(ind) {
            particles.splice(ind, 1);
        });
        indexesToClean.clear();
        ticksPassed = 0;
    }

    // Spawning new particles
    if (particles.length < Options.MaxParticles - Options.ParticlesCreatedPerSpawn) {
        var randomX, randomY;
        var canBeIdle = particles.filter(function(p) { return p.movement.idle; }).length < Options.MaxIdleParticles;

        // Spawn a couple at a time to spawn faster
        for (var i = 0; i < Options.ParticlesCreatedPerSpawn; i++) {
            randomX = Math.floor(Math.floor(Math.random() * 10000) % canvas.width);
            randomY = Math.floor(Math.floor(Math.random() * 10000) % canvas.height);
            particles.push(new Particle(randomX, randomY, canBeIdle));
        }
    }

    // Clear particles which are outside
    particles = particles.filter(function(x) { return !x.isOutside; });

    // Update, mark for cleanup and mark near particles
    particles.forEach(function(p, index) {
        if (p.debug) {
            isThereADebugParticle = p.debug;
        }

        if (!paused) {
            // Update particles
            p.update(canvas.width, canvas.height);
        }

        // Check for nearby particles to draw lines
        particles.forEach(function(p2, index2) {
            // Skip if the particle is outside the canvas or it is the same particle
            if (p.isOutside || index === index2) {
                return;
            }

            var isNear = Utils.checkIfPointIsInsideACircle(p.position.x, p.position.y, p2.position.x, p2.position.y, Options.DrawLinesInRadius);
            if (isNear) {
                // Skip if this line has already been added
                var isAlreadyAdded = !!linesToDraw[index + '.' + index2];
                if (isAlreadyAdded) {
                    return;
                }

                var distance = Utils.distanceBetweenTwoPoints(p.position.x, p.position.y, p2.position.x, p2.position.y);
                linesToDraw[index + '.' + index2] = { from: index, to: index2, distance: distance };
            }
        });
    });

    // Spawn debug particle if there isn't one (and if debug particle is enabled)
    if (!isThereADebugParticle) {
        particles.push(new Particle(600, 350, false, true));
    }

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
        ctx.font = '20px Courier';
        ctx.fillText('Paused', canvas.width / 2 - 50, 50);
    }

    // Draw the lines
    for (var key in linesToDraw) {
        var o = linesToDraw[key];

        // Determine opacity percentage
        var percentage = 100 - Math.round(o.distance / Options.DrawLinesInRadius * 100);
        ctx.strokeStyle = `rgba(255,255,255,0.${Utils.padStringLeft(percentage.toString(), 2, '0')})`;

        // Lucky particles get colored lines
        if (particles[o.from].ID % 19 === 0) {
            ctx.strokeStyle = `rgba(255,0,0,0.${Utils.padStringLeft(percentage.toString(), 2, '0')})`;
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
    }

    // Render particles
    particles.forEach(function(p) {
        p.render(ctx);
    });

    // Clear the data about the lines
    linesToDraw = {};
}

update();
