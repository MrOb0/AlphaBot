const { Schema, model } = require('mongoose');

module.exports = model(
  'usedlogs',
  new Schema({
    Guild: String,
    ChannelID: String,
  })
);
