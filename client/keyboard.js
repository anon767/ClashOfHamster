

var Keyboard = function () {
    var keys, keydown, keyup;
    this.keys = [];
    this.keydown = function (e) {
        if (e.keyCode === 87 || e.keyCode === 65 || e.keyCode === 83 || e.keyCode === 68 || e.keyCode === 32) {
            e.preventDefault();
            this.keys[e.keyCode] = true;
        }
    };
    this.keyup = function (e) {
        this.keys[e.keyCode] = false;
    };

};