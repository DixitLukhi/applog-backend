const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
	appid: {
        type: String,
    },
    appName: {
        type: String,
        required: true,
    }, 
    appLogo: {},
    guidelines: []
});

module.exports = mongoose.model('App', appSchema);
