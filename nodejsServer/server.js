var Gameroom = require("./Gameroom.js");
const WebSocket = require('ws');

var map = [{"width": 2500, "height": 400}, {"x": "150", "y": "350", "w": "150", "h": "13"}, {
    "x": "250",
    "y": "70",
    "w": "50",
    "h": "13"
}, {"x": "450", "y": "150", "w": "50", "h": "12"}, {"x": "550", "y": "150", "w": "50", "h": "15"}, {
    "x": "750",
    "y": "150",
    "w": "50",
    "h": "15"
}, {"x": "950", "y": "250", "w": "600", "h": "20"}, {"x": "1350", "y": "150", "w": "900", "h": "15"}];
var gamerooms = [];
gamerooms.push(new Gameroom(0, map))
gamerooms.push(new Gameroom(1, map))
gamerooms.push(new Gameroom(2, map))
const wss = new WebSocket.Server({perMessageDeflate: false, port: 9300});
console.log("started");

function init(client, id, gameroom, wss) {
    client.send(JSON.stringify({"id": id}));
    client.send(JSON.stringify({"5": gameroom.getMap()}));
    wss.clients.forEach(function each(c) {
        if (c && c !== client && c.readyState === WebSocket.OPEN) {
            c.send(JSON.stringify({2: id}));
        }
    });
}


wss.on('connection', function connection(ws) {
    console.log("connected");
    ws.on('message', function incoming(data) {
        if (data[0] === "7") {
            var s = parseInt(data[2]);
            if (!gamerooms[s])
                s = 0;
            ws.gameroom = gamerooms[s];
            if (gamerooms[s].countClients() > 6)
                ws.send("logoff:exceeded");
            gamerooms[s].addClient(ws, ws._ultron.id);
            init(ws, ws._ultron.id, gamerooms[s], wss);
            return;
        }
        if (data === "8") {
            ws.send("8");
            return;
        }
        ws.gameroom.getClients().forEach(function each(client) {
            if (client && client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });

    });
    ws.on('close', function close() {
        var id = ws._ultron.id;
        if (ws.gameroom) {
            ws.gameroom.removeClient(id);
        }

        console.log("player disconnected");
        wss.clients.forEach(function each(client) {
            if (client && client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({3: {id: id, by: -1}}));
            }
        });
    });
});