const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const multer  = require('multer');

const upload = multer();

app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./pages/index.html'));
});

app.post('/', upload.single('uploaded_file'), (req, res) => {
const {width, height} = req.body;
const {buffer, mimetype} = req.file;
sharp(buffer).resize(200, 230)
  .jpeg({ mozjpeg: true })
  .toBuffer()
  .then( data => {
    const fileData = Buffer.from(data).toString('base64');
    res.send( `<div>
    <a href='data:${mimetype};base64,${fileData}' download>
       <img src= 'data:${mimetype};base64,${fileData}' width='200' height='200' />
    </a>
    </div>`);
  })
  .catch( err => { console.log(err); res.send('error...') });
});

app.listen(8081, ()=> {
  console.log("Server Running on :: ==>", 8081);
});
