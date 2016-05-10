# JSGameProject

# Set up:
install :Apache/Mysql (Xampp)

### Config:
server/bootstrap.php adjust mysql settings

copy files to /var/www/jsgameproject (or for xampp: c:/xampp/htdocs/jsgameproject)

### used Libraries:
Backend:

Altorouter (not used yet routing http requests)

doctrine (orm database mapper not used yet)

JSEND (gzip decrompressor)

### Frontend:
JSEND (gzip compressor)

JQuery (framework for parsing json and retrieving events)

EaselJS (flash like html5 canvas library)

### Run
php server/server.php

open http://localhost/jsgameproject

## Develop

the php backend consists currently just of server.php

there are 3 events wsonmessage,wsonopen and wsonclose

currently:

 - onopen: sends map to joined user, sends unique id to joined user
 - onclose: sends to all player a "dead" notice
 - onmessage: (if compressed -> decompress) and forward message to all players

the javascript frontend consists of the classes

block,collision,game,keyboard,player and socket

the structure of a message to the server is a json starting with a message identifier ( see socket.js)
