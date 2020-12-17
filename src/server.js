const express = require('express');
const port = 3000;
const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

var allClients = [];

io.on("connection", (socket) => {
    console.log(allClients.length);
    socket.on("name", (data) => {
        socket.name = data;
        allClients.push(socket);
        allClients.forEach((client) => {
            if (client == socket) {
                socket.emit("message", "Welcome " + data);
            } else {
                client.emit("message", socket.name + " joined the chat!");
            }
        });
    });

    socket.on("disconnect", (socket) => {
        console.log("Disconnected");
        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);
    });

    socket.on("clientmsg", (data) => {
        allClients.forEach((client) => {
            console.log(client.name);
            client.emit("message", socket.name + ": " + data);
        });
        console.log(socket.name + ": " + data);
    });
});

http.listen(port, () => {
    console.log("Server is listening to localhost:" + port);
});