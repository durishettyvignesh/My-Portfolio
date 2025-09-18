const { Router } = require('express');
const { pool } = require('./db');
const router = Router();

// Users
router.get('/users', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM `User` ORDER BY `createdAt` DESC');
  res.json(rows);
});

router.post('/users', async (req, res) => {
  const { name, age, gender = null, languages, interests, picture = null, location = null } = req.body;
  const [result] = await pool.query(
    'INSERT INTO `User` (`name`, `age`, `gender`, `languages`, `interests`, `picture`, `location`) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, age, gender, languages, interests, picture, location]
  );
  const [rows] = await pool.query('SELECT * FROM `User` WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
});

// Matches
router.get('/matches/:userId', async (req, res) => {
  const userId = Number(req.params.userId);
  const [rows] = await pool.query(
    `SELECT m.*, u1.name as userName, u2.name as buddyName
     FROM \`Match\` m
     JOIN \`User\` u1 ON u1.id = m.userId
     JOIN \`User\` u2 ON u2.id = m.buddyId
     WHERE m.userId = ? OR m.buddyId = ?
     ORDER BY m.createdAt DESC`,
    [userId, userId]
  );
  res.json(rows);
});

router.post('/matches', async (req, res) => {
  const { userId, buddyId } = req.body;
  await pool.query('INSERT IGNORE INTO `Match` (`userId`, `buddyId`) VALUES (?, ?)', [userId, buddyId]);
  const [rows] = await pool.query('SELECT * FROM `Match` WHERE userId = ? AND buddyId = ?', [userId, buddyId]);
  res.status(201).json(rows[0]);
});

router.post('/matches/:id/accept', async (req, res) => {
  const id = Number(req.params.id);
  await pool.query('UPDATE `Match` SET `status` = "accepted" WHERE id = ?', [id]);
  const [rows] = await pool.query('SELECT * FROM `Match` WHERE id = ?', [id]);
  res.json(rows[0]);
});

// Messages
router.get('/messages', async (req, res) => {
  const { a, b } = req.query; // two user ids
  const aId = Number(a);
  const bId = Number(b);
  const [rows] = await pool.query(
    `SELECT * FROM \`Message\` 
     WHERE (senderId = ? AND recipientId = ?) OR (senderId = ? AND recipientId = ?)
     ORDER BY createdAt ASC`,
    [aId, bId, bId, aId]
  );
  res.json(rows);
});

router.post('/messages', async (req, res) => {
  const { senderId, recipientId, content } = req.body;
  const [result] = await pool.query(
    'INSERT INTO `Message` (`senderId`, `recipientId`, `content`) VALUES (?, ?, ?)',
    [senderId, recipientId, content]
  );
  const [rows] = await pool.query('SELECT * FROM `Message` WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
});

module.exports = router;


