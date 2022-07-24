const { Schema, model } = require('mongoose');

module.exports = model(
  'dellogs',
  new Schema({
    Guild: String,
    Channel: String,
  })
);
