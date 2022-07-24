                                            const { Client, CommandInteraction, MessageActionRow, MessageEmbed, MessageButton } = require("discord.js")
                                            const DB = require('../../models/Ticket');


                                            module.exports = {
                                                name: "ticket-action",
                                                description: "Add Or Remove A From This Ticket",
                                                userPermissions: ["MANAGE_MESSAGES"],
                                                options: [
                                                    {
                                                        name: 'action',
                                                        description: "Add Or Remove a member from this ticket.",
                                                        type: "STRING",
                                                        required: true,
                                                        choices: [
                                                            {name: "Add", value: "add"},
                                                            {name: "Remove", value: "remove"}
                                                        ],
                                                    },
                                                    {
                                                        name: 'member',
                                                        description: "The Member You Would Like To Add or Remove From This Ticket",
                                                        type: "USER",
                                                        required: true,
                                                    }
                                                ],
                                                    /**
                                                *
                                                * @param {Client} client
                                                * @param {CommandInteraction} interaction
                                                * @param {String[]} args
                                                */
                                                    run: async (client, interaction, args) => {
                                                        const { guildId, options, channel  } = interaction;
                                                        const Action = options.getString('action');
                                                        const Member = options.getMember('member')

                                                        const Embed = new MessageEmbed()
                                            switch(Action) {
                                                case "add":
                                                    DB.findOne({ GuildID: guildId, ChannelID: channel.id }, async (err, docs) => {
                                                        if(err) throw err;
                                                        if(!docs)
                                                        return interaction.followUp({ embeds: [Embed.setColor('RED').setDescription("📛| This Channel Is Not Tied With A Ticket!"),], ephemeral: true, })
                                                        if(docs.MembersID.includes(Member.id))
                                                        return interaction.followUp({ embeds: [Embed.setColor('RED').setDescription("📛| This Member Is Already Added To This Ticket"),], ephemeral: true, })

                                                        docs.MembersID.push(Member.id)
                                                        channel.permissionOverwrites.edit(Member.id, {
                                                            SEND_MESSAGES: true,
                                                            VIEW_CHANNEL: true,
                                                            READ_MESSAGE_HISTORY: true,
                                                        })
                                                        interaction.followUp({ embeds: [Embed.setColor("GREEN").setDescription(`✅| ${Member} Has Been Added`),],})
                                                        docs.save();
                                                    })
                                                break;
                                                case "remove": 
                                                DB.findOne({ GuildID: guildId, ChannelID: channel.id }, async (err, docs ) => {
                                                    if(err) throw err;
                                                    if(!docs)
                                                    return interaction.followUp({ embeds: [Embed.setColor('RED').setDescription("📛| This Channel Is Not Tied With A Ticket!"),], ephemeral: true, })
                                                    if(!docs.MembersID.includes(Member.id))
                                                    return interaction.followUp({ embeds: [Embed.setColor('RED').setDescription("📛| This Member Isn't In This ticket"),], ephemeral: true, })

                                                    docs.MembersID.remove(Member.id);
                                                    channel.permissionOverwrites.delete(Member.id);
                                                    interaction.followUp({ embeds: [Embed.setColor("GREEN").setDescription(`✅| ${Member} Has Been Removed`),], })
                                                    docs.save();
                                                })
                                            break;

                                            }
                                                    }
                                            }