var Gameroom = function (id, map) {
    var self = this;
    self.clients = [];
    self.id = id;
    self.map = map;
    self.addClient = function (client, id) {
        this.clients[id] = client;
    };
    self.getClients = function () {
        return this.clients;
    };
    self.getMap = function () {
        return this.map;
    };
    self.countClients = function () {
        var i = 0;
        var c = this.getClients();
        for (j = 0; j < c.length; j++)
            if (c[j])
                i++;
        return i;
    }
    self.removeClient = function (id) {
        this.clients[id] = null;
        this.clients.splice(id, 1);
    }

};
module.exports = Gameroom;