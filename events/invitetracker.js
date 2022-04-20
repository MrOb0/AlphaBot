const client = require("../index");
const InvitesTracker = require("@androz2091/discord-invites-tracker");
const tracker = InvitesTracker.init(client, {
  fetchGuilds: true,
  fetchVanity: true,
  fetchAuditLogs: true,
});

tracker.on("guildMemberAdd", async (member, type, invite) => {
  const channel = member.guild.channels.cache.get("959107112166912010");
  if (type === "normal") {
    channel.send(`${member} was invited by ${invite.inviter} and He has ${invite.uses} Invites`);
  } else if (type === "permissions") {
    channel.send(
      `I cant figure out ${member} how joined because I don't have the "MANAGE_GUILD" permission!`
    );
  } else if (type === "unknown") {
    channel.send(
      ` I can't figure out how ${member} joined the server...`
    );
  } else if (type === "vanity") {
    channel.send(` ${member} joined using a custom invite Vanity URL !`);
  }
});