Array.prototype.clear = function() {
    this.length = 0;
};

var Utils = (function() {
    // Empty function that does nothing.
    function noop() {}

    // Generates a random number within a specified range.
    // @param {number} min - The smallest number that can be generated.
    // @param {number} max - The highest number that can be generated.
    // @returns {number} - The random number.
    function generateNumber(min, max)
    {
        return Math.floor(Math.random() * max) + min;
    }

    // Checks if a point is inside a circle with a given radius.
    // @param {number} centerX - X coordinate of the circle's center point.
    // @param {number} centerY - Y coordinate of the circle's center point.
    // @param {number} pointX - Y coordinate of the point.
    // @param {number} pointY - Y coordinate of the point.
    // @param {number} radius - Radius of the circle.
    // @returns {boolean} - True if inside, false if not.
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

    // Calculates the distance between two points.
    // @param {number} x1 - X coordidate of the first point.
    // @param {number} x2 - X coordidate of the first point.
    // @param {number} y1 - Y coordidate of the second point.
    // @param {number} y2 - Y coordidate of the second point.
    // @returns {number} - The distance between the two points.
    function distanceBetweenTwoPoints(x1, y1, x2, y2) {
        return Math.sqrt( Math.pow(Math.abs(x1-x2), 2) + Math.pow(Math.abs(y1-y2), 2) );
    }

    // Repeats a given character (or string) N times and returns the resulting string.
    // @param {string} character - The character to repeat.
    // @param {number} times - The number of repetitions.
    // @returns {string} - The resulting string.
    function repeatChar(character, times) {
        var result = '';
        for (var i = 0; i < times; i++) {
            result += character;
        }
        return result;
    }

    // Pads a string on the left side with the provided character.
    // @param {number} initialString - The string to pad.
    // @param {number} totalLength - The desired total length of the result string.
    // @param {string} padCharacter - The character to pad with.
    // @returns {string} - The padded string.
    function padStringLeft(initialString, totalLength, padCharacter) {
        var paddingLength = totalLength - initialString.length;
        return repeatChar(padCharacter, paddingLength) + initialString;
    }

    return {
        noop,
        generateNumber,
        checkIfPointIsInsideACircle,
        distanceBetweenTwoPoints,
        repeatChar,
        padStringLeft
    };
}())

