const {
  Message,
  Client,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require('discord.js');
const ms = require('ms');
module.exports = {
  name: 'mute',
  description: 'Mute A User',
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    client.usedlogs(
      {
        Command: 'Mute',
        Moderators: message.author,
        UsedIn: message.channelId,
      },
      message
    );

    

    
    try {
      const aut = message.author;
      const user = message.mentions.members.first();
      if (!message.member.permissions.has("MANAGE_MESSAGES")) {
        return message.channel.send('You Do Not have Permission to Mute Someone')
      } else if (!user) {
        return message.channel.send('You Need to mention a Member to Mute !');
      }
      const time = args[1];
      const reason = args.slice(2).join(' ') || 'No reason provided';
      const member = message.guild.members.cache.get(user.id);
      const timeInMs = ms(time);
      if (!timeInMs)
        return message.channel.send({ content: `Provide a valid time` });
        message.guild.

        client.modlogs(
          {
            Member: user,
            Action: 'Mute',
            Color: 'RED',
            Reason: reason,
            Moderator: aut,
          },
          message
        );
      await member.timeout(timeInMs, reason);

      const embed = new MessageEmbed()
        .setTitle(`Successfully muted out ${user}`)
        .setDescription(`Muted  ${user} for ${time}`)
        .addField('Reason :', `${reason}`);
      message.channel.send({ embeds: [embed] });
    } catch (e) {
      message.channel.send({ content: `${e}` });
      return console.log(e);
    }
  },
};
