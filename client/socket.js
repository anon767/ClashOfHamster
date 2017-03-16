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
function Communication(Eventcallback, onopencallback) {
    var socket, send;

    this.socket = new WebSocket('ws://irc.thecout.com:9300');
    this.socket.latency = 1;
    this.socket.ping = 1;
    this.socket.pong = 1;
    this.socket.open = onopencallback;
    this.socket.onerror = function (e) {
        console.log("error occured ", e);
    }
    this.socket.onmessage = function (s) {
        if (s.data === "logoff:exceeded") {
            alert("There are too many Hamster on the Server, try another!");
            location.href = "index.html";
            return;
        }
        if (s.data === "hello") {
            this.open();
            return;
        }
        if (s.data === "8") {
            this.pong = Date.now();
            if ((this.pong - this.ping) > 2000) {
                alert("You have a too slow Connection, try again later!");
                location.href = "index.html";
                return;
            }

            this.latency = this.pong - this.ping;
            return;
        }
        if (s.data === "gtfo") {
            alert("nope nope get out of here you little skid");
            location.href = "index.html";
            return;
        }
        Eventcallback(s.data);
    };
    this.getLatency = function () {
        if (mePlayer.speedX > 0.001 || mePlayer.speedY > 0.0015)
            location.href = "index.html";
        this.socket.ping = Date.now();
        socketObject.send("8");
    }
    this.send = function (data) {
        this.socket.send(data);
    };
}
;
