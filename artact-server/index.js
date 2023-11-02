const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const app = express();
const port = 1103;


// 전역 변수로 파일 이름을 저장할 변수
let uploadedFileName = '';

function analyzeImageAndGenerateID(file) {
  return new Promise((resolve, reject) => {
    console.log("python 로직 시작");
    
    // ... 파이썬 스크립트 실행 코드 ...
    const pythonScript = '../../../artact-api-server/cnn/cnn_use.py'
    const arg1 = uploadedFileName
    var result = null;
    const pythonProcess = spawn('python3', [pythonScript, arg1]);
    
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
      reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(result.trim()); // 결과를 반환
      } else {
        reject(`Python 프로세스가 오류로 종료되었습니다. 코드: ${code}`);
      }
    });
  });
}



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // 파일 이름을 생성하고 전역 변수에 할당
    uploadedFileName = Date.now() + '-' + file.originalname;
    cb(null, uploadedFileName);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('photo'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('이미지를 업로드하지 못했습니다.');
  }

  // 이미지 업로드 성공 처리
  // 이미지 분석 및 ID 생성
  // 이미지 업로드 성공 처리
  // 이미지 분석 및 ID 생성
  analyzeImageAndGenerateID(file)
  .then((generatedID) => {
    console.log('Python 결과:', generatedID);
    
    // 정규 표현식을 사용하여 "result:" 다음의 문자열 추출
    var extractedResult = null;
    const match = generatedID.match(/resultURL:(.+)/);
    if (match) {
      extractedResult = match[1].trim();
      console.log('추출된 결과:', extractedResult);
    } else {
      console.error('결과 추출 실패');
    }

    // 클라이언트에게 생성된 ID 반환
    res.status(200).send(extractedResult);
  })
  .catch((error) => {
    console.error('에러 발생:', error);
    res.status(500).send('에러 발생'); // 에러가 발생한 경우에도 클라이언트에게 에러 응답을 보냄
  });

});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
