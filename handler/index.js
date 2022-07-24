const chalk = require('chalk');
const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    // Events
    console.log(chalk.yellow.bold('EVENT STATUS━━━━━━━━━━━━━━━━━━━━━┓'));
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((file) => {
        const event = require(file);

        let eventName = event.alias || event.name || 'No event name';
        let option = eventName == 'No event name' ? '❌' : '✅';

        if(eventName != 'No event name') {
            if(event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
        console.log(`${chalk.yellow.bold('┃')} Loaded: ${option} ${chalk.yellow.bold('┃')} ${eventName}`);
    })
    console.log(chalk.yellow.bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'));

    // Slash Commands
    console.log(chalk.redBright.bold('SLASH COMMAND STATUS━━━━━━━━━━━━━━━━━━━━━┓'));
    const slashCommands = await globPromise(`${process.cwd()}/SlashCommands/*/*.js` );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        let slashCommandsName = file.alias || file.name || 'No Slash Commands name';
        let option = slashCommandsName == 'No Slash Commands name' ? '❌' : '✅';
        if(slashCommandsName != 'No event name') {
            if(file.once) {
                client.once(file.name, (...args) => file.execute(...args));
            } else {
                client.on(file.name, (...args) => file.execute(...args));
            }
        }
    console.log(`${chalk.redBright.bold('┃')} Loaded: ${option} ${chalk.redBright.bold('┃')} ${slashCommandsName}`);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        if (file.userPermissions) file.defaultPermission = false;
        arrayOfSlashCommands.push(file);
    });
    console.log(chalk.redBright.bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'));
    client.on("ready", async () => {
        // Register for a single guild
       //const guild = client.guilds.cache.get("814490513826512897")
        //await guild.commands.set(arrayOfSlashCommands).then((cmd) => {
            //const getRoles = (commandName) => {
                //const permissions = arrayOfSlashCommands.find(x => x.name === commandName
                    //).userPermissions;

                    //if(!permissions) return null;
                  //  return guild.roles.cache.filter(x => x.permissions.has(permissions) && !x.managed)
          //  }

            //const fullPermissions = cmd.reduce((accumulator, x) => {
              //  const roles = getRoles(x.name)
               // if(!roles) return accumulator;

               // const permissions = roles.reduce((a,v) => {
                 //   return [
                     //   ...a,
                     //   {
                      //      id:v.id,
                      //      type:"ROLE",
                       //     permission: true,
                       // },
                  //  ]
              //  }, [])
               // return [
                //    ...accumulator,
                 //   {
                 //       id:x.id,
                   //     permissions,
                 //   },
             //   ]
          //  }, [])

          //  guild.commands.permissions.set({ fullPermissions })


       // })

        // Register for all the guilds the bot is in
        await client.guilds.fetch();
        client.guilds.cache.forEach((guild) => {
            // Iterating over every guild and registering the commands.
            console.log(`[Slash Register]: Registering [${arrayOfSlashCommands.length}] commands for ${guild.name}`)
            
            // Looping over each CommandData.
            for (const data of arrayOfSlashCommands) {
                client.application.commands.create(data, guild.id);
                console.log(` | [Mount]: ${data.name}`)
            }
        })
    });


    // mongoose
    const { mongooseConnectionString } = require('../config.json')
    if (!mongooseConnectionString) return;

    mongoose.connect(mongooseConnectionString).then(() => console.log('Connected to mongodb'));

    
};
