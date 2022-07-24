const client = require("../index");

client.on("ready", () =>
    console.log(`Im in ${client.guilds.cache.size} Servers `)
);

