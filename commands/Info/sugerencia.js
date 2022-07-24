    const {
        Client,
        Message,
        MessageEmbed,
        MessageMentions,
      } = require('discord.js');

    const suggestdata = require('../../models/suggestdata')

      module.exports = {
          name: 'suggest',
          description: 'Create A Suggestion',
          /**
           *
           * @param {Client} client
           * @param {Message} message
           * @param {String[]} args
           */

          run: async (client, message, args) => {
                message.delete(1000);
              const squery = args.join(" ")
              const data = await suggestdata.findOne({ Guild: message.guild.id });
              const channels = message.guild.channels.cache.get(data.Channel)

              if(!squery) return message.channel.send(`Please Specify A Suggestion! <@${message.author.id}>`)

              const messagess = args.join(" ")

              const Embed = new MessageEmbed()
              .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
              .setColor('GOLD')
              .addField('Submitter', `<@${message.author.id}>`)
              .addField('Suggestion',`${messagess}`)
              .setFooter(`User ID: ${message.author.id} | Pop Bot`)
              .setTimestamp();

            const msg = await channels.send({ embeds: [Embed] })
              msg.react('✔')
              msg.react('❌')
          }
      }