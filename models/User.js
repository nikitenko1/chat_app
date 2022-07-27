const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    userId: {
      type: String,
      unique: true,
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dvpy1nsjp/image/upload/v1635570881/sample.jpg',
    },
    type: {
      type: String,
      default: 'register',
    },
    rf_token: {
      type: String,
      select: false,
    },
    friends: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.index({ userId: 'text' });
const users = mongoose.model('user', userSchema);
// Allow text search over the userId field:
users.createIndexes({ userId: 'text' });

module.exports = users;
