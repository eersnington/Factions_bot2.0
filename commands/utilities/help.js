const {MessageActionRow, MessageSelectMenu } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'Help command',
    usage: 'help [cmd]',
    aliases: [],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        if (!args[0]) {
            let utilitiesCommands = []
            let utilitiesFolder = fs.readdirSync(`./commands/utilities`);
            utilitiesFolder.forEach(file => {
                fileName = String(file).split('.')[0]
                utilitiesCommands.push(`**${fileName} ➜ ** ${client.commands.get(fileName).description}`)
            });

            let factionsCommands = []
            let factionsFolder = fs.readdirSync(`./commands/factions`);
            factionsFolder.forEach(file => {
                fileName = String(file).split('.')[0]
                factionsCommands.push(`**${fileName} ➜ ** ${client.commands.get(fileName).description}`)
            });
            
            let gamesCommands = []
            let gamesFolder = fs.readdirSync(`./commands/games`);
            gamesFolder.forEach(file => {
                fileName = String(file).split('.')[0]
                gamesCommands.push(`**${fileName} ➜ ** ${client.commands.get(fileName).description}`)
            });

            let imagesCommands = []
            let imagesFolder = fs.readdirSync(`./commands/images`);
            imagesFolder.forEach(file => {
                fileName = String(file).split('.')[0]
                imagesCommands.push(`**${fileName} ➜ ** ${client.commands.get(fileName).description}`)
            });

            let ingameCommands = []
            let ingameFolder = fs.readdirSync(`./ingame_commands`);
            ingameFolder.forEach(file => {
                fileName = String(file).split('.')[0]
                ingameCommands.push(`**${fileName} ➜ ** ${client.ingame_commands.get(fileName).description}`)
            });
            
      
            const noArguments = new Discord.MessageEmbed()
                .setAuthor(`Help Menu`, message.guild.iconURL({ dynamic: true }))
                .setDescription(`*Click on the button that corresponds to your command help needs!*
                \n🛠️ **» Utility Commands**\n💥 **» Faction Commands**\n🖥️ **» In-game Commands**\n🎪 **» Fun Commands**\n
                **Note: ** *Some of these categories contain sub categories!*`)
                .setThumbnail(message.guild.iconURL())
                .setColor(client.config.embed_color)
                .setTimestamp()
                .setFooter(`Glowstone Bot | ${message.guild.name}`);

            if (!client.db.get('options').discord_options.server_chat_channel) noArguments.addField(`⚠️ Alert:`, `Hey I noticed you haven't done the setup yet.\n Get started with \`${client.db.get('options').discord_options.prefix}setup\`` )
            const utilityEmbed = new Discord.MessageEmbed()
                .setAuthor(`🛠️  Utility Menu`, message.guild.iconURL({ dynamic: true }))
                .setDescription(`*List of utility commands!*
                \n${utilitiesCommands.join(`\n`)}
                \n**Note: ** Type \`${client.db.get('options').discord_options.prefix}help [cmd]\` for command details
                `)
                .setThumbnail(message.guild.iconURL())
                .setColor(client.config.embed_color)
                .setTimestamp()
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
            
            const factionsEmbed = new Discord.MessageEmbed()
                .setAuthor(`💥 Factions Commands`, message.guild.iconURL({ dynamic: true }))
                .setDescription(`*List of Factions commands!*
                \n${factionsCommands.join(`\n`)}
                \n**Note: ** Type \`${client.db.get('options').discord_options.prefix}help [cmd]\` for command details
                `)
                .setThumbnail(message.guild.iconURL())
                .setColor(client.config.embed_color)
                .setTimestamp()
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
                
            const ingameEmbed = new Discord.MessageEmbed()
                .setAuthor(`🖥️ **» In-game Commands`, message.guild.iconURL({ dynamic: true }))
                .setDescription(`*List of in-game commands!*
                \n${ingameCommands.join(`\n`)}
                \n**Note: ** Type \`${client.db.get('options').discord_options.prefix}help [cmd]\` for command details
                `)
                .setThumbnail(message.guild.iconURL())
                .setColor(client.config.embed_color)
                .setTimestamp()
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
            
            const funEmbed = new Discord.MessageEmbed()
                .setAuthor(`🎪 Fun Menu`, message.guild.iconURL({ dynamic: true }))
                .setDescription(`*List of fun commands!*
                \n🕹️ **» Game Commands**\n🌆 **» Image Commands**
                \n**Note: ** Type \`${client.db.get('options').discord_options.prefix}help [cmd]\` for command details
                `)
                .setThumbnail(message.guild.iconURL())
                .setColor(client.config.embed_color)
                .setTimestamp()
                .setFooter(`Glowstone Bot | ${message.guild.name}`);

            const gamesEmbed = new Discord.MessageEmbed()
                .setAuthor(`🕹️ Games Menu`, message.guild.iconURL({ dynamic: true }))
                .setDescription(`*List of community commands!*
                \n${gamesCommands.join(`\n`)}
                \n**Note: ** Type \`${client.db.get('options').discord_options.prefix}help [cmd]\` for command details
                `)
                .setThumbnail(message.guild.iconURL())
                .setColor(client.config.embed_color)
                .setTimestamp()
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
            
            const imagesEmbed = new Discord.MessageEmbed()
                .setAuthor(`🌆 Images Menu`, message.guild.iconURL({ dynamic: true }))
                .setDescription(`*List of image commands!*
                \n${imagesCommands.join(`\n`)}
                \n**Note: ** Type \`${client.db.get('options').discord_options.prefix}help [cmd]\` for command details
                `)
                .setThumbnail(message.guild.iconURL())
                .setColor(client.config.embed_color)
                .setTimestamp()
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
            
            const row = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setCustomId("help-menu")
                .setPlaceholder("Choose a category")
                .addOptions([
                    {
                        label:"Utility Commands",
                        value: "utility",
                        description: "General info and utility commands!",
                        emoji: "🛠️"
                    },{
                        label:"Factions Commands",
                        value: "factions",
                        description: "Factions related commands!",
                        emoji: "💥"
                    },{
                        label:"In-game Commands",
                        value: "ingame",
                        description: "Commands that you can execute in-game!",
                        emoji: "🖥️"
                    },{
                        label:"Fun Commands",
                        value: "fun",
                        description: "Fun and entertaining commands along with minigames!",
                        emoji: "🎪"
                    }
                ])
            )

            const row2 = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setCustomId("help-menu2")
                .setPlaceholder("Choose a sub-category")
                .addOptions([
                    {
                        label:"Image Command",
                        value: "image",
                        description: "Generate cool images!",
                        emoji: "🌆"
                    },{
                        label:"Game Commands",
                        value: "games",
                        description: "Fun minigames!",
                        emoji: "🕹️"
                    }
                ])
            )

            const filter = (interaction) => interaction.isSelectMenu() && interaction.user.id === message.author.id;

            const collector = message.channel.createMessageComponentCollector({filter, max: "6"});

            collector.on("collect", async (collected) => {
                const value = collected.values[0];
                
                switch (value) {
                    case 'utility':
                        collected.message.edit({embeds: [utilityEmbed]})
                        break;
                    case 'fun':
                        collected.message.edit({embeds: [funEmbed], components: [row2]})
                        break;
                    case 'factions':
                        collected.message.edit({embeds: [factionsEmbed]})
                        break;
                    case 'ingame':
                        collected.message.edit({embeds: [ingameEmbed]})
                        break;
                    case 'image':
                        collected.message.edit({embeds: [imagesEmbed]})
                        break;
                    case 'games':
                        collected.message.edit({embeds: [gamesEmbed]})
                        break;
                    default:
                        console.log(`Invalid button!`);
                  }
                

            })

            return message.channel.send({ embeds: [noArguments], components: [row]});
        } else {
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(command => command.aliases.includes(args[0]));
            const ingame_command = client.ingame_commands.get(args[0].toLowerCase()) || client.ingame_commands.find(command => command.aliases.includes(args[0]));
            if (command) {
                let rolesReq1 = (command.dev) ? `\`DEVELOPER\``: ""
                let rolesReq2 = (command.whitelist) ? `\`WHITELIST\``: ""

                const foundEmbed = new Discord.MessageEmbed()
                    .setAuthor(`Command Info » ${command.name}`, message.guild.iconURL({ dynamic: true }))
                    .addField('❯ Name', `${command.name}`, true)
                    .addField('❯ Aliases', `\`${command.aliases.join('\`, \` ') ? command.aliases : "No Aliases"}\``)
                    .addField('❯ Usage', `\`${client.db.get('options').discord_options.prefix}${command.usage}\``, true)
                    .addField('❯ Description', `${command.description}`)
                    .addField('❯ User Roles', `${((rolesReq1+rolesReq2).length > 2) ? `${rolesReq1}, ${rolesReq2}`: "\`No Role Permissions\`"}`)
                    .addField('❯ User Permissions', `\`${command.requiredPerms.join('\`, \` ') ? command.requiredPerms : "No User Permissions"}\``)
                    .addField('\u200B', `*Parameters in <> angular brackets are required*\n*Parameters in [] square brackets are optional*`)
                    .setColor(client.config.embed_color)
                message.channel.send({embeds: [foundEmbed]});
            }
            if (ingame_command) {
                let rolesReq1 = (command.member) ? `\`MEMBER\``: ""
                let rolesReq2 = (command.whitelist) ? `\`WHITELIST\``: ""

                const foundEmbed = new Discord.MessageEmbed()
                    .setAuthor(`Ingame-Command Info » ${command.name}`, message.guild.iconURL({ dynamic: true }))
                    .addField('❯ Name', `${command.name}`, true)
                    .addField('❯ Aliases', `\`${command.aliases.join('\`, \` ') ? command.aliases : "No Aliases"}\``)
                    .addField('❯ Usage', `\`${client.db.get('options').discord_options.prefix}${command.usage}\``, true)
                    .addField('❯ Description', `${command.description}`)
                    .addField('❯ Linked', `${((rolesReq1+rolesReq2).length > 2) ? `${rolesReq1}, ${rolesReq2}`: "\`Link not required\`"}`)
                    .addField('\u200B', `*Parameters in <> angular brackets are required*\n*Parameters in [] square brackets are optional*`)
                    .setColor(client.config.embed_color)
                message.channel.send({embeds: [foundEmbed]});
            }
        }
    }
}