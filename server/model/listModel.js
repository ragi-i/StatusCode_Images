const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
  },
  name: { type: String, required: true },
  imageLinks: { type: [String], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

listSchema.pre('save', function (next) {
  if (this.isNew) {
    this.imageId = this._id;
  }
  next();
});
const List = mongoose.model('List', listSchema);

module.exports = List;

