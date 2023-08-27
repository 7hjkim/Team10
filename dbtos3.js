const AWS = require('aws-sdk');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path'); // path 모듈 추가

// AWS 설정
AWS.config.update({ region: 'ap-northeast-2' });

// S3 및 DynamoDB 클라이언트 생성
const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB();

// 테이블 이름 및 타겟 버킷 설정
const scriptTableName = 'Script-hg3tyrb5mndm3pgi7z5enabfpi-dev';
const diagnosisTableName = 'Diagnosis-hg3tyrb5mndm3pgi7z5enabfpi-dev';
const patientTableName = 'Patient-hg3tyrb5mndm3pgi7z5enabfpi-dev';
const targetBucket = 'samosestest'; // 타겟 S3 버킷 이름

// PDF 파일을 생성하고 저장하는 함수
function createAndSavePDF(filePath, content) {
  const doc = new PDFDocument(); // PDFDocument 인스턴스 생성

  // 파일에 내용 추가
  doc.text(content);

  // 파일 저장
  doc.pipe(fs.createWriteStream(filePath));
  doc.end();
}

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

function processScriptItems(items) {
  items.forEach((item) => {
    const itemOwner = item.owner.S;
    const itemName = item.name.S; // Use 'name' attribute for folder creation
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

function processDiagnosisItems(items) {
  items.forEach((item) => {
    const itemOwner = item.owner.S;
    const itemName = item.name.S; // Use 'name' attribute for folder creation
    const itemCreatedAt = item.createdAt.S;
    const itemDate = itemCreatedAt.split('T')[0];
    const itemAttributes = ['createdAt', 'date', 'diagnosis', 'email', 'owner', 'patientID', 'updatedAt'];

    const diagnosisInfo = {};  // diagnosisInfo 변수를 정의

    itemAttributes.forEach((attribute) => {
      diagnosisInfo[attribute] = item[attribute].S;
    });

    // PDF 파일 경로 설정
    const pdfFilePath = path.join('/tmp', `${itemDate}_${itemName}_diagnosis-info.pdf`);

    const ownerFolderPath = `owner/${itemOwner}`;  // ownerFolderPath 변수 정의
    const diagnosisFolderPath = `${ownerFolderPath}/${itemName}`;
    const dateFolderPath = `${diagnosisFolderPath}/${itemDate}`;

    createFolder(targetBucket, ownerFolderPath)
      .then(() => {
        console.log(`Created folder for owner ${itemOwner}`);

        createFolder(targetBucket, diagnosisFolderPath)
          .then(() => {
            console.log(`Created subfolder for owner ${itemOwner}, diagnosis ${itemName}`);

            createFolder(targetBucket, dateFolderPath)
              .then(() => {
                console.log(`Created subfolder for owner ${itemOwner}, diagnosis ${itemName}, date ${itemDate}`);

                const diagnosisInfoString = JSON.stringify(diagnosisInfo, null, 2);

                const txtFilePath = path.join('/tmp', `${itemDate}_${itemName}_diagnosis-info.txt`);
                const fileContent = `diagnosis-info\n\n${diagnosisInfoString}`;
                createFile(txtFilePath, fileContent);

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

function createAndSavePDF(filePath, content) {
  const doc = new PDFDocument(); // PDFDocument 인스턴스 생성

  // 파일에 내용 추가
  doc.text(content);

  // 파일 저장
  doc.pipe(fs.createWriteStream(filePath));
  doc.end();
}

// Script 테이블 스캔
const scriptScanParams = {
  TableName: scriptTableName,
};

dynamoDB.scan(scriptScanParams, (err, data) => {
  if (err) {
    console.error('Error scanning Script table:', err);
  } else {
    const scriptItems = data.Items;
    processScriptItems(scriptItems);
  }
});

// Diagnosis 테이블 스캔
const diagnosisScanParams = {
  TableName: diagnosisTableName,
};

dynamoDB.scan(diagnosisScanParams, (err, data) => {
  if (err) {
    console.error('Error scanning Diagnosis table:', err);
  } else {
    const diagnosisItems = data.Items;
    processDiagnosisItems(diagnosisItems);
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
    const patientItems = data.Items;
    processPatientItems(patientItems);
  }
});
