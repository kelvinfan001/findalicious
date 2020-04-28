const Room = require('./models/room');

module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        // once a client has connected, we expect to get a ping from them saying what room they want to join
        console.log("User connected with socket id", socket.id);
        let currentRoomNumber;

        socket.on('room', function (roomNumber) {
            console.log("User " + socket.id + " is attempting to join room " + roomNumber);
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
            if (currentRoomNumber) {
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
                            roomInfo = JSON.stringify(result);
                            io.sockets.in(currentRoomNumber).emit('user disconnect', roomInfo);
                            console.log("User " + socket.id + " has disconnected from room " + currentRoomNumber);
                        } else {
                            console.log("Room to disconnect from does not exist."); // TODO: handle properly
                        }
                    }).catch(e => console.log(e));
            } else {
                console.log("User" + socket.id + "disconnected without having ever joined a room.");
            }
        });
    });
}
