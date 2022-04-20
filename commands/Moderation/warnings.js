const warnSchema = require('../../models/WarnSchema');
const mongoose = require('mongoose');
const { MessageEmbed, Message } = require('discord.js');

module.exports = {
  name: 'warnings',
  description: 'Check warnings',
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const mentionedUser = message.mentions.users.first() || message.member;

    const warnDoc = await warnSchema
      .findOne({
        guildID: message.guild.id,
        memberID: mentionedUser.id,
      })
      .catch((err) => console.log(err));

    if (!warnDoc || !warnDoc.warnings.length) {
      return message.channel.send({
        content: `${mentionedUser} has no warnings`,
      });
    }

    const data = [];

    for (let i = 0; warnDoc.warnings.length > i; i++) {
      data.push(`**ID:** ${i + 1}`);
      data.push(`**Reason:** ${warnDoc.warnings[i]}`);
      data.push(
        `**Moderator:** ${await message.client.users
          .fetch(warnDoc.moderator[i])
          .catch(() => 'Deleted User')}`
      );
      data.push(
        `**Date:** ${new Date(warnDoc.date[i]).toLocaleDateString()}\n`
      );
    }

    client.usedlogs(
      {
        Command: 'Warnings',
        Moderators: message.author,
        UsedIn: message.channelId,
      },
      message
    )

    const embed = new MessageEmbed()
      .setThumbnail(mentionedUser.displayAvatarURL({ dynamic: false }))
      .setColor('RANDOM')
      .setDescription(data.join('\n'));
      
      

    message.channel.send({ embeds: [embed] });

    const e = None
    client.modlogs(
      {
        Member: mentionedUser,
        Action: 'Used Warnings Command',
        Reason: e,
        Color: 'RED',
        Moderator: message.member
      },
      message
    );
  },
};
