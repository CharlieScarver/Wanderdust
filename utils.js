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