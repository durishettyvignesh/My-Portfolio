const { Server } = require('socket.io');
const { pool } = require('./db');

function attachSocket(httpServer, { logger }) {
  const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  const userIdToSocketId = new Map();

  io.on('connection', (socket) => {
    const userId = Number(socket.handshake.query.userId);
    if (userId) userIdToSocketId.set(userId, socket.id);
    logger.info(`Socket connected ${socket.id} user=${userId || 'anon'}`);

    socket.on('send_message', async (payload) => {
      try {
        const { senderId, recipientId, content } = payload;
        const [result] = await pool.query(
          'INSERT INTO `Message` (`senderId`, `recipientId`, `content`) VALUES (?, ?, ?)',
          [senderId, recipientId, content]
        );
        const [rows] = await pool.query('SELECT * FROM `Message` WHERE id = ?', [result.insertId]);
        const msg = rows[0];
        const targetSocketId = userIdToSocketId.get(recipientId);
        if (targetSocketId) {
          io.to(targetSocketId).emit('receive_message', msg);
        }
        socket.emit('message_saved', msg);
      } catch (err) {
        logger.error(err);
        socket.emit('error_message', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      if (userId) userIdToSocketId.delete(userId);
      logger.info(`Socket disconnected ${socket.id}`);
    });
  });
}

module.exports = { attachSocket };


