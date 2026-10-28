const initSeatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join show room to receive live seat updates for that particular show
    socket.on('join-show', (showId) => {
      if (showId) {
        socket.join(showId.toString());
        console.log(`[Socket.io] Socket ${socket.id} joined room for show: ${showId}`);
      }
    });

    // Leave show room
    socket.on('leave-show', (showId) => {
      if (showId) {
        socket.leave(showId.toString());
        console.log(`[Socket.io] Socket ${socket.id} left room for show: ${showId}`);
      }
    });

    // Client locks seat live
    socket.on('client-lock-seats', ({ showId, seatNumbers, userId }) => {
      if (showId && seatNumbers) {
        socket.to(showId.toString()).emit('seatLocked', {
          showId,
          seatNumbers,
          lockedBy: userId,
          expiryTime: new Date(Date.now() + 10 * 60 * 1000),
        });
      }
    });

    // Client unlocks seat live
    socket.on('client-unlock-seats', ({ showId, seatNumbers }) => {
      if (showId && seatNumbers) {
        socket.to(showId.toString()).emit('seatUnlocked', {
          showId,
          seatNumbers,
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = initSeatSocket;
