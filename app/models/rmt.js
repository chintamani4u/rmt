var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var rmtSchema   = new Schema({
	name: String,
    task: String,
    time: String
});

module.exports = mongoose.model('rmt', rmtSchema);