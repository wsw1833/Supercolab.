const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MemberSchema = new Schema({
  walletId: {
    type: String,
    required: true,
    trim: true,
  },
  nickName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Approver', 'Recipient'],
    required: true,
  },
});

const UserMembersSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  memberList: [MemberSchema],
});

module.exports = mongoose.model('User', UserMembersSchema);
