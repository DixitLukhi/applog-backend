const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
	appid: {
        type: String,
    },
    appName: {
        type: String,
        required: true,
    }, 
    appLogo: {
        type: String,
        required: true
    },
    guidelines: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('App', appSchema);
