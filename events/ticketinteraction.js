const client = require('../index');
const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  ButtonInteraction,
} = require('discord.js');

const DB = require('../models/Ticket');

const { PARENTID, EVERYONEID } = require('../config.json');

module.exports = {
  alias: 'Ticket Event',
  name: 'interactionCreate',
  /**
   *
   * @param {ButtonInteraction} interaction
   */

  execute: async (interaction) => {
    if (!interaction.isButton()) return;
    const { guild, member, customId } = interaction;

    if (!['mine', 'disc', 'otro'].includes(customId)) return;

    const ID = Math.floor(Math.random() * 90000) + 1000;

    await guild.channels.create(`${customId + '-' + ID}`, {
        type: "GUILD_TEXT",
        parent: PARENTID,
        permissionOverwrites: [
          {
            id: member.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
          },
          {
            id: EVERYONEID,
            deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
          },
        ],
      })
      .then(async(channel) => {
        await DB.create({
          GuildID: guild.id,
          MemberID: member.id,
          TicketID: ID,
          ChannelID: channel.id,
          Closed: false,
          Locked: false,
          Type: customId,
        });
        const embed = new MessageEmbed()
          .setAuthor({
            name: `${guild.name} | Ticket: ${ID}`,
            iconURL: `${guild.iconURL({ dynamic: true })}`,
          })
          .setDescription('Gracias por ponerte en contacto con nosotros, escribe tu problema y un miembro del staff se pondrá en contacto contigo tan pronto como sea posible!');

        const Buttons = new MessageActionRow();
        Buttons.addComponents(
          new MessageButton()
            .setCustomId('close')
            .setLabel('Save & Close Ticket')
            .setStyle('PRIMARY')
            .setEmoji('💾'),
          new MessageButton()
            .setCustomId('lock')
            .setLabel('Lock')
            .setStyle('SECONDARY')
            .setEmoji('🔒'),
          new MessageButton()
            .setCustomId('unlock')
            .setLabel('Unlock')
            .setStyle('SUCCESS')
            .setEmoji('🔓')
        );

        channel.send({
          embeds: [embed],
          components: [Buttons],
        });
        await channel
          .send({ content: `${member} Aquí está tu ticket!` })
          .then((m) => {
            setTimeout(() => {
              m.delete().catch(() => {});
            }, 1 * 5000);
          });

          await interaction.reply({
          content: `${member} Tu ticket ha sido creado: ${channel}`,
          ephemeral: true,
        });
      });
  },
};
