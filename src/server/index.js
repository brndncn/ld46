// const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const PORT = process.env.PORT || 4000;

app.use('/', express.static('dist'));
app.use('/', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('dist/index.html');
});

const server = app.listen(PORT, () => {
  console.log('Okay, this is epic');
  console.log(`Listening on port ${PORT}`);
});
