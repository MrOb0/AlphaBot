const {
  Client,
  Message,
  MessageEmbed,
  MessageMentions,
} = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Bans A User',
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    if (!message.member.permissions.has('BAN_MEMBERS'))
      return message.reply({
        content: `You don't have permissions to use that!`,
        allowedMentions: { repliedUser: false },
      });

    client.usedlogs(
      {
        Command: 'Ban',
        Moderators: message.author,
        UsedIn: message.channelId,
      },
      message
    );

    if (!message.guild.me.permissions.has('BAN_MEMBERS'))
      return message.reply({
        content:
          'I do not have the required permissions, please give me the required permissions! Required perms:`BAN_MEMBERS`',
        allowedMentions: { repliedUser: false },
      });
    const target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    const reason = args.slice(1).join(' ') || '';

    if (!target)
      return message.reply({
        content: 'Specify a user to ban',
        allowedMentions: { repliedUser: false },
      });

    if (target.id === message.author.id)
      return message.reply({
        content: `You can't ban yourself smh!`,
        allowedMentions: { repliedUser: false },
      });
    if (target.id === message.guild.ownerId)
      return message.reply({
        content:
          `You can't ban the owner of the server!`,
        allowedMentions: { repliedUser: false },
      });
    if (target.id === client.user.id)
      return message.reply({
        content: `Please don't ban me D:`,
        allowedMentions: { repliedUser: false },
      });
    if (target.roles.highest.position >= message.member.roles.highest.position)
      return message.reply({
        content: `You can't ban your superiors`,
        allowedMentions: { repliedUser: false },
      });

    if (!target.bannable)
      return message.reply({
        content: ' ',
        allowedMentions: { repliedUser: false },
      });

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.guild.name}`,
        iconURL: `${message.guild.iconURL({ dynamic: true })}`,
      })
      .setColor('#FF4000')
      .setDescription(
        `You Have Been Ban **${message.guild.name}**\nReason: ${reason}`
      );

    try {
      target.send({ embeds: [embed] }).catch((e) => {
        message.reply({
          content: 'Cannot send a dm to that person!',
          allowedMentions: { repliedUser: false },
        });
      });

      client.modlogs(
        {
          Member: target,
          Action: 'Banned',
          Color: 'RED',
          Reason: reason,
          Moderator: message.member,
        },
        message
      );

      target.ban({ reason });

      message.reply({
        content: `Successfully banned <@${target.user.id}>`,
        allowedMentions: { repliedUser: false },
      });
    } catch (e) {
      return message.reply({
        content: `Something went wrong! If you think this is a bug please report it to our devs \nError msg:\n${e}`,
      });
    }
  },
};
