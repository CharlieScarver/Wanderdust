// Attach click events to the controls.
function attachControls()
{
    document.getElementById("Spawn Idle").onchange = toggleSpawnIdle;
    document.getElementById("Spawn Idle").checked = Options.SpawnIdle;
}

// Toggles spawning moving.
function toggleSpawnIdle(e) {
    // Clear current points.
    particles = [];
    // Change the options value.
    Options.SpawnIdle = e.target.checked;
}
