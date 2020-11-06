var express         = require('express'),
    routes          = express.Router();
var userController  = require('./controller/controller');
var passport	    = require('passport');
var multer          = require("multer");
var path            = require('path');
const url           = 'uploads';

var storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, url);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({
    storage: storage
});

 
routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);
routes.post('/fileupload', upload.single('file'), userController.uploadFile);
// Get all uploaded images
routes.get('/images', userController.getImages);
routes.get('/images/:id', userController.getImagesbyID);
 
module.exports = routes;