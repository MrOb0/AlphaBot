const {
  Message,
  Client,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");
const ms = require("ms");
module.exports = {
  name: "unmute",
  aliases: ["uto"],
  description: "Un-Mute A User!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    client.usedlogs(
      {
        Command: "Un-Mute",
        Moderators: message.author,
        UsedIn: message.channelId,
      },
      message
    );

    try {
      const aut = message.author;
      const user = message.mentions.members.first();

      const reason = args.slice(1).join(" ");
      const member = message.guild.members.cache.get(user.id);
      if (!message.member.permissions.has("MANAGE_MESSAGES")) {
        return message.channel.send(
          "You Do Not have Permission to Un-Mute Someone"
        );
      } else if (!user) {
        return message.channel.send(
          "You Need to mention a Member to Un-Mute !"
        );
      }

      if (!user.isCommunicationDisabled(false))
        return message.reply("User Is Not Muted");

      client.modlogs(
        {
          Member: user,
          Action: "Un-Mute",
          Color: "RED",
          Reason: reason,
          Moderator: aut,
        },
        message
      );

      user.timeout(null);
      message.reply(`${user.user.tag} Has been unmuted! `);
    } catch (e) {
      message.channel.send({ content: `${e}` });
      return console.log(e);
    }
  },
};
