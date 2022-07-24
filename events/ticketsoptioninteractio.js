const {
  MessageEmbed,
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
} = require('discord.js');

const client = require("../index");

const { createTranscript } = require('discord-html-transcripts');

const TicketSetupData = require('../models/TicketSetup')

const DB = require('../models/Ticket');


client.on("interactionCreate",

  /**
   *
   * @param {ButtonInteraction} interaction
   */

async (interaction) => {
    if (!interaction.isButton()) return;
    const { guild, customId, channel, member } = interaction;
    
    if (!['close', 'lock', 'unlock', 'claim'].includes(customId)) return;

    const TicketSetup = await TicketSetupData.findOne({ GuildID: guild.id });
    if(!TicketSetup) return interaction.followUp({ content: 'The Data For This System is outdated!' })

    if (!member.roles.cache.find((r) => r.id === TicketSetup.Handlers))
      return interaction.reply({ content: 'You cannot use these buttons.', ephemeral: true });

    const Embed = new MessageEmbed().setColor('BLUE');

    DB.findOne({ ChannelID: channel.id }, async (err, docs) => {
      if (err) throw err;
      if (!docs)
        return interaction.followUp({
          content:
            'No data was found related to this ticket, please delete manualy.',
          ephemeral: true,
        });
      switch (customId) {
        case 'lock':
          if (docs.Locked == true)
            return interaction.reply({
              content: 'The Ticket is already locked',
              ephemeral: true,
            });
          await DB.updateOne({ ChannelID: channel.id }, { Locked: true });
          Embed.setDescription('🔒| This Ticket is unlocked');

          docs.MembersID.forEach((m) => {
            channel.permissionOverwrites.edit(m, {
              SEND_MESSAGES: false,
          });
        })
          interaction.reply({ embeds: [Embed] });
          break;
        case 'unlock':
          if (docs.Locked == false)
            return interaction.reply({
              content: 'The Ticket is already unlocked',
              ephemeral: true,
            });
          await DB.updateOne({ ChannelID: channel.id }, { Locked: false });
          Embed.setDescription('🔓| This Ticket is unlocked');
          docs.MembersID.forEach((m) => {
            channel.permissionOverwrites.edit(m, {
              SEND_MESSAGES: true,
          });
        })
          in
          interaction.reply({ embeds: [Embed] });
          break;
        case 'close':
          if (docs.Closed == true)
            return interaction.reply({
              content:
                'Ticket is already closed, please wait for it to get deleted',
              ephemeral: true,
            });
            
          const attachment = await createTranscript(channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `${docs.Type} - ${docs.TicketID}.html`,
          });
          await DB.updateOne({ ChannelID: channel.id }, { Closed: true });
          const Message = await guild.channels.cache.get(TicketSetup.Transcripts).send({
            embeds: [Embed.setTitle(
                `Transcript Type: ${docs.Type}\nID: ${docs.TicketID}`
              ),
            ],
            files: [attachment],  
          });

      

        await interaction.reply({
            embeds: [
              Embed.setDescription(
                `Ticket Has Been Closed \nThe Transcript For ${docs.TicketID} is now saved [TRANSCRIPT](${Message.url})`
              ),
            ],
          });
          setTimeout(() => {
            channel.delete();
          }, 10 * 1000);

      }
    });
  },)
