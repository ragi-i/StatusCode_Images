const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
      userId: {
          type: mongoose.Schema.Types.ObjectId,
          unique: true,
        },
        fullname: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: [true, "Email is required"],
          unique: true,
        },
        password: {
          type: String,
          required: [true, "Please provide a password"],
        },
  imageList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
});

userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.userId = this._id;
  }
  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
