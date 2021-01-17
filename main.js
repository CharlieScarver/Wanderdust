var Main = (function () {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // Set initial canvas size
    Controls.resizeCanvas();

    var input = new Input.Input();
    Input.attachListeners(input);
    Controls.attachControls();

    var particles = [];
    var linesToDraw = {};

    function update() {
        tick();
        render(ctx);
        requestAnimationFrame(update);
    }

    function tick() {
        var shouldSpawnDebugParticle = Options.SpawnDebugParticle;

        // Pausing
        if (input.o) {
            // Toggle pause
            Options.Paused = !Options.Paused;
            // Update checkbox
            Controls.Paused.checked = Options.Paused;
            // Reset input flag
            input.o = false;
        }

        // Spawning new particles
        if (particles.length < Options.MaxParticles - Options.ParticlesCreatedPerSpawn) {
            var randomX, randomY;
            var canBeIdle = particles.filter(function (p) { return p.movement.idle; }).length < Options.MaxIdleParticles;

            // Spawn a couple at a time to spawn faster
            for (var i = 0; i < Options.ParticlesCreatedPerSpawn; i++) {
                randomX = Math.floor(Math.floor(Math.random() * 10000) % canvas.width);
                randomY = Math.floor(Math.floor(Math.random() * 10000) % canvas.height);
                particles.push(new Particle(randomX, randomY, canBeIdle));
            }
        }

        // Clear particles which are outside
        particles = particles.filter(function (x) { return !x.isOutside; });
        shouldSpawnDebugParticle = shouldSpawnDebugParticle && !particles.some(p => p.debug);

        var addedLines = {};

        // Update, mark for cleanup and mark near particles
        particles.forEach(function (p, index) {
            if (!Options.Paused) {
                // Update particles
                p.update(canvas.width, canvas.height);
            }

            // Check for nearby particles to draw lines
            particles.forEach(function (p2, index2) {
                // Skip if the particle is outside the canvas or it is the same particle
                if (p.isOutside || index === index2) {
                    return;
                }

                var isNear = Utils.checkIfPointIsInsideACircle(p.position.x, p.position.y, p2.position.x, p2.position.y, Options.DrawLinesInRadius);
                if (isNear) {
                    // Skip if this line has already been added
                    var isAlreadyAdded = !!linesToDraw[index2 + '.' + index];
                    if (isAlreadyAdded) {
                        return;
                    }

                    var distance = Utils.distanceBetweenTwoPoints(p.position.x, p.position.y, p2.position.x, p2.position.y);
                    linesToDraw[index + '.' + index2] = { from: index, to: index2, distance: distance };
                }
            });
        });

        // Spawn debug particle if there isn't one (and if debug particle is enabled)
        if (shouldSpawnDebugParticle) {
            particles.push(new Particle(600, 350, false, true));
        }

        Controls.updateShownValues(particles);
    }

    function render(ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Pause text
        if (Options.Paused) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '20px Courier';
            ctx.fillText('Paused', canvas.width / 2 - 50, 50);
        }

        // Draw the lines
        for (var key in linesToDraw) {
            var o = linesToDraw[key];

            // Determine opacity percentage
            var percentage = 100 - Math.round(o.distance / Options.DrawLinesInRadius * 100);

            ctx.strokeStyle = createRGBAStylePercent(255, 255, 255, percentage);

            // Lucky particles get colored lines
            if (Options.SpawnLuckyParticles) {
                var luckyMode = Options.LuckyParticlesMode;
                if (luckyMode === "classic") {
                    if (particles[o.from].ID % 19 === 0) {
                        ctx.strokeStyle = createRGBAStylePercent(255, 0, 0, percentage);
                    }
                }
                else if (luckyMode === "fresh") {
                    if (particles[o.from].ID % 19 === 0) {
                        ctx.strokeStyle = createRGBAStylePercent(255, 0, 0, percentage);
                    }
                    else if (particles[o.from].ID % 17 === 0) {
                        ctx.strokeStyle = createRGBAStylePercent(255, 255, 0, percentage);
                    }
                    else if (particles[o.from].ID % 37 === 0) {
                        ctx.strokeStyle = createRGBAStylePercent(0, 255, 0, percentage);
                    }
                }
            }

            // Draw line
            ctx.beginPath();
            ctx.moveTo(particles[o.from].position.x, particles[o.from].position.y);
            ctx.lineTo(particles[o.to].position.x, particles[o.to].position.y);
            ctx.stroke();
        }

        // Render particles
        particles.forEach(function (p) {
            p.render(ctx);
        });

        // Render mouse lines
        if (Options.ConnectParticlesToMouse) {
            var cMouse = getCanvasMousePositon(canvas, Controls.MousePosition);
            if (!cMouse.isOOb) {
                particles.forEach((p) => {
                    var x1 = cMouse.x, y1 = cMouse.y;
                    var x2 = p.position.x, y2 = p.position.y;

                    var isNear = Utils.checkIfPointIsInsideACircle(x1, y1, x2, y2, Options.DrawLinesInRadius);
                    if (!isNear) {
                        return;
                    }

                    ctx.strokeStyle = createRGBAStylePercent(0, 0, 255, 99);

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                });
            }
        }

        // Clear the data about the lines
        linesToDraw = {};
    }

    function createRGBAStylePercent(r, g, b, aPercentage) {
        return `rgba(${r},${g},${b},0.${Utils.padStringLeft(aPercentage.toString(), 2, '0')})`;
    }

    function getCanvasMousePositon(canvas, screenCoordinates) {
        var rect = canvas.getBoundingClientRect();

        var scaledX = (screenCoordinates.X - rect.left) / (rect.right - rect.left) * canvas.width;
        var scaledY = (screenCoordinates.Y - rect.top) / (rect.bottom - rect.top) * canvas.height;

        return {
            x: (screenCoordinates.X - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (screenCoordinates.Y - rect.top) / (rect.bottom - rect.top) * canvas.height,
            isOOb: (scaledX < 0 || scaledY < 0) || (scaledX > canvas.width || scaledY > canvas.height)
        };
    }

    return {
        update
    }
}());

// Start the thing
Main.update();
