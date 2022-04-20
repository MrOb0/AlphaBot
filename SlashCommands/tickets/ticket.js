const { Client, CommandInteraction, MessageActionRow, MessageEmbed, MessageButton } = require("discord.js")

const {OPENTICKET} = require("./../../config.json")

module.exports = {
    name: "ticketssetup",
    description: "Setup you ticketing message",
    userPermissions: ["MANAGE_MESSAGES"],
     /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
      run: async (client, interaction, args) => {
          const insane = interaction.user
          const { guild } = interaction;
          const embed = new MessageEmbed()
              .setAuthor(guild.name + " | Ticketing System", guild.iconURL({ dynamic: true }))
              .setDescription("Selecciona una de las siguientes opciones para ponerte en contacto con el staff!")
              .setColor('#b98ffc')

              const Buttons = new MessageActionRow()
              Buttons.addComponents(
                  new MessageButton ()
                  .setCustomId("mine")
                  .setLabel("Minecraft")
                  .setStyle("SUCCESS")
                  .setEmoji('a:AN_McPikachuPicando:862071281314955294'),
                  new MessageButton()
                  .setCustomId("disc")
                  .setLabel('Discord')
                  .setStyle('SECONDARY')
                  .setEmoji('<:859900653920452658:957328885584920596>'),
                  new MessageButton()
                  .setCustomId('otro')
                  .setLabel('Otro')
                  .setStyle('PRIMARY')
                  .setEmoji('<:9208494583910564362:957328739535052960>')
              )

  await guild.channels.cache.get(OPENTICKET).send({
      embeds: [embed],
      components: [Buttons]
  })

  interaction.followUp('Sent In Ticket Channel')
      }
}