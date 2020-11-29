var Controls = (function () {
    var ControlsHolder = document.getElementById('controls');

    // Canvas
    var CanvasContainer = document.getElementById('canvas-container');
    var ResizeCanvasToScreenResolution = document.getElementById('ResizeCanvasToScreenResolution');

    // Pause
    var Paused = document.getElementById('Paused');

    // Particles
    var AllParticlesValue = document.getElementById('All Particles Value');
    var IdleParticlesValue = document.getElementById('Idle Particles Value');

    var MaxParticles = document.getElementById('Max Particles');
    var MaxParticlesValue = document.getElementById('Max Particles Value');

    var MinParticleVelocity = document.getElementById('Min Particle Velocity');
    var MinParticleVelocityValue = document.getElementById('Min Particle Velocity Value');

    var MaxLineLength = document.getElementById('Max Line Length');
    var MaxLineLengthValue = document.getElementById('Max Line Length Value');

    var DrawParticles = document.getElementById('Draw Particles');

    // Idle particles
    var IdleOptions = document.getElementById('idleOptions');
    var SpawnIdleParticles = document.getElementById('Spawn Idle Particles');

    var MaxIdleParticles = document.getElementById('Max Idle Particles');
    var MaxIdleParticlesValue = document.getElementById('Max Idle Particles Value');

    var ConnectParticlesToMouse = document.getElementById('Connect Particles To Mouse');
    var MousePosition = { X: 0, Y: 0 };

    var LuckyParticles = document.getElementById('Spawn Lucky Particles');
    var LuckyOptions = document.getElementById('luckyOptions');
    var LuckyOptionsMode = document.getElementsByName('luckyOptionsMode');

    // Clear current points
    function clearParticles() {
        particles = [];
    }

    // Resizes the canvas to the current resolution
    function resizeCanvas() {
        if (Options.ResizeCanvasToScreenResolution) {
            // Resize canvas when the window resizes
            window.onresize = resizeCanvas;

            // Resize canvas to screen resolution
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Change the style of the canvas container
            CanvasContainer.style.margin = '0px';
            CanvasContainer.style.width = 'auto';
        } else {
            // Disable canvas resize on window resize
            window.onresize = Utils.noop;

            // Resize canvas to default size
            canvas.width = Options.DefaultCanvasSize.width;
            canvas.height = Options.DefaultCanvasSize.height;

            // Change the style of the canvas container
            CanvasContainer.style.margin = '50px auto';
            CanvasContainer.style.width = Options.DefaultCanvasSize.width + 'px';
        }
        clearParticles();
    }

    // Update the shown values
    function updateShownValues(particles) {
        AllParticlesValue.innerHTML = particles.length;
        IdleParticlesValue.innerHTML = particles.filter(p => p.movement.idle).length;
    }

    // Toggles if canvas is resized to screen resolution or stays with the default size 
    function toggleResizeCanvasToScreenResolution(e) {
        Options.ResizeCanvasToScreenResolution = e.target.checked;
        resizeCanvas();
    }

    // Toggles if the update of particles is paused or not
    function togglePaused(e) {
        Options.Paused = e.target.checked;
    }

    // Toggles if the lucky particles should spawn
    function toggleLuckyParticles(e) {
        Options.SpawnLuckyParticles = e.target.checked;
        toggleLuckyParticleOptionsVisibility(Options.SpawnLuckyParticles);
    }

    function toggleLuckyParticleOptionsVisibility() {
        if (Options.SpawnLuckyParticles) {
            LuckyOptions.style.display = '';
        } else {
            LuckyOptions.style.display = 'none';
        }
    }

    function toggleLuckyParticlesMode() {
        var mode;
        for (var i = 0; i < LuckyOptionsMode.length; i++) {
            if (LuckyOptionsMode[i].checked) {
                mode = LuckyOptionsMode[i].value;
                break;
            }
        }

        Options.LuckyParticlesMode = mode;
    }

    // Change max particles limit
    function onChangeMaxParticles(e) {
        Options.MaxParticles = e.target.value;
        MaxParticlesValue.innerHTML = Options.MaxParticles;
    }

    // Change min particle velocity
    function onChangeMinParticleVelocity(e) {
        Options.MinParticleVelocity = Number(e.target.value);
        MinParticleVelocityValue.innerHTML = Options.MinParticleVelocity;
    }

    // Change max line length
    function onChangeMaxLineLength(e) {
        Options.DrawLinesInRadius = Number(e.target.value);
        MaxLineLengthValue.innerHTML = Options.DrawLinesInRadius;
    }

    // Change idle particles limit
    function onChangeMaxIdleParticles(e) {
        Options.MaxIdleParticles = Number(e.target.value);
        MaxIdleParticlesValue.innerHTML = Options.MaxIdleParticles;
    }

    // Toggles drawing of particles
    function toggleDrawParticles(e) {
        Options.DrawParticles = e.target.checked;
    }

    function toggleConnectParticlesToMouse(e) {
        Options.ConnectParticlesToMouse = e.target.checked;
        
        if (Options.ConnectParticlesToMouse) {
            window.addEventListener('mousemove', updateMousePoisition, false);
        }
        else {
            window.removeEventListener('mousemove', updateMousePoisition, false);
        }
    }

    function updateMousePoisition(e) {
        MousePosition.X = e.clientX;
        MousePosition.Y = e.clientY;
    }

    // Toggles if the controls for idle particles are visible or not
    function toggleIdleOptionsVisibility() {
        if (Options.SpawnIdleParticles) {
            IdleOptions.style.display = '';
        } else {
            IdleOptions.style.display = 'none';
        }
    }

    // Toggles spawning of idle particles
    function toggleSpawnIdleParticles(e) {
        clearParticles();
        // Change the options value
        Options.SpawnIdleParticles = e.target.checked;
        toggleIdleOptionsVisibility();
    }


    // Attach click events to the controls
    function attachControls() {
        document.getElementById('controls-button').onclick = () => {
            // Check whether the controls are currently visible.
            const visible = ControlsHolder.style.display;

            if (visible === 'none') {
                ControlsHolder.style.display = '';
            } else {
                ControlsHolder.style.display = 'none';
            }
        };

        ControlsHolder.style.display = 'none';
        // Canvas
        ResizeCanvasToScreenResolution.checked = Options.ResizeCanvasToScreenResolution;
        ResizeCanvasToScreenResolution.onchange = toggleResizeCanvasToScreenResolution;

        // Pause
        Paused.checked = Options.Paused;
        Paused.onchange = togglePaused;

        // Particles
        MaxParticles.value = Options.MaxParticles;
        MaxParticles.onchange = onChangeMaxParticles;
        MaxParticlesValue.innerHTML = Options.MaxParticles;

        MinParticleVelocity.value = Options.MinParticleVelocity;
        MinParticleVelocity.onchange = onChangeMinParticleVelocity;
        MinParticleVelocityValue.innerHTML = Options.MinParticleVelocity;

    	MaxLineLength.value = Options.DrawLinesInRadius;
        MaxLineLength.onchange = onChangeMaxLineLength;
        MaxLineLengthValue.innerHTML = Options.DrawLinesInRadius;

        DrawParticles.checked = Options.DrawParticles;
        DrawParticles.onchange = toggleDrawParticles;

        // Idle Particles
        SpawnIdleParticles.checked = Options.SpawnIdleParticles;
        SpawnIdleParticles.onchange = toggleSpawnIdleParticles;

        MaxIdleParticles.value = Options.MaxIdleParticles;
        MaxIdleParticles.onchange = onChangeMaxIdleParticles;
        MaxIdleParticlesValue.innerHTML = Options.MaxIdleParticles;

        // Mouse 
        ConnectParticlesToMouse.checked = Options.ConnectParticlesToMouse;
        ConnectParticlesToMouse.onchange = toggleConnectParticlesToMouse;

        // Lucky Particles
        LuckyParticles.checked = Options.SpawnLuckyParticles;
        LuckyParticles.onchange = toggleLuckyParticles;
        LuckyOptions.onchange = toggleLuckyParticlesMode;


        toggleIdleOptionsVisibility();
        toggleLuckyParticleOptionsVisibility();
    }

    return {
        Paused,
        resizeCanvas,
        attachControls,
        updateShownValues,
        MousePosition
    };
}());
