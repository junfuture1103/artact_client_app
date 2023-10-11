const express = require('express');
const multer = require('multer');
const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('photo'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('이미지를 업로드하지 못했습니다.');
  }

  // 이미지 업로드 성공 처리
  res.status(200).send('이미지 업로드 성공');
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
