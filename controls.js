var ControlsHolder = document.getElementById('controls');

var CanvasContainer = document.getElementById('canvas-container');
var ResizeCanvasToScreenResolution = document.getElementById('ResizeCanvasToScreenResolution');

// Particles
var AllParticlesValue = document.getElementById('All Particles Value');
var IdleParticlesValue = document.getElementById('Idle Particles Value');

var MaxParticles = document.getElementById('Max Particles');
var MaxParticlesValue = document.getElementById('Max Particles Value');

// Idle particles
var IdleOptions = document.getElementById('idleOptions');
var SpawnIdleParticles = document.getElementById('Spawn Idle Particles');

var MaxIdleParticles = document.getElementById('Max Idle Particles');
var MaxIdleParticlesValue = document.getElementById('Max Idle Particles Value');

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
    ResizeCanvasToScreenResolution.checked = Options.ResizeCanvasToScreenResolution;
    ResizeCanvasToScreenResolution.onchange = toggleResizeCanvasToScreenResolution;

    SpawnIdleParticles.checked = Options.SpawnIdleParticles;
    SpawnIdleParticles.onchange = toggleSpawnIdleParticles;

    MaxParticles.value = Options.MaxParticles;
    MaxParticles.onchange = onChangeMaxParticles;
    MaxParticlesValue.innerHTML = Options.MaxParticles;

    MaxIdleParticles.value = Options.MaxIdleParticles;
    MaxIdleParticles.onchange = onChangeMaxIdleParticles;
    MaxIdleParticlesValue.innerHTML = Options.MaxIdleParticles;

    toggleIdleOptionsVisibility();
}

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
        window.onresize = noop;

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
function updateShownValues() {
    AllParticlesValue.innerHTML = particles.length;
    IdleParticlesValue.innerHTML = particles.filter(p => p.movement.idle).length;
}

// Toggles if canvas is resized to screen resolution or stays with the default size 
function toggleResizeCanvasToScreenResolution(e) {
    Options.ResizeCanvasToScreenResolution = e.target.checked;
    resizeCanvas();
}

// Toggles spawning moving
function toggleSpawnIdleParticles(e) {
    clearParticles();
    // Change the options value
    Options.SpawnIdleParticles = e.target.checked;
    toggleIdleOptionsVisibility();
}

function toggleIdleOptionsVisibility() {
    if (Options.SpawnIdleParticles) {
        IdleOptions.style.display = '';
    } else {
        IdleOptions.style.display = 'none';
    }
}

// Change max particles limit
function onChangeMaxParticles(e) {
    Options.MaxParticles = e.target.value;
    MaxParticlesValue.innerHTML = Options.MaxParticles;
}

// Change idle particles limit
function onChangeMaxIdleParticles(e) {
    Options.MaxIdleParticles = e.target.value;
    MaxIdleParticlesValue.innerHTML = Options.MaxIdleParticles;
}
