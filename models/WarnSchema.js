const mongoose = require('mongoose')

const warnSchema = new mongoose.Schema ({
    guildID: String,
    memberId: String,
    warnings: Array,
    moderator: Array,
    date: Array
})

module.exports = mongoose.model('WarnSchema', warnSchema)