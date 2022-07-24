const client = require('../index');
const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  ButtonInteraction,
} = require('discord.js');

const DB = require('../models/Ticket');

const TicketSetupData = require('../models/TicketSetup')

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

    const Data = await TicketSetupData.findOne({ GuildID: guild.id })
    if(!Data.Buttons.includes(customId)) return;

    const ID = Math.floor(Math.random() * 90000) + 1000;

    await guild.channels.create(`${customId + '-' + ID}`, {
        type: "GUILD_TEXT",
        parent: Data.Category,
        permissionOverwrites: [
          {
            id: member.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
          },
          {
            id: Data.EveryoneID,
            deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
          },
        ],
      })
      .then(async(channel) => {
        await DB.create({
          GuildID: guild.id,
          MembersID: member.id,
          TicketID: ID,
          ChannelID: channel.id,
          Closed: false,
          Locked: false,
          Type: customId,
          Claimed: false,

        });
        const embed = new MessageEmbed()
          .setAuthor({
            name: `${guild.name} | Ticket: ${ID}`,
            iconURL: `${guild.iconURL({ dynamic: true })}`,
          })
          .setDescription('Thank you for contacting us, write your problem and a staff member will contact you as soon as possible!')
          .setFooter({ text: "These Buttons Are Staff Only Buttons!" })
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
            .setEmoji('🔓'),
        );

        channel.send({
          embeds: [embed],
          components: [Buttons],
        });
        await channel
          .send({ content: `${member} Here Is Your Ticket!` })
          .then((m) => {
            setTimeout(() => {
              m.delete().catch(() => {});
            }, 1 * 5000);
          });

          await interaction.reply({
          content: `${member} Your Ticket Has Been Created !: ${channel}`,
          ephemeral: true,
        });
      });
  },
};
