module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        // once a client has connected, we expect to get a ping from them saying what room they want to join
        console.log("someone connected")

        socket.on('room', function (roomNumber) {
            console.log("someone wants to join room", roomNumber);
            socket.join(roomNumber);
            io.sockets.in(roomNumber).emit('message', 'what is going on, party people?');
        });
    });
}
