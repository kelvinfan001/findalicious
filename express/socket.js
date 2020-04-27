const Room = require('./models/room');

module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        // once a client has connected, we expect to get a ping from them saying what room they want to join
        console.log("User connected with socket id: ", socket.id);
        let currentRoomNumber;

        socket.on('room', function (roomNumber) {
            console.log("User " + socket.id + " wants to join room " + roomNumber);
            socket.join(roomNumber); // join client into room roomNumber
            currentRoomNumber = roomNumber;

            // Update participants in room and get info on roomNumber
            let roomInfo;
            let query = { roomNumber: roomNumber }
            Room.findOneAndUpdate(query,
                { "$push": { participants: { socketID: socket.id } } },
                { new: true }).then(result => {
                    if (result) {
                        roomInfo = JSON.stringify(result);
                    } else {
                        roomInfo = { "error": "error" } // TODO: handle properly
                    }
                    io.sockets.in(roomNumber).emit('room info', roomInfo);
                }).catch(e => console.log(e));
        });

        socket.on("disconnect", () => {
            // Update participants in room when they leave
            Room.findOneAndUpdate(query, { $inc: { participantCount: -1 } }).then(result => {
                if (!result) {
                    console.log("Room to disconnect from does not exist."); // TODO: handle properly
                }
            }).catch(e => console.log(e));
            console.log("User " + socket.id + " has disconnected from room " + currentRoomNumber);
            let message = "User " + " has left your room.";
            io.sockets.in(currentRoomNumber).emit('user disconnect', message);
        });
    });
}
