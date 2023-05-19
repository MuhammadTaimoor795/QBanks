const multer = require("multer");
const fs = require("fs");
const { ApiError } = require("../utils/error");

let date = new Date();

const storage = multer.diskStorage({
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file

      throw new ApiError(
        `Unsupported file type ${extname(file.originalname)}`,
        HttpStatus.BAD_REQUEST
      );
    }
  },
  limits: {
    fileSize: 2000000,
  },
  destination: function (req, file, cb) {
    const type = req.body.imageType;

    let __dir = `public/`;
    let __dirMiddle = `public/pictures`;
    let __dirNext = `public/pictures/` + `${type}/`;
    try {
      if (fs.existsSync(__dir)) {
        console.log("File exists");
      } else {
        fs.mkdirSync(__dir);
      }
      // console.log("__dirname 1", __dir);
      if (fs.existsSync(__dirMiddle)) {
        console.log("file exists");
      } else {
        fs.mkdirSync(__dirMiddle);
      }
      // console.log("__dirname 2", __dirNext);
      if (fs.existsSync(__dirNext)) {
        console.log("file exists");
      } else {
        fs.mkdirSync(__dirNext);
      }
    } catch (e) {
      console.log("in error: ");
      console.log(e);
    }
    cb(null, __dirNext);
  },
  // req.sName = file.originalname;
  filename: function (req, file, cb) {
    req.name = file.originalname.toString().replace(/\s/g, "");
    console.log("File Name:", req.name);
    req.imageType = req.body.imageType;
    // req.Id = req.user.id;
    req.file = file;
    req.date = Date.now();
    let time = new Date();
    req.time =
      time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    cb(null, req.name);
    // console.log("File Name", req.name);
  },
});
const upload = multer({ storage: storage });

module.exports = { upload };
