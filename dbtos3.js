const AWS = require('aws-sdk'); 
const PDFDocument = require('pdfkit'); 
const fs = require('fs'); 
const path = require('path'); 


AWS.config.update({ region: 'ap-northeast-2' }); 


const s3 = new AWS.S3(); 
const dynamoDB = new AWS.DynamoDB(); 

// 테이블 이름 및 타겟 버킷 설정
const scriptTableName = 'Script-hg3tyrb5mndm3pgi7z5enabfpi-dev'; // Script 테이블 이름
const diagnosisTableName = 'Diagnosis-hg3tyrb5mndm3pgi7z5enabfpi-dev'; // Diagnosis 테이블 이름
const patientTableName = 'Patient-hg3tyrb5mndm3pgi7z5enabfpi-dev'; // Patient 테이블 이름
const targetBucket = 'samosestest'; // 업로드할 S3 버킷 이름

function createFolder(bucket, folderName) {
  const params = {
    Bucket: bucket,
    Key: `${folderName}/`,
  };

  return s3.putObject(params).promise();
}

function createFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
}

// Diagnosis 아이템을 처리하는 함수
function processDiagnosisItems(items) {
  items.forEach((item) => {
    const itemOwner = item.owner.S; // 아이템 소유자(owner) 정보
    const itemName = item.name.S; // 아이템 이름 정보
    const itemCreatedAt = item.createdAt.S; // 아이템 생성일 정보
    const itemDate = itemCreatedAt.split('T')[0]; // 생성일에서 날짜 추출
    const itemAttributes = ['createdAt', 'date', 'diagnosis', 'email', 'owner', 'patientID', 'updatedAt'];

    // 아이템의 폴더 경로 설정
    const ownerFolderPath = `owner/${itemOwner}`;
    const diagnosisFolderPath = `${ownerFolderPath}/${itemName}`;
    const dateFolderPath = `${diagnosisFolderPath}/${itemDate}`;

    // 폴더 생성 및 관련 파일 처리
    createFolder(targetBucket, ownerFolderPath)
      .then(() => {
        console.log(`Created folder for owner ${itemOwner}`);

        createFolder(targetBucket, diagnosisFolderPath)
          .then(() => {
            console.log(`Created subfolder for owner ${itemOwner}, diagnosis ${itemName}`);

            createFolder(targetBucket, dateFolderPath)
              .then(() => {
                console.log(`Created subfolder for owner ${itemOwner}, diagnosis ${itemName}, date ${itemDate}`);

                // 아이템의 정보 추출 및 문자열로 변환
                const diagnosisInfo = {};
                itemAttributes.forEach((attribute) => {
                  diagnosisInfo[attribute] = item[attribute].S;
                });
                const diagnosisInfoString = JSON.stringify(diagnosisInfo, null, 2);

                // 텍스트 파일 생성 및 내용 쓰기
                const txtFilePath = path.join('/tmp', `${itemDate}_${itemName}_diagnosis-info.txt`);
                const fileContent = `diagnosis-info\n\n${diagnosisInfoString}`;
                createFile(txtFilePath, fileContent);

                // S3에 텍스트 파일 업로드
                const txtUploadParams = {
                  Bucket: targetBucket,
                  Key: `${dateFolderPath}/${itemName}_${itemDate}_diagnosis-info.txt`,
                  Body: fs.createReadStream(txtFilePath),
                  ContentType: 'text/plain; charset=utf-8',
                };

                s3.upload(txtUploadParams, (uploadErr) => {
                  if (uploadErr) {
                    console.error('Error uploading txt file:', uploadErr);
                  } else {
                    console.log('Uploaded txt file for', itemName);
                  }
                });
              })
              .catch((dateSubfolderErr) => {
                console.error('Error creating date subfolder:', dateSubfolderErr);
              });
          })
          .catch((subfolderErr) => {
            console.error('Error creating subfolder:', subfolderErr);
          });
      })
      .catch((folderErr) => {
        console.error('Error creating folder:', folderErr);
      });
  });
}

//같은 방식으로 script 테이블 처리
function processScriptItems(items) {
  items.forEach((item) => {
    const itemOwner = item.owner.S;
    const itemName = item.name.S; 
    const itemCreatedAt = item.createdAt.S;
    const itemDate = itemCreatedAt.split('T')[0];
    const itemAttributes = ['createdAt', 'date', 'email', 'owner', 'email', 'patientID', 'script', 'summary', 'updatedAt', '__typename'];

    const ownerFolderPath = `owner/${itemOwner}`;
    const patientFolderPath = `${ownerFolderPath}/${itemName}`;
    const dateFolderPath = `${patientFolderPath}/${itemDate}`;

    createFolder(targetBucket, ownerFolderPath)
      .then(() => {
        console.log(`Created folder for owner ${itemOwner}`);

        createFolder(targetBucket, patientFolderPath)
          .then(() => {
            console.log(`Created subfolder for owner ${itemOwner}, patient ${itemName}`);

            createFolder(targetBucket, dateFolderPath)
              .then(() => {
                console.log(`Created subfolder for owner ${itemOwner}, patient ${itemName}, date ${itemDate}`);

                const patientInfo = {};
                itemAttributes.forEach((attribute) => {
                  patientInfo[attribute] = item[attribute].S;
                });

                const patientInfoString = JSON.stringify(patientInfo, null, 2);

                const txtFilePath = path.join('/tmp', `${itemDate}_${itemName}_script-info.txt`);
                const fileContent = `script-info\n\n${patientInfoString}`;
                createFile(txtFilePath, fileContent);

                const txtUploadParams = {
                  Bucket: targetBucket,
                  Key: `${dateFolderPath}/${itemName}_${itemDate}_script-info.txt`,
                  Body: fs.createReadStream(txtFilePath),
                  ContentType: 'text/plain; charset=utf-8',
                };

                s3.upload(txtUploadParams, (uploadErr) => {
                  if (uploadErr) {
                    console.error('Error uploading txt file:', uploadErr);
                  } else {
                    console.log('Uploaded txt file for', itemName);
                  }
                });
              })
              .catch((dateSubfolderErr) => {
                console.error('Error creating date subfolder:', dateSubfolderErr);
              });
          })
          .catch((subfolderErr) => {
            console.error('Error creating subfolder:', subfolderErr);
          });
      })
      .catch((folderErr) => {
        console.error('Error creating folder:', folderErr);
      });
  });
}

//같은 방식으로 patient 테이블 처리
function processPatientItems(items) {
  items.forEach((item) => {
    const itemOwner = item.owner.S;
    const itemName = item.name.S;
    const itemCreatedAt = item.createdAt.S;
    const itemDate = itemCreatedAt.split('T')[0];
    const itemAttributes = ['birth', 'createdAt', 'email', 'name', 'owner', 'phone', 'updatedAt'];

    const ownerFolderPath = `owner/${itemOwner}`;
    const patientFolderPath = `${ownerFolderPath}/${itemName}`;
    const dateFolderPath = `${patientFolderPath}/${itemDate}`;

    createFolder(targetBucket, ownerFolderPath)
      .then(() => {
        console.log(`Created folder for owner ${itemOwner}`);

        createFolder(targetBucket, patientFolderPath)
          .then(() => {
            console.log(`Created subfolder for owner ${itemOwner}, patient ${itemName}`);

            createFolder(targetBucket, dateFolderPath)
              .then(() => {
                console.log(`Created subfolder for owner ${itemOwner}, patient ${itemName}, date ${itemDate}`);

                const patientInfo = {};
                itemAttributes.forEach((attribute) => {
                  patientInfo[attribute] = item[attribute].S;
                });

                const patientInfoString = JSON.stringify(patientInfo, null, 2);

                const txtFilePath = path.join('/tmp', `${itemDate}_${itemName}_patient-info.txt`);
                const fileContent = `patient-info\n\n${patientInfoString}`;
                createFile(txtFilePath, fileContent);

                const txtUploadParams = {
                  Bucket: targetBucket,
                  Key: `${dateFolderPath}/${itemName}_${itemDate}_patient-info.txt`,
                  Body: fs.createReadStream(txtFilePath),
                  ContentType: 'text/plain; charset=utf-8',
                };

                s3.upload(txtUploadParams, (uploadErr) => {
                  if (uploadErr) {
                    console.error('Error uploading txt file:', uploadErr);
                  } else {
                    console.log('Uploaded txt file for', itemName);
                  }
                });
              })
              .catch((dateSubfolderErr) => {
                console.error('Error creating date subfolder:', dateSubfolderErr);
              });
          })
          .catch((subfolderErr) => {
            console.error('Error creating subfolder:', subfolderErr);
          });
      })
      .catch((folderErr) => {
        console.error('Error creating folder:', folderErr);
      });
  });
}

// Script 테이블 스캔
const scriptScanParams = {
  TableName: scriptTableName, 
};

dynamoDB.scan(scriptScanParams, (err, data) => { 
  if (err) {
    console.error('Error scanning Script table:', err); 
  } else {
    const scriptItems = data.Items; // 스캔 결과에서 아이템을 가져옵니다.
    processScriptItems(scriptItems); // 가져온 아이템을 처리하는 함수를 호출합니다.
  }
});

// Diagnosis 테이블 스캔
const diagnosisScanParams = {
  TableName: diagnosisTableName, 
};

dynamoDB.scan(diagnosisScanParams, (err, data) => { // Diagnosis 테이블을 스캔합니다.
  if (err) {
    console.error('Error scanning Diagnosis table:', err); 
  } else {
    const diagnosisItems = data.Items; // 스캔 결과에서 아이템을 가져옵니다.
    processDiagnosisItems(diagnosisItems); // 가져온 아이템을 처리하는 함수를 호출합니다.
  }
});

// Patient 테이블 스캔
const patientScanParams = {
  TableName: patientTableName, 
};

dynamoDB.scan(patientScanParams, (err, data) => { 
  if (err) {
    console.error('Error scanning Patient table:', err); 
  } else {
    const patientItems = data.Items; // 스캔 결과에서 아이템을 가져옵니다.
    processPatientItems(patientItems); // 가져온 아이템을 처리하는 함수를 호출합니다.
  }
});