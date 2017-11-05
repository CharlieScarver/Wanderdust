Array.prototype.clear = function() {
    this.length = 0;
};

Array.prototype.removeAt = function(position){
    this.splice(position,1);
};

Array.prototype.insertAt = function(arg, position){
    this.splice(position, 0, arg);
};

// Generates a random number within a specified range.
// @param {number} min The smallest number that can be generated.
// @param {number} max The highest number that can be generated.
function generateNumber(min, max)
{
    return Math.floor(Math.random() * max) + min;
}

// Checks if a point is inside a circle with a given radius.
// @param {number} centerX X coordinates of the circle's center point.
// @param {number} centerY Y coordinates of the circle's center point.
// @param {number} pointX Y coordinates of the point.
// @param {number} pointY Y coordinates of the point.
// @param {number} radius Radius of the circle.
// @returns {boolean} True if inside, false if not.
function checkIfPointIsInsideACircle(centerX, centerY, pointX, pointY, radius) {
    var dx = Math.abs(pointX - centerX);
    var dy = Math.abs(pointY - centerY);
    var R = radius;

    if (dx + dy <= R) {
        return true;
    }
    if (dx > R) {
        return false;
    }
    if (dy > R) {
        return false;
    }
    if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(R, 2)) {
        return true;
    }

    return false;
}

function noop() {}
