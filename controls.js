let options = {
    SpawnIdle: true
};

// Attach click events to the controls.
function attachControls()
{
    document.getElementById("Spawn Idle").onchange = toggleSpawnIdle;
    document.getElementById("Spawn Idle").checked = options.SpawnIdle;
}

// Toggles spawning moving.
function toggleSpawnIdle(e) {
    // Clear current points.
    particles = [];
    // Change the options value.
    options.SpawnIdle = e.target.checked;
}