/* global LZString, LZW */
/*
 * json declaration of commands (indizes)
 * 0 initial send 
 * 1 update
 * 2 Request 
 * 3 Dead
 * 4 compression on
 * 5 retrieve map details
 */
function Communication(Eventcallback) {
    var socket, send, compression, setCompression;
    this.compression = false;
    this.socket = new WebSocket('ws://192.168.188.173:9300');
    this.setCompression = function () {
        this.send(JSON.stringify({4: 1}));
        this.compression = true;
    };
    this.socket.onopen = function () {

    };
    this.socket.onmessage = function (s) {
        Eventcallback(s.data);
    };
    this.send = function (data) {
        if (this.compression) {
            data = $.jSEND(data);
        }
        this.socket.send(data);
    };
}
;
