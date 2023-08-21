const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static('./public'));

app.get('/api', (req, res) => {
  fs.writeFileSync('text.json', JSON.stringify({t: 1, t2: 3}), 'utf8');
  const readData = fs.readFileSync('text.json', 'utf8');
  res.send(readData);
  //res.sendFile(path.resolve('./pages/index.html'));
});

module.exports = app;
