const Room = require('./models/room');

module.exports = (io) => {
    io.sockets.on('connection', function (socket) {
        // once a client has connected, we expect to get a ping from them saying what room they want to join
        console.log("User connected with socket id", socket.id);
        let currentRoomNumber;

        // Listen on attempt to join room
        socket.on('room', async (roomNumber) => {
            socket.join(roomNumber); // join client into room roomNumber
            currentRoomNumber = roomNumber;
            // Exit function if not a number
            if (isNaN(roomNumber)) {
                let errMsg = "Attempt to join invalid room";
                socket.emit('general error', errMsg);
                console.log("User" + socket.id + "attempted to join an invalid room");
                return;
            }

            // Check if room is already active
            let query = { roomNumber: roomNumber };
            let isActive;
            try {
                let result = await Room.findOne(query);
                if (!result) {
                    console.log("User " + socket.id + " attempted to join an nonexistent room");
                    let errMsg = "Attempt to join nonexistent room";
                    socket.emit('general error', errMsg);
                    return;
                }
                isActive = result.isActive;
                if (isActive) {
                    socket.emit("room active", "Room is already active");
                } else {
                    // Update participants in room and get ino on roomNumber
                    let roomInfo;
                    Room.findOneAndUpdate(query,
                        { $push: { participants: { socketID: socket.id } } },
                        { new: true }).then(result => {
                            roomInfo = JSON.stringify(result);
                            io.sockets.in(roomNumber).emit('room info', roomInfo);
                            console.log("User " + socket.id + " has joined room " + roomNumber);
                        }).catch(e => console.error(e));
                }
            } catch (e) {
                console.error(e);
            }
        });

        // Listen on user disconnect
        socket.on("disconnect", async () => {
            if (!currentRoomNumber) {
                console.log("User " + socket.id + " disconnected without having ever joined a room.");
                return;
            }
            // Update participants in room if a user is leaving a room
            let query = { roomNumber: currentRoomNumber };
            try {
                let result = await Room.findOneAndUpdate(query,
                    { $pull: { participants: { socketID: socket.id } } },
                    { new: true });
                if (result) {
                    // Check if last participant has disconnected
                    if (result.participants.length === 0) {
                        Room.findOneAndDelete(query).then((result) => {
                            if (!result) {
                                console.error("Failed to delete room.");
                            } else {
                                console.log("All users disconnected. Deleted room", currentRoomNumber);
                            }
                        });
                    }
                    roomInfo = JSON.stringify(result);
                    io.sockets.in(currentRoomNumber).emit('user disconnect', roomInfo);
                    console.log("User " + socket.id + " has disconnected from room " + currentRoomNumber);
                } else {
                    console.log("Room to disconnect from does not exist."); // TODO: handle properly
                }
            } catch (e) {
                console.error(e);
            }
        });

        // Listen on user initiate swiping after tapping "EVERYONE IS IN"
        socket.on("initiate swiping", () => {
            if (!currentRoomNumber) {
                console.log("User" + socket.id + " attempted to initiate swiping without first joining a room.");
                return;
            }
            // Make room active
            let query = { roomNumber: currentRoomNumber };
            Room.findOneAndUpdate(query, { isActive: true }, { new: true }).then(result => {
                if (result) {
                    io.sockets.in(currentRoomNumber).emit("room started swiping");
                }
            }).catch(e => console.error(e));
        });

        // Listen on user swipe right
        socket.on("swipe right", async (placeID, participantCount) => {
            if (!currentRoomNumber) {
                console.log("User " + socket.id + " attempted to swipe without being in a room");
                return;
            }
            console.log(placeID)
            try {
                let query = {
                    roomNumber: currentRoomNumber,
                    "restuarants.placeID": placeID
                };
                let updateResult = await Room.findOne(
                    query,
                    // { $inc: { "restaurants.$.likeCount": 1 } },
                    // { new: true }
                );
                // if (!updateResult) {
                //     socket.emit("general error", "Could not update database.");
                //     return;
                // }
                console.log(updateResult);
                // TODO: make this more efficient. 
                // let participantCount = updateResult.participants.length;
                // let updatedRestaurants = updateResult.restaurants;
                // for (let i = 0; i < updatedRestaurants.length; i++) {
                //     if (updatedRestaurants[i].likeCount >= participantCount) {
                //         io.sockets.in(currentRoomNumber).emit("match found", placeID);
                //     }
                // }
            } catch (e) {
                console.error(e);
            }
        });
    });
}
