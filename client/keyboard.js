$(document).ready(function () {
    keyboard = new Keyboard();
    $(window).keydown(
            function (e) {
                keyboard.keydown(e);
            }
    );
    $(window).keyup(
            function (e) {
                keyboard.keyup(e);
            }
    );
});

var Keyboard = function () {
    var keys, keydown, keyup, keyupcallback, setkeyupcallback;
    this.keys = [];
    this.setkeyupcallback = function (callback) {
        this.keyupcallback = callback;
    };
    this.keydown = function (e) {
        if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
            e.preventDefault();
        }
        this.keys[e.keyCode] = true;
    };
    this.keyup = function (e) {
        this.keys[e.keyCode] = false;
    };

};