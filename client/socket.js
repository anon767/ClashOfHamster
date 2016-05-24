/* global LZString, LZW */
/*
 * json declaration of commands (indizes)
 * 0 initial send 
 * 1 update
 * 2 Request 
 * 3 Dead
 * 4 compression on
 * 5 retrieve map details
 * 6 retrieve bullet information
 */
function Communication(Eventcallback) {
    var socket, send;
    this.socket = new WebSocket('ws://mycodeboard.com:9300');
 
    this.socket.onopen = function () {

    };
    this.socket.onmessage = function (s) {
        Eventcallback(s.data);
    };
    this.send = function (data) {
        this.socket.send(data);
    };
}
;
