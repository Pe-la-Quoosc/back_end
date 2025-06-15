const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  body: { type: Object, required: true },
  processed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('WebhookLog', webhookLogSchema);