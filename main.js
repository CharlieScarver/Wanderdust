var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var input = new Input();
attachListeners(input);

var paused = false,
    ticksPassed = 0,
    cleanTicks = 30;

var particlesToSpawn = 450;
var particles = [];
var indexesToClean = [];
var drawLinesBetween = [];

function checkIfPointIsInsideACircle(centerX, centerY, pointX, pointY) {
    var dx = Math.abs(pointX - centerX);
    var dy = Math.abs(pointY - centerY);
    var R = 60;

    if (dx + dy <= R) { 
        return true;
    }
    if (dx > R) { 
        return false;
    }
    if (dy > R ) {
        return false;
    }
    if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(R,  2)) { 
        return true;
    }

    return false;
}

function update() {
    tick();
    render(ctx);
    requestAnimationFrame(update);
}

function tick() {
    // Pausing
    if(input.o) {
        if(paused) {
            paused = false;
            input.o = false;
        } else {
            paused = true;
            input.o = false;
        }
    }

    if(paused) {
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

    // Spawning
    if (particles.length < particlesToSpawn) {
        var randomX, randomY;
        //console.log(particles.length);

        // spawn five at a time to spawn faster
        randomX = Math.floor(Math.floor(Math.random() * 10000) % canvas.width);
        randomY = Math.floor(Math.floor(Math.random() * 10000) % canvas.height);
        particles.push(new Particle(randomX, randomY));

        randomX = Math.floor(Math.floor(Math.random() * 10000) % canvas.width);
        randomY = Math.floor(Math.floor(Math.random() * 10000) % canvas.height);
        particles.push(new Particle(randomX, randomY));

        randomX = Math.floor(Math.floor(Math.random() * 10000) % canvas.width);
        randomY = Math.floor(Math.floor(Math.random() * 10000) % canvas.height);
        particles.push(new Particle(randomX, randomY));

        randomX = Math.floor(Math.floor(Math.random() * 10000) % canvas.width);
        randomY = Math.floor(Math.floor(Math.random() * 10000) % canvas.height);
        particles.push(new Particle(randomX, randomY));

        randomX = Math.floor(Math.floor(Math.random() * 10000) % canvas.width);
        randomY = Math.floor(Math.floor(Math.random() * 10000) % canvas.height);
        particles.push(new Particle(randomX, randomY));
    }
    
    // Update, mark for cleanup and mark near points
    particles.forEach(function(p, index) {
        // check if point should be cleaned
        if (p.isOutside) {
            if (indexesToClean.find(function(i){ return i === index; }) === undefined) {
                indexesToClean.push(index);
            }
            return;
        }
        // update
        p.update(canvas.width, canvas.height);
        // check for nearby points to draw lines
        particles.forEach(function(p2, index2) {
            if (p.isOutside || index === index2) {
                return;
            }
            var isNear = checkIfPointIsInsideACircle(p.position.x, p.position.y, p2.position.x, p2.position.y);
            if (isNear) {
                drawLinesBetween.push({ from: index, to: index2 });
            }
        });
    });
    
    ticksPassed++;
}


function render(ctx) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //ctx.fillStyle ='#AF7817';
    //ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(paused) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = "40px Arial";
        ctx.fillText("Paused", canvas.width / 2 - 100, 250);
    }

    ctx.strokeStyle = '#FFFFFF';
    drawLinesBetween.forEach(function(o) {
        // Lucky points get colored lines
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

    // ------

    particles.forEach(function(p) {
        p.render(ctx);
    });

}


update();
