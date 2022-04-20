const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kick An User',
  aliases: [],

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    if (!message.member.permissions.has('KICK_MEMBERS'))
      return message.reply({
        content:
          'You do not have permissions to use that! Required perms:`KICK_MEMBERS`',
        allowedMentions: { repliedUser: false },
      });
    client.usedlogs(
      {
        Command: 'Kick',
        Moderators: message.author,
        UsedIn: message.channelId,
      },
      message
    );
    if (!message.guild.me.permissions.has('KICK_MEMBERS'))
      return message.reply({
        content:
          'I do not have the required permissions, please give me the required permissions! Required perms:`KICK_MEMBERS`',
        allowedMentions: { repliedUser: false },
      });
    const target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    const reason = args.slice(1).join(' ') || 'No reason was specified';

    if (!target)
      return message.reply({
        content: 'Please specify a user to be kicked!',
        allowedMentions: { repliedUser: false },
      });

    if (target.id === message.author.id)
      return message.reply({
        content: 'You cannot kick yourself smh!',
        allowedMentions: { repliedUser: false },
      });
    if (target.id === message.guild.ownerId)
      return message.reply({
        content:
          'You cannot kick the server owner! *Imagine trying to kick the owner Lmaoo*',
        allowedMentions: { repliedUser: false },
      });
    if (target.id === client.user.id)
      return message.reply({
        content: "Please don't kick me D:",
        allowedMentions: { repliedUser: false },
      });
    if (target.roles.highest.position >= message.member.roles.highest.position)
      return message.reply({
        content:
          'You cannot kick that user due to their role being higher than you!',
        allowedMentions: { repliedUser: false },
      });

    if (!target.kickable)
      return message.reply({
        content:
          'I cannot kick that user due to role hierarchy! Please check my role position!',
        allowedMentions: { repliedUser: false },
      });

    try {
      target
        .send(
          `You have been kicked from **${message.guild.name}**\nReason: ${reason}`
        )
        .catch((e) => {
          message.reply({
            content: 'Cannot send a dm to that person!',
            allowedMentions: { repliedUser: false },
          });
        });

      client.modlogs(
        {
          Member: target,
          Action: 'Kicked',
          Color: 'RED',
          Reason: reason,
          Moderator: message.member,
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
          `You Have Been Kicked From **${message.guild.name}**\nReason: ${reason}`
        );

      target.send(embed);

      target.kick(reason);

      message.reply({
        content: `Successfully kicked **${target.user.tag}**`,
        allowedMentions: { repliedUser: false },
      });
    } catch (e) {
      return message.reply({
        content: `Something went wrong! If you think this is a bug please report it to our devs by  \nError msg:\n${e}`,
      });
    }
  },
};
