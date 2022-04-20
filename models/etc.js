const { Schema, model } = require('mongoose');

module.exports = model(
  'etc',
  new Schema({
    Guild: String,
    Channel: String,
  })
);
