const { Schema, model } = require('mongoose');

module.exports = model(
  'suggest',
  new Schema({
    Guild: String,
    Channel: String,
  })
);
