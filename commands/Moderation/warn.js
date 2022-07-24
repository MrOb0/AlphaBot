const WarnSchema = require('../../models/WarnSchema');
const mongoose = require('mongoose');
const { Client, Message, MessageEmbed, Permissions } = require('discord.js');

module.exports = {
  name: 'warn',
  description: 'Warn A Users',

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    const mentionedUser =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
      return message.channel.send('You Do Not Have Perms For That Command');
    } else if (!mentionedUser) {
      return message.channel.send('You Need to mention a Member to warn them!');
    }


    const MentionedPosition = mentionedUser.roles.highest.MentionedPosition;
    const memberPosition = message.member.roles.highest.position;

    if (memberPosition <= MentionedPosition) {
      message.channel.send(
        'You can not warn this person as their role position is higher/equal to yours'
      );
    }

    const reason = args.slice(1).join(' ') || 'Not Specified';

    let warnDoc = await WarnSchema.findOne({
      guildID: message.guild.id,
      memberID: mentionedUser.id,
    }).catch((err) => console.log(err));

    if (!warnDoc) {
      warnDoc = new WarnSchema({
        guildID: message.guild.id,
        memberID: mentionedUser.id,
        warnings: [reason],
        moderator: [message.member.id],
        date: [Date.now()],
      });

      await warnDoc.save().catch((err) => console.log(err));
      return message.channel.send(
        'You can not warn this person as their role position is higher/equal to yours'
      );
    } else {
      if (warnDoc.warnings.length >= 5) {
        return message.channel.send({
          content: 'This user has more than 5 warns on this guild!',
        });
      }

      warnDoc.warnings.push(reason);
      warnDoc.moderator.push(message.member.id);
      warnDoc.date.push(Date.now());

      await warnDoc.save().catch((err) => console.log(err));

      const Success = new MessageEmbed();

      
    client.usedlogs(
      {
        Command: 'Warn',
        Moderators: message.author,
        UsedIn: message.channelId,
      },
      message
    );


      const embed = new MessageEmbed()
        .setAuthor({
          name: `${message.guild.name}`,
          iconURL: `${message.guild.iconURL({ dynamic: true })}`,
        })
        .setColor('#FF4000')
        .setDescription(
          `Has sido advertido en **${message.guild.name}**\nReason: ${reason}`
        );

        client.modlogs(
          {
            Member: mentionedUser,
            Action: 'Warned',
            Color: 'YELLOW',
            Reason: reason,
            Moderator: message.member,
          },
          message
        );

      mentionedUser.send(embed);

      return message.channel.send(
        `Warned **${mentionedUser}** \n Reason: **${reason}**`
      );
    }
  },
};
