const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userInfo: {
        id: String,
        name: String,
        profilePhoto: String
    },
    chatInfo: {
        messageType: {type: String, required: true},
        message: {type: String, required: true},
        date: {type: String, required: true},
        time: {type: String, required: true}
    }
});

module.exports = mongoose.model('Chat', chatSchema);




// const mongoose = require('mongoose');

// const userInfo = mongoose.Schema({
//     id: {type: String, required: true},
//     name: {type: String, required: true},
//     profilePhoto: {type: String, required: true}
// });

// const chatInfo = mongoose.Schema({
//     messageType: {type: String, required: true},
//     message: {type: String, required: true},
//     date: {type: String, required: true},
//     time: {type: String, required: true}
// });

// mongoose.model('userInfo', userInfo, 'userInfo');
// mongoose.model('chatInfo', chatInfo, 'chatInfo');

// const chatSchema = mongoose.Schema({
//     userInfo: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'userInfo'
//     },
//     chatInfo: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'chatInfo'
//     }
// });

// module.exports = mongoose.model('Chat', chatSchema, 'Chat');