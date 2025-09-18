const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pino = require('pino');
const pretty = require('pino-pretty');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Logger
const logger = pino(pretty({ translateTime: true }));

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Socket.IO
const { attachSocket } = require('./socket');
attachSocket(server, { logger });

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`Backend listening on http://localhost:${PORT}`);
});


