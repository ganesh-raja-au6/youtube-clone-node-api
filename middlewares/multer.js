const [path, multer, { v4: uuidv4 }] = [
  require("path"),
  require("multer"),
  require("uuid"),
];
// Generate Uniqid
const uniqId = uuidv4();

// Set the storage engine
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname.replace(path.extname(file.originalname), "") +
        "_" +
        Date.now() +
        uniqId +
        path.extname(file.originalname)
    );
  },
});

// video upload
exports.multerUploadvideo = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    // checkFileType(file, cb);
    // Allowed ext
    const filetypes = /mp4|mpeg-4|webm|mov/;
    // Check ext
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Unsupported video.");
    }
  },
}).single("video");

// Image upload
exports.multerUploadSinglePhoto = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    // checkFileType(file, cb);
    // Allowed ext
    const filetypes = /jpeg|jpg|png|/;
    // Check ext
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Unsupported Image format.");
    }
  },
}).single("photo");