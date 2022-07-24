const warnSchema = require('../../models/WarnSchema')
const mongoose = require('mongoose')
const { Client, Message, MessageEmbed, Permissions } = require("discord.js");

module.exports = {
    name: 'unwarn',
    description: 'Unwarn A User',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async(client, message, args) => {
        const mentionedUser = message.mentions.users.first();

        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.channel.send('You Do Not have Permission to Unwarn someone')
          } else if (!mentionedUser) {
            return message.channel.send('You Need to mention a Member to Unwarn !');
          }

          client.usedlogs(
            {
              Command: 'Unwarn',
              Moderators: message.author,
              UsedIn: message.channelId,
            },
            message
          )

          const reason = args.slice(2).join(" ") || "Not Specified";

          const WarnDoc = await warnSchema.findOne({
              guildID: message.guild.id,
              memberID: mentionedUser.id,
          })
          .catch((err) => console.log(err));

          if(!WarnDoc || !WarnDoc.warnings.length) {
              return message.channel.send(`${mentionedUser} doesnt have any warns`)
          }

          const warnID = parseInt(args[0]);
          if(!warnID) {

              message.channel.send('No warn Id specified ! Please provide a warn Id to clear .\n To check warn id, use !pop warnings <@user> \n The correct usage of this command is !pop unwarn [warnID] <@user>')
          }
          
          if (warnID <= 0 || warnID > WarnDoc.warnings.lenght) {
              message.channel.send('This is an invalid warning Id')
          }

          WarnDoc.warnings.splice(warnID - 1, warnID !==1 ? warnID -1 : 1);

          await WarnDoc.save().catch((err) => console.log(err));



          message.channel.send(`Unwarned ${mentionedUser} \n **Reason:** ${reason ? `**${reason}**` : ""}`)
          client.modlogs(
            {
              Member: mentionedUser,
              Action: 'UnWarned',
              Color: 'YELLOW',
              Reason: reason,
              Moderator: message.member
            },
            message
          );

    }
}
