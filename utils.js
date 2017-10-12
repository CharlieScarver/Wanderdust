Array.prototype.clear = function() {
    this.length = 0;
};

Array.prototype.removeAt = function(position){
    this.splice(position,1);
};

Array.prototype.insertAt = function(arg, position){
    this.splice(position, 0, arg);
};
