const mongoose = require('mongoose');

// Connect to MongoDB
function connectMongoDb(url) {
    return mongoose.connect(url, {authSource: 'admin'});
}

// disconnect from MongoDB
async function disconnectMongoDb() {
    return mongoose.disconnect();
}

module.exports = { connectMongoDb };
