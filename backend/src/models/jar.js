const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementFactory = require('mongoose-sequence')(mongoose);

const JarSchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  jarId: {
    type: String,
    unique: true,
  },
  multiSig: String,
  scheduleId: String,
  scheduleTxId: String,
  topicId: String,
  projectName: String,
  description: String,
  amount: String,
  tokenType: String,
  creator: String,
  recipient: String,
  approvers: [String],
  status: {
    type: String,
    default: 'Pending',
  },
  threshold: Number,
  URILink: String,
  approvals: {
    type: [[String]],
    default: [[]],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: Date,
});

JarSchema.plugin(AutoIncrementFactory, {
  inc_field: 'id',
  start_seq: 1,
});

module.exports = mongoose.model('Jar', JarSchema);
