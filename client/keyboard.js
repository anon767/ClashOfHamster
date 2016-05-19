

var Keyboard = function () {
    var keys, keydown, keyup;
    this.keys = [];
    this.keydown = function (e) {
        if (e.keyCode === 65 || e.keyCode === 68 || e.keyCode === 83 || e.keyCode === 87 || e.keyCode === 32
        || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
            e.preventDefault();
            this.keys[e.keyCode] = true;
        }
    };
    this.keyup = function (e) {
        this.keys[e.keyCode] = false;
    };

};