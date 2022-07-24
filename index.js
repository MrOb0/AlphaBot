const { Client, Collection, MessageEmbed } = require('discord.js');
const modlogsSchema = require('./models/modlogs');

const usedlogs = require('./models/usedlogs')


const client = new Client({
  intents: 32767,
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require('./config.json');

// Initializing the project
require('./handler')(client);

client.modlogs = async function ({ Member, Action, Color, Reason, Moderator }, message) {
  const data = await modlogsSchema.findOne({ Guild: message.guild.id });
  if (!data) return;

  const channel = message.guild.channels.cache.get(data.Channel);

  const logsembed = new MessageEmbed()
    .setColor(Color)
    .setAuthor({
      name: `${Member.user.tag}`,
      iconURL: `${Member.user.displayAvatarURL({ dynamic: true })}`,
    })
    .setDescription(`${Action} By ${Moderator}`)
    .setTitle(`Reason: ${Reason || 'No Reason Was Provided'}`)
    .setTimestamp();

  channel.send({ embeds: [logsembed] });
};

client.usedlogs = async function ({ Command, Moderators, UsedIn }, message) {
  const datas = await usedlogs.findOne({ Guild: message.guild.id })
  if (!datas) return;
   const channels = message.guild.channels.cache.get(datas.ChannelID);

   const usedlogss = new MessageEmbed()

   .setColor("BLUE")
   .setAuthor({
     name: `${Moderators.tag}`,
     iconURL: `${Moderators.displayAvatarURL({ dynamic: true })}`,
   })
   .setDescription(`Used ${Command} Command in <#${UsedIn}>`)
   .setTimestamp();

   channels.send({ embeds: [usedlogss] })

}

const logs = require('discord-logs');
logs(client, {
    debug: true
});

process.on('unhandledRejection', (err) => {
  console.log('err: \n' + err)})



client.login(client.config.token);
