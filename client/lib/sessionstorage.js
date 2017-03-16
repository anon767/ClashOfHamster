var storage = function () {
    this.setname = function (name) {
        if (typeof(Storage) !== "undefined")
            localStorage.setItem("name", name);
    }
    this.addKills = function (kills) {
        if (typeof(Storage) !== "undefined")
            if (localStorage.getItem("kills"))
                localStorage.setItem("kills", parseInt(localStorage.getItem("kills")) + 1);
            else
                localStorage.setItem("kills", 1);
    }
    this.addDeaths = function () {
        if (typeof(Storage) !== "undefined")
            if (localStorage.getItem("deaths"))
                localStorage.setItem("deaths", parseInt(localStorage.getItem("deaths")) + 1);
            else
                localStorage.setItem("deaths", 1);
    }
    this.addLogins = function () {
        if (typeof(Storage) !== "undefined")
            if (localStorage.getItem("logins"))
                localStorage.setItem("logins", parseInt(localStorage.getItem("logins")) + 1);
            else
                localStorage.setItem("logins", 1);
    }
};