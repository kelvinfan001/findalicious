const Room = require('./models/room');

module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        // once a client has connected, we expect to get a ping from them saying what room they want to join
        console.log("User connected with socket id", socket.id);
        let currentRoomNumber;

        socket.on('room', function (roomNumber) {
            console.log("User " + socket.id + " wants to join room " + roomNumber);
            socket.join(roomNumber); // join client into room roomNumber
            currentRoomNumber = roomNumber;

            // Update participants in room and get info on roomNumber
            let roomInfo;
            let query = { roomNumber: roomNumber };
            Room.findOneAndUpdate(query,
                { $push: { participants: { socketID: socket.id } } },
                { new: true }).then(result => {
                    if (result) {
                        roomInfo = JSON.stringify(result);
                        io.sockets.in(roomNumber).emit('room info', roomInfo);
                    } else {
                        let errMsg = "Attempt to join invalid room";
                        io.emit('error', errMsg);
                    }
                }).catch(e => console.log(e));
        });

        socket.on("disconnect", () => {
            // Update participants in room when they leave
            let query = { roomNumber: currentRoomNumber };
            Room.findOneAndUpdate(query,
                { $pull: { participants: { socketID: socket.id } } },
                { new: true }).then(result => {
                    if (result) {
                        // Check if last participant has disconnected
                        if (result.participants.length === 0) {
                            Room.findOneAndDelete(query).then(result => {
                                if (!result) {
                                    console.log("Failed to delete room.");
                                } else {
                                    console.log("Deleted room", currentRoomNumber);
                                }
                            });
                        }
                    } else {
                        console.log("Room to disconnect from does not exist."); // TODO: handle properly
                    }
                }).catch(e => console.log(e));
            console.log("User " + socket.id + " has disconnected from room " + currentRoomNumber);
            let message = "User " + " has left your room.";
            io.sockets.in(currentRoomNumber).emit('user disconnect', message);
        });
    });
}
