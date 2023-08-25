const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const multer = require("multer");
const axios = require("axios");

const upload = multer();

app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./pages/index.html"));
});

app.post("/compress", upload.single("uploaded_file"), (req, res) => {
  const { width, height } = req.body;
  console.log(req.body, req.file);
  const { buffer, mimetype, originalname } = req.file;
  const {w, h} = req.query;
  const sharpBuffer = sharp(buffer);
  if (w && h && Number(w) && Number(h)) {
    console.log('resize', w, h);
    sharpBuffer.resize(parseInt(w), parseInt(h));
  }
  sharpBuffer.sharpen()
    .jpeg({ mozjpeg: true })
    .toBuffer()
    .then((data) => {
      const fileData = Buffer.from(data).toString("base64");
      const uid = Date.now();
      res.send({
        status: 200,
        data: `data:${mimetype};base64,${fileData}`,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: 500, data: null });
    });
});

app.get("/health-check", (req, res) => {
  console.log("Server health ok....");
  res.send("Server health ok....");
});

app.listen(8081, () => {
  console.log("Server Running on :: ==>", 8081);
  setInterval(() => {
    axios.get("https://api-server-4oak.onrender.com/health-check");
  }, 10000);
});
