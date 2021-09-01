const mineflayer = require("mineflayer");
const chalk = require('chalk');

module.exports = {
    name: 'disconnect',
    description: 'Disconnect the minecraft bot from a server',
    usage: 'disconnect',
    aliases: ['logout'],
    whitelist: true,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const botEmbed = new Discord.MessageEmbed()
            .setColor(options.color)
            .setFooter('Glowstone Bot | Glowstone-Development');
        
        if (client.bot != null){

            botEmbed.setTitle(`✅ Disconnected`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
            .setDescription(`You have disconnected the bot \`${client.bot.username}\` from \`${options.minecraft_options.ip}\`\n 
            To reconnect, simply issue the command \`${options.discord_options.prefix}join\``);
            client.bot.end()
            client.bot = null;
            options.online = false;

            console.log(chalk.red(`[Glowstone] ${message.author.tag} has disconnected the Minecraft bot!`));
            return message.channel.send({embeds: [botEmbed]});
  
        } else {

            botEmbed.setTitle(`⁉️ Error`)
            .setDescription(`There is no bot online in the server \`${options.minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\``)
            return message.channel.send({embeds: [botEmbed]});
        }
    }
}