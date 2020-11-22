const Room = require('./models/room')

module.exports = io => {
  io.sockets.on('connection', socket => {
    // a client has connected
    console.log(`User connected with socket id ${socket.id}.`)
    // let currentRoomNumber;

    /* Helper function for leaving room in database */
    async function leaveDbRoom(roomNumber) {
      // Update participants in room if a user is leaving a room
      const query = { roomNumber }
      try {
        const result = await Room.findOneAndUpdate(
          query,
          { $pull: { participants: { socketID: socket.id } } },
          { new: true }
        )
        if (result) {
          // Check if last participant has disconnected, if so, delete room from db
          if (result.participants.length === 0) {
            const deleteRes = await Room.findOneAndDelete(query)
            if (!deleteRes) {
              console.error('Failed to delete room.')
            } else {
              console.log(`All users disconnected. Deleted room ${roomNumber}.`)
            }
          }
          const roomInfo = JSON.stringify(result)
          io.sockets.in(roomNumber).emit('user disconnect', roomInfo)
          console.log(`User ${socket.id} has left db room ${roomNumber}.`)
        } else {
          console.log('Room to disconnect from does not exist.')
        }
      } catch (e) {
        console.error(e)
      }
    }

    /* Listen on client attempt to leave room */
    socket.on('leave room', () => {
      if (!socket.room) {
        // client was never in a room. This request should never have been sent.
        console.warn('Client attempt to leave room without ever being in a room.')
        return
      }
      socket.leave(socket.room)
      console.log(`User ${socket.id} has left socket room ${socket.room}.`)
      leaveDbRoom(socket.room)

      /* eslint-disable-next-line */
      socket.room = 0 // set to zero so currentRoomNumber is falsey.
    })

    /* Listen on 'check joined room' */
    socket.on('check joined room', ack => {
      if (socket.room) {
        ack(true) // client is already in a room
      } else {
        ack(false)
      }
    })

    /* Listen on attempt to join room */
    socket.on('room', async roomNumber => {
      // Quit and return if not a number. However, this should never happen due to checks at client side.
      if (Number.isNaN(roomNumber)) {
        const errMsg = 'Invalid room number'
        socket.emit('invalid room error', errMsg)
        console.log(`User ${socket.id} entered an invalid room nubmer.`)
        return
      }

      const query = { roomNumber }
      let isActive
      try {
        // Check if room is already active
        const result = await Room.findOne(query)
        if (!result) {
          console.log(`User ${socket.id} attempted to join a nonexistent room.`)
          const errMsg = 'Attempt to join nonexistent room'
          socket.emit('invalid room error', errMsg)
          return
        }
        isActive = result.isActive
        if (isActive) {
          socket.emit('room already swiping', 'Room is already active')
        } else {
          // If not active, update participants in room and get info on roomNumber
          const roomInfo = JSON.stringify(
            await Room.findOneAndUpdate(query, { $push: { participants: { socketID: socket.id } } }, { new: true })
          )
          socket.join(roomNumber) // join client into socket room roomNumber
          io.sockets.in(roomNumber).emit('room info', roomInfo)

          /* eslint-disable-next-line */
          socket.room = roomNumber
          // currentRoomNumber = roomNumber;
          console.log(`User ${socket.id} has joined db and socket room ${roomNumber}.`)
        }
      } catch (e) {
        console.error(e)
        socket.emit('general error', e)
      }
    })

    /* Listen on user disconnect */
    socket.on('disconnect', async reason => {
      console.log(`User ${socket.id} disconnected due to ${reason}`)

      if (socket.room) {
        console.log(`User ${socket.id} has left socket room ${socket.room}.`)
        // Leave database room
        leaveDbRoom(socket.room)

        /* eslint-disable-next-line */
        socket.room = 0 // set to zero so currentRoomNumber is falsey.
      }
    })

    /* Listen on user initiate swiping after tapping "EVERYONE IS IN" */
    socket.on('initiate swiping', async () => {
      if (!socket.room) {
        console.warn(`User ${socket.id} attempted to initiate swiping without being in a socket room.`)
        socket.emit('general error', 'attempted to initiate swiping without being in a socket room.')
        return
      }
      // Make room active
      const query = { roomNumber: socket.room }
      try {
        const result = await Room.findOneAndUpdate(query, { isActive: true }, { new: true })
        if (result) {
          io.sockets.in(socket.room).emit('room started swiping')
        }
      } catch (err) {
        console.error(err)
      }
    })

    /* Listen on user swipe right */
    socket.on('swipe', async placeID => {
      if (!socket.room) {
        console.log(`User ${socket.id} attempted to swipe without being in a room`)
        socket.emit('not in room swipe', 'swiped when not in room')
        return
      }
      if (!placeID) {
        // PlaceID argument is provided by client if right swipe.
        // This is left here so client will get a response even on left swipe.
        return
      }
      try {
        let query = { roomNumber: socket.room, 'restaurants.placeID': placeID }
        const updateResult = await Room.findOneAndUpdate(
          query,
          { $inc: { 'restaurants.$.likeCount': 1 } },
          { new: true }
        )
        if (!updateResult) {
          socket.emit('general error', 'Could not update database.')
          return
        }
        // TODO: make checking if match more efficient.
        // Check for any matches
        const participantCount = updateResult.participants.length
        query = {
          roomNumber: socket.room,
          restaurants: {
            $elemMatch: {
              placeID,
              likeCount: participantCount
            }
          }
        }
        const queryResult = await Room.find(query)
        if (queryResult.length > 0) {
          io.sockets.in(socket.room).emit('match found', placeID)
        }
      } catch (e) {
        console.error(e)
      }
    })
  })
}
