const multer = require('fastify-multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, '/www/nas/records/');
    },
    filename(req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
      // cb(null, file.originalname);
    },
  });
  
  const fileFilter = (req, file, cb) => {
    const typeArray = file.mimetype.split('/');
    const fileType = typeArray[1];
    const fileName = file.fieldname;
    
    console.log(file);
    if (fileName === 'audio') {
      if (fileType === 'mpeg' || fileType === 'wav') {
        cb(null, true);
      } else {
        cb(new Error('mp3, wav 파일만 업로드 가능합니다.'), false);
      }
    }
    // else if (fileName === 'image') {
    //   if (fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg') {
    //     cb(null, true);
    //   } else {
    //     cb(new Error('jpg, jpeg, png 파일만 업로드 가능합니다.'), false);
    //   }
    // }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 1024 * 1024, // 1MB limit
    },
  });
  
  const cpUpload = upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'image', maxCount: 3 }]);

  
module.exports = {
    cpUpload,
    multer,
  };