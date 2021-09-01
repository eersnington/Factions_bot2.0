const chalk = require('chalk');

module.exports = {
    name : 'vanish',
    description : 'Sends you a list of vanished staff members (might be patched)',
    usage: 'vanish',
    aliases: [],
    whitelist: true,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        if (client.bot != null){

            let vanished = [];
            let count = 0;
            client.bot.tabComplete(`/minecraft:tell `, (data, players) => {
                for (eachPlayer of players) {
                    if (client.bot.players[eachPlayer] == undefined) {
                        if (eachPlayer != "*" && eachPlayer != "**") {
                        vanished.push(`\`${String(eachPlayer)}\``);
                        count++;
                        }
                    }
                }

                if (vanished.length != 0) {
                embed.setTitle(`Total: ${count} vanished staffs in \`\`${options.minecraft_options.ip}\`\``)
                .setDescription(`${vanished.join(", ")}\n*Note: If you get a huge list of [object Object], that means the server has patched the exploit*`)
                .setAuthor(`👀 Vanish`)
                .setFooter('Glowstone Bot | Glowstone-Development');
                message.channel.send({embeds:[embed]})

                } else {
                embed.setTitle(`Total: ${count} vanished staffs in \`\`${options.minecraft_options.ip}\`\``)
                .setDescription("No vanished players\n*Note: The server might have patched it if you constantly see 0 online*")
                .setAuthor(`👀 Vanish`)
                .setFooter('Glowstone Bot | Glowstone-Development');
                message.channel.send({embeds:[embed]})
                }
            });
            
        } else {
            embed.setTitle(`⚠️ Warning`)
            .setDescription(`There is no bot online in the server \`${options.minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\``)
            .setFooter('Glowstone Bot | Glowstone-Development');
            return message.channel.send({embeds:[embed]});
        }
    }
}