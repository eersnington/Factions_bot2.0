const chalk = require('chalk');
const Discord = require("discord.js");


module.exports = {
    name : 'weewoo',
    description : 'Send a weewoo alert',
    usage: 'weewoo <message>',
    aliases: [],
    whitelist: true,
    member: true,
    async execute(client, message, player, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        let channel = client.channels.cache.get(options.discord_options.weewoo_channel);
        const chat = args.substring(1);

        if(!channel){
            embed.setTitle('⁉️ Missing Channel')
            .setDescription(`Please set a weewoo channel with \`${options.discord_options.prefix}set weewoo_channel\``)
            .setThumbnail(message.guild.iconURL())
            .setFooter(`Glowstone Bot | Glowstone-Development`);
            
            return message.channel.send({embeds: [embed]});
        }

        embed.setTitle(`🆘  WEEWOO 📢 `)
        .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
        .setDescription(`**${player}** called weewoo! JOIN NOW!\n
            **Ip:** \`${options.minecraft_options.ip}\`\n
                Message from **${player}:**  \`\`\`diff\n- ${chat}\`\`\``)
        .setFooter('Glowstone Bot | Glowstone-Development');

        return channel.send({content: "@everyone 🆘  WEEWOO 📢!!!", embeds: [embed]});
    }
}