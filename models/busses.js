const mongoose = require('mongoose');

const busSchema = mongoose.Schema({
    busNumber: {type: String, required: true},
    latitude: {type: String, required: true},
    longitude: {type: Number, required: true},
    departureFrom: {type: String, required: true},
    departureTo: {type: String, required: true},
    departureTime: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true}
});

module.exports = mongoose.model('Bus', busSchema);