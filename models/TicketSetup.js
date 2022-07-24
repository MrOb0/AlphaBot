const { Schema, model } = require('mongoose');

module.exports = model(
  'Ticket-Setup',
  new Schema({
    GuildID: String,
    ChannelID: String,
    Category: String,
    Transcripts: String,
    Handlers: String,
    Description: String,
    Buttons: [String],
  })
);
