    const { Client, CommandInteraction, MessageActionRow, MessageEmbed, MessageButton, Emoji } = require("discord.js")

    const DB = require('../../models/TicketSetup')

    module.exports = {
        name: "ticket-setup",
        description: "Setup you ticketing message",
        userPermissions: ["MANAGE_MESSAGES"],
        options: [
            {
                name: 'channel',
                description: 'Select Ticket Home Channel',
                type: 'CHANNEL',
                required: true,
                channelTypes: ["GUILD_TEXT",]
            },
            {
                name: 'category',
                description: 'Select The Catergory Where Tickets While Be Under',
                type: 'CHANNEL',
                required: true,
                channelTypes: ["GUILD_CATEGORY",]
            },
            {
                name: 'transcripts',
                description: 'Where Transcripts Will Be Sent',
                type: 'CHANNEL',
                required: true,
                channelTypes: ["GUILD_TEXT",]
            },
            {
                name: 'handlers',
                description: 'Select The Ticket Handler Role',
                type: 'ROLE',
                required: true,
            },
            {
                name: 'description',
                description: 'Set The Description For The Embed!',
                type: 'STRING',
                required: true,
            },
            {
                name: 'first-button',
                description: 'Give Your First Button A Name And An Emoji By Adding A Comma Followed By The Emoji Example: 😎,Cool.',
                type: 'STRING',
                required: true,
            },
            {
                name: 'second-button',
                description: 'Give Your Second Button A Name And An Emoji By Adding A Comma Followed By The Emoji Example: 😎,Cool.',
                type: 'STRING',
                required: true,
            },
            {
                name: 'third-button',
                description: 'Give Your Third Button A Name And An Emoji By Adding A Comma Followed By The Emoji Example: 😎,Cool.',
                type: 'STRING',
                required: true,
            },
            
        ],

        /**
         *
         * @param {Client} client
         * @param {CommandInteraction} interaction
         * @param {String[]} args
         */
        run: async (client, interaction, args) => {
            const insane = interaction.user
            const { guild, options } = interaction;

            try {
                const [Channel, Category, Transcripts, Handlers] = [
                    options.getChannel('channel'),
                    options.getChannel('category'),
                    options.getChannel('transcripts'),
                    options.getRole('handlers')
                ]

                const Description = options.getString('description')
                const Button1 = options.getString('first-button').split(",")
                const Button2 = options.getString('second-button').split(",")
                const Button3 = options.getString('third-button').split(",")

                const Emoji1 = Button1[1]
                const Emoji2 = Button2[1]
                const Emoji3 = Button3[1]


                await DB.findOneAndUpdate({ GuildID: guild.id}, {
                    ChannelID: Channel.id, 
                    Category: Category.id, 
                    Transcripts: Transcripts.id, 
                    Handlers: Handlers.id,
                    Description: Description,
                    Buttons: [Button1[0], Button2[0], Button3[0]]
                },
                {
                    new: true,
                    upsert: true,
                })
    
                const Buttons = new MessageActionRow()
                Buttons.addComponents(
                    new MessageButton ()
                    .setCustomId(Button1[0])
                    .setLabel(Button1[0])
                    .setStyle("SUCCESS")
                    .setEmoji(Emoji1),
                    new MessageButton()
                    .setCustomId(Button2[0])
                    .setLabel(Button2[0])
                    .setStyle('SECONDARY')
                    .setEmoji(Emoji2),
                    new MessageButton()
                    .setCustomId(Button3[0])
                    .setLabel(Button3[0])
                    .setStyle('PRIMARY')
                    .setEmoji(Emoji3)
                )

                const embed = new MessageEmbed()
                .setAuthor({ name: guild.name + " | Ticketing System", iconURL: guild.iconURL({ dynamic: true })})
                .setDescription(Description)
                .setColor('#b98ffc')
    
                await guild.channels.cache.get(Channel.id).send({
                    embeds: [embed],
                    components: [Buttons]
                })
    
                interaction.followUp('Sent In Ticket Channel')
            } catch (err) {
                const errEmbed = new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`⛔An Error Occured While Setting Up Your Ticket System\n**What To Make Sure Of>**
                    1. Make Sure None Of You Buttons Are Duplicated.
                    2. Make Sure Your Use This Format For Your Buttons => Name, Emoji.    
                    4. Make Sure Your Button Emoji Are Actually Emojis, Not Ids.
                    `)
                console.log(err)

                interaction.followUp({ embeds: [errEmbed] })
            } 
        }
    }