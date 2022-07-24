const client = require('../index');
const logSchema = require('../models/deletedSchema');

const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'messageDelete',
  /**
   * @param {Message} message
   */
  execute: async (message) => {

    if(message.author.bot) return;
    const data = await logSchema.findOne({ Guild: message.guild.id });
    if (!data) return;
  
    const channel = message.guild.channels.cache.get(data.Channel);
  
    const embed = new MessageEmbed()
      .setDescription(
        `Mensaje enviado por <@${message.author.id}> eliminado en <#${message.channel.id}> \n ${message.content}`
      )
      .setTimestamp()
      .setAuthor({
        name: `${message.author.tag}`,
        iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
      })
      .setColor('GREEN');
  
    channel.send({ embeds: [embed] });

  }

};
