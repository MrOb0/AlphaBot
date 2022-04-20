const {
  MessageEmbed,
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
} = require('discord.js');

const client = require("../index");

const { createTranscript } = require('discord-html-transcripts');

const { TRANSCRIPTSID } = require('../config.json');

const DB = require('../models/Ticket');


client.on("interactionCreate",

  /**
   *
   * @param {ButtonInteraction} interaction
   */

async (interaction) => {
    if (!interaction.isButton()) return;
    const { guild, customId, channel, member } = interaction;

    if (!member.permissions.has('MANAGE_MESSAGES'))
      return interaction.reply({ content: 'You cannot use these buttons.', ephemeral: true });

    if (!['close', 'lock', 'unlock'].includes(customId)) return;
    const Embed = new MessageEmbed().setColor('BLUE');

    DB.findOne({ ChannelID: channel.id }, async (err, docs) => {
      if (err) throw err;
      if (!docs)
        return interaction.reply({
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
          channel.permissionOverwrites.edit(docs.MemberID, {
            SEND_MESSAGES: false,
          });
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
          channel.permissionOverwrites.edit(docs.MemerID, {
            SEND_MESSAGES: true,
          });
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

          const MEMBER = guild.members.cache.get(docs.MemberID);
          console.log(MEMBER);
          const Message = await guild.channels.cache.get(TRANSCRIPTSID).send({
            embeds: [
              Embed.setAuthor({
                name: `${MEMBER.user.tag}`,
                iconURL: `${MEMBER.displayAvatarURL({ dynamic: true })}`,
              }).setTitle(
                `Transcript Type: ${docs.Type}\nID: ${docs.TicketID}`
              ),
            ],
            files: [attachment],
          });

      

        await interaction.reply({
            embeds: [
              Embed.setDescription(
                `The Transcript is now saved[TRANSCRIPT](${Message.url})`
              ),
            ],
          });
      }
    });
    setTimeout(() => {
      channel.delete();
    }, 10 * 1000);
  },)
