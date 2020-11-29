import mongoose = require('mongoose');

/**
 * @category user schema
 */

export const UserModel = (() => {
  let schema = new mongoose.Schema({
    email: String,
    name: String,
    image: String,
    password: { type: Object, required: true },
    messages: [
      {
        tag: { type: String, default: 'unknown' },
        send: {
          date: { type: String, default: Date.now() },
          message: String,
        },
        reply: {
          date: { type: String, default: Date.now() },
          message: String,
        },
      },
    ],
  });

  return mongoose.model('user', schema);
})();

/**
 * @category bus schema
 */

export const BusModel = (() => {
  let schema = new mongoose.Schema({
    busId: { type: String, required: true },
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [89.8173, 22.9659],
        require: true,
      }, // <longitude>, <latitude>
    },
    gpsTime: { type: Date, default: Date.now() },
    departure: {
      from: { type: String, default: 'বশেমুরবিপ্রবি' },
      to: { type: String, default: 'লঞ্চঘাট' },
      startTime: { type: String, default: 'সকাল ৯টা' },
      endTime: { type: String, default: 'রাত ৯টা' },
    },
    image: { type: String, default: 'empty' },
    description: { type: String, default: 'empty' },
  });

  return mongoose.model('bus', schema);
})();
