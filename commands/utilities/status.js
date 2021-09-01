const chalk = require('chalk');
const mc = require('minecraft-protocol');
const mineflayer = require('mineflayer')

module.exports = {
    name : 'status',
    description : 'Status of the minecraft bot and the server',
    usage: 'status',
    aliases: [],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
            .setColor(options.color);

        let botStatus = (client.bot) ? "🟩": "🟥" 
        let botUsername = (client.bot) ? client.bot.username : "None"
        let botPing = (client.bot) ? `${client.bot.player.ping} ms` : "None"
        let botTps = (client.bot) ? `${client.bot.getTps()}/20` : "None"
        mc.ping({
            host: options.minecraft_options.ip,
            port: 25565
        }, (err, serv) =>
        {
            if (err) return '';
            embed.setTitle(`📊 Status`)
            .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
            .setDescription('\u200B')
            .addFields(
                { name: 'Bot Status', value: `**Username: ** \`${botUsername}\`\n **Status:** ${botStatus}\n **Latency:** \`${botPing}\``,  },
                { name: 'Server Status', value: `**IP:** \`${options.minecraft_options.ip}\`\n**Version:** \`${serv.version.name}\`\n **Online:** \`${serv.players.online}/${serv.players.max} players\`\n **Latency:** \`${serv.latency} ms\`\n **TPS:** \`${botTps}\`` },
            )
            .setColor(options.color)
            .setFooter('Glowstone Bot | Glowstone-Development');
            
            return message.channel.send({embeds: [embed]});
        });

        
    }
}