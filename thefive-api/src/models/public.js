var mongoose = require('mongoose');
 
 
  // Actual DB model
  var imageSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    filename: String,
    originalName: String,
    desc: String,
    created: { type: Date, default: Date.now }
});
 
module.exports = mongoose.model('PostList', imageSchema);