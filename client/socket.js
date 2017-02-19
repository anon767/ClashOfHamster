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
function Communication(Eventcallback,onopencallback) {
    var socket, send;
    this.socket = new WebSocket('ws://192.168.178.82:9300');
 
    this.socket.onopen = function () {
      onopencallback();
    };
    this.socket.onmessage = function (s) {
        if(s.data === "logoff:exceeded"){
            alert("There are too many Hamster on the Server, try another!");
            location.href = "index.html";
            return;
        }
        Eventcallback(s.data);
    };
    this.send = function (data) {
        this.socket.send(data);
    };
}
;
