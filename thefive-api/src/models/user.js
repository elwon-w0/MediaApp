var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 1 * 60 * 60 * 1000; //One hour

var UserSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    profile: {
        type: String
    },
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        index: true,
        trim: true
    },
  password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number, default: 1 }
},{timestamps: true});

UserSchema.plugin(uniqueValidator, {'msg': 'is already taken.'});
 
UserSchema.virtual('isLocked').get(function() {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
    });

UserSchema.pre('save',  function(next) {
    var user = this;
 
     if (!user.isModified('password') ) return next();

        bcrypt.hash(user.password, 10, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
});

var reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};
 
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        } 
        cb(null, isMatch);
    });
};

UserSchema.methods.incLoginAttempts = function(cb) { 
    // if we have a previous lock that has expired, restart at 1 
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } }, cb); 
    } 
    // otherwise we're incrementing 
    var updates = { $inc: { loginAttempts: 1 } }; 
    // lock the account if we've reached max attempts and it's not locked already 
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) { 
        updates.$set = { lockUntil: Date.now() + LOCK_TIME }; 
    } 
    return this.updateOne(updates, cb); 
};

UserSchema.statics.getAuthenticated = function(username, password, cb) {
    this.findOne({ username: username }, function(err, user) { 
        if (err) return cb(err);
        // make sure the user exists
    if (!user) {
        return cb(null, null, reasons.NOT_FOUND);
    }

    // check if the account is currently locked
    if (user.isLocked) {
        // just increment login attempts if account is already locked
        return user.incLoginAttempts(function(err) {
            if (err) return cb(err);
            return cb(null, null, reasons.MAX_ATTEMPTS);
        });
    }

    // test for a matching password
    user.comparePassword(password, function(err, isMatch) {
        if (err) return cb(err);

        // check if the password was a match
        if (isMatch) {
            // if there's no lock or failed attempts, just return the user
            if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
            // reset attempts and lock info
            var updates = {
                $set: { loginAttempts: 0 },
                $unset: { lockUntil: 1 }
            };
            return user.update(updates, function(err) {
                if (err) return cb(err);
                return cb(null, user);
            });
        }

        // password is incorrect, so increment login attempts before responding
        user.incLoginAttempts(function(err) {
            if (err) return cb(err);
            return cb(null, null, reasons.PASSWORD_INCORRECT);
        });
    });
    });
}

 
module.exports = mongoose.model('MemberList', UserSchema);