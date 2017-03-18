var Gameroom = require("./Gameroom.js");
const WebSocket = require('uws');
var id = 1;
var map = [{"width": 2500, "height": 800}, {"x": "150", "y": "350", "w": "150", "h": "13"}, {
    "x": "250",
    "y": "70",
    "w": "50",
    "h": "13"
}, {"x": "0", "y": "400", "w": "5500", "h": "32"}, {"x": "450", "y": "150", "w": "50", "h": "12"}, {
    "x": "550",
    "y": "150",
    "w": "50",
    "h": "15"
}, {
    "x": "750",
    "y": "150",
    "w": "50",
    "h": "15"
}, {"x": "950", "y": "250", "w": "600", "h": "20"}, {"x": "1350", "y": "150", "w": "900", "h": "15"},
    {"x": "0", "y": "0", "w": "2500", "h": "30"}, {"x": "0", "y": "0", "w": "30", "h": "800"},
    {"x": "2500", "y": "0", "w": "60", "h": "800"}, {"x": "3000", "y": "0", "w": "2500", "h": "30"},
    {"x": "0", "y": "-400", "w": "5000", "h": "30"}, {"x": "1500", "y": "-200", "w": "500", "h": "50"}
];
var gamerooms = [];
gamerooms.push(new Gameroom(0, map))
gamerooms.push(new Gameroom(1, map))
gamerooms.push(new Gameroom(2, map))
const wss = new WebSocket.Server({port: 9300});
console.log("started");

function init(client, cid, gameroom, wss) {
    console.log("initiated");
    client.send(JSON.stringify({"id": cid}));
    client.send(JSON.stringify({"5": gameroom.getMap()}));
    gameroom.getClients().forEach(function each(c) {
        if (c && c !== client && c.readyState === WebSocket.OPEN) {
            c.send(JSON.stringify({2: cid}));
        }
    });
}


wss.on('connection', function connection(ws) {
    console.log("connected");
    ws.send("hello");
    ws.on('message', function incoming(data) {
            if (data[0] === "7") {
                var s = parseInt(data[2]);
                if (!gamerooms[s])
                    s = 0;
                ws.gameroom = gamerooms[s];
                if (gamerooms[s].countClients() > 6)
                    ws.send("logoff:exceeded");
                ws.id = id;
                ws.points = 0;
                gamerooms[s].addClient(ws, ws.id);
                init(ws, ws.id, gamerooms[s], wss);
                id++;
                return;
            }
            if (data === "8") {
                ws.send("8");
                return;
            }
            var response = JSON.parse(data);

            if (response['0']) {
                response['0']["p"] = ws.points;
                data = JSON.stringify(response);
            } else if (response[6]) {
                ws.gameroom.getClients().forEach(function each(client) {
                    if (client && client.readyState === WebSocket.OPEN) {
                        client.send(data);
                    }
                });
                return;
            } else if (response[3]) {
                ws.gameroom.getClients().forEach(function each(client) {
                    if (client.id === response[3]['by']) {
                        client.points++;
                    }
                });
            }
            ws.gameroom.getClients().forEach(function each(client) {
                if (client && client.id !== ws.id && client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });

        }
    );

    ws.on('close', function close() {
        var cid = ws.id;
        if (typeof ws.gameroom != "undefined" && ws.gameroom)
            ws.gameroom.removeClient(cid);
        var tempGameroom = ws.gameroom;

        console.log("player disconnected");
        if (tempGameroom) {
            tempGameroom.getClients().forEach(function each(client) {
                if (client && client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({3: {id: cid, by: -1}}));
                }
            });
        }
        if (wss.clients.length == 0) {
            id = 1;
        }
    });
});