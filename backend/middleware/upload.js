const multer = require("multer");


const excelFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
        cb(new Error('Please upload an Excel'))
    }
    cb(null, true)
};

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/uploads/");
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname + '-' + Date.now());
    },
});

var uploadFile = multer({ 
    storage: storage,
    // limits : {
    //     fileSize : 1000000
    // },
    // fileFilter: excelFilter 
}).any();

module.exports = {
    uploadFile
};