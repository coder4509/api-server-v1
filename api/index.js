const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const multer  = require('multer');
const axios = require('axios');

const upload = multer();

app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./pages/index.html'));
});

app.post('/', upload.single('uploaded_file'), (req, res) => {
const {width, height} = req.body;
const {buffer, mimetype, originalname} = req.file;
sharp(buffer).resize(200, 230)
  .jpeg({ mozjpeg: true })
  .toBuffer()
  .then( data => {
    const fileData = Buffer.from(data).toString('base64');
    const uid = Date.now();
    res.send( `<div>
    <div>
      <a href='/'> Back </a>
    </div>
    <hr/>
    <br/>
    <a href='data:${mimetype};base64,${fileData}' download>
       <img src= 'data:${mimetype};base64,${fileData}' width='200' height='200' />
    </a>
    </div>`);
  })
  .catch( err => { console.log(err); res.send('error...') });
});

app.get('/health-check', (req, res) => {
  console.log('Server health ok....');
  res.send('Server health ok....');
});

app.listen(8081, ()=> {
  console.log("Server Running on :: ==>", 8081);
  setInterval(() => {
    axios.get('https://api-server-4oak.onrender.com/health-check');
  }, 10000);
});
