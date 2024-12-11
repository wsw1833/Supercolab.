import { Schema, model, models } from 'mongoose'
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const JarSchema = new Schema({
  id: {
    type: Number,
    unique: true, 
  },
  fileId: String,
  scheduleId: String,
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
    default: 'PENDING'
  },
  approvals: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date
})

JarSchema.plugin(AutoIncrement, { id: 'jar_id_counter', inc_field: 'id', start_seq: 1 });

export const Jar = models.Jar || model('Jar', JarSchema)