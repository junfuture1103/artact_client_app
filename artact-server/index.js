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

// 이미지 분석 및 ID 생성 함수 (가짜 ID 생성 예시)
function analyzeImageAndGenerateID(file) {
  // 여기에 이미지 분석 로직을 추가하고, 적절한 ID를 생성하는 코드를 작성하세요.
  // 이 예시에서는 현재 시간을 기반으로 가짜 ID를 생성합니다.
  return Date.now().toString();
}

app.post('/upload', upload.single('photo'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('이미지를 업로드하지 못했습니다.');
  }

  // 이미지 업로드 성공 처리
  // 이미지 분석 및 ID 생성
  const generatedID = analyzeImageAndGenerateID(file);

  // 클라이언트에게 생성된 ID 반환
  res.status(200).send(generatedID);
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});