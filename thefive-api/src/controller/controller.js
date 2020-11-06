var User = require('../models/user');
var passwordResetToken = require('../models/reset');
var Image = require('../models/public');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var config = require('../config/config');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

   
function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: 200 // 86400 expires in 24 hours
      });
}
 
exports.registerUser = (req, res) => {
    if (!req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).json({ 'msg': 'Please make sure fields are not empty' });
    }

    User.findOne({ username: req.body.username }, (err, user) => {
        if (user) {
            return res.status(400).json({ 'msg': 'The username already exists' });
        }
        else {
            User.findOne({ email: req.body.email }, (err, user) => {
                if (err) {
                    return res.status(400).json({ 'msg': "Error processing registration." });
                }
         
                if (user) {
                    return res.status(400).json({ 'msg': 'The email already exists' });
                }
                let newUser = User(req.body);
                newUser.save((err, user) => {
                    if (err) {
                        return res.status(400).json({ 'msg': "Please check your input fields." });
                    }
                    return res.status(200).json({ 'msg': "Registration succeess!" });
                    
                });
            })
        }
    })
}
    
    
 
exports.loginUser = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ 'msg': 'You need to send email and password' });
    }
 
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).send({ 'msg': err });
        }
 
        if (!user) {
            return res.status(400).json({ 'msg': 'The email and password don\'t match.' });
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                user.updateOne(updates, function(err) {
                    if (err) return res.status(400).send({ 'msg': err });;
                });
                return res.status(200).json({
                    token: createToken(user)
                });
            } else {
                // password is incorrect, so increment login attempts before responding
                    user.incLoginAttempts(function(err) {
                        if (err) return res.status(400).send({ 'msg': err });;
                    });
                    return res.status(400).json({ 'msg': 'The email and password don\'t match.' });
            }
        });
    });
};


exports.uploadFile = (req, res) => {
    const tok = JSON.parse(JSON.stringify(req.body)).token;
    const caption = JSON.parse(JSON.stringify(req.body)).caption;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ 'msg': "Error uploading file" });
    }
    else {
        User.findOne({ email: tok }, (err, user) => {
            if (err) {
                return res.status(400).send({ 'msg': err });
            }
            var newImage = new Image({ 
                _userId: user._id, 
                filename: file.filename,
                originalName: file.originalname,
                desc: caption
            });
            newImage.save((err, user) => {
                if (err) {
                    return res.sendStatus(400).json({ 'msg': 'Something went wrong' });;
                }
                return res.status(201).send({ newImage });
            });   
        });
    }
}

exports.getImages = (req, res) => {
    // use lean() to get a plain JS object
    // remove the version key from the response
    let UPLOAD_PATH = 'uploads';
    Image.find({}, '-__v').lean().exec(async(err, images) => {
        if (err) {
            res.sendStatus(400)({ 'msg': 'Something went wrong' });
        }
        
        // Manually set the correct URL to each image
        for (let i = 0; i < images.length; i++) {
            await User.findOne({ _id: images[i]._userId }, (err, user) => {
                if (user.gender === 'F') {
                    images[i]['profile'] = 'http://www.pngall.com/wp-content/uploads/5/Profile-Female-PNG-Image.png'
                } else {
                    images[i]['profile'] = 'http://www.pngall.com/wp-content/uploads/5/Profile-Male-Transparent.png'
                }
                images[i]['username'] = user.username;
                images[i]['url'] = req.protocol + '://' + req.get('host') + '/api/images/' + images[i]._id;
                // return res.json(images);
            });
        }
        return res.json(images);
    })
}

exports.getImagesbyID = (req, res, next) => {
    let imgId = req.params.id;
    let UPLOAD_PATH = 'uploads';
 
    Image.findById(imgId, (err, image) => {
        if (err) {
            res.sendStatus(400);
        }
        // stream the image back by loading the file
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(UPLOAD_PATH, image.filename)).pipe(res);
    });
}