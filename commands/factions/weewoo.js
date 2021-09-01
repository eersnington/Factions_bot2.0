const chalk = require('chalk');

module.exports = {
    name : 'weewoo',
    description : 'Initiate a weewoo',
    usage: 'weewoo <message>',
    aliases: [],
    whitelist: true,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        if (Object.values(options.players.whitelist).includes(message.author.id) || message.member.roles.cache.has(options.discord_options.developer_role)
        || Object.values(options.players.faction).includes(message.author.id)){

            const chat = args.join(" ");
            let channel = client.channels.cache.get(options.discord_options.weewoo_channel);

            if(!channel){
                embed.setTitle('⁉️ Missing Channel')
                .setDescription(`Please set a weewoo channel with \`${options.discord_options.prefix}set weewoo_channel\``)
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
                .setFooter(`Glowstone Bot | Glowstone-Development`);
                
                return message.channel.send({embeds: [embed]});
            }
    
            embed.setTitle(`🆘  WEEWOO 📢 `)
            .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
            .setDescription(`**${message.author.tag}** called weewoo! JOIN NOW!\n
                **Ip:** \`${options.minecraft_options.ip}\`\n
                    Message from **${message.author.tag}:**  \`\`\`diff\n- ${chat}\`\`\``)
            .setColor(options.color)
            .setFooter('Glowstone Bot | Glowstone-Development');

            return channel.send({content: "@everyone 🆘  WEEWOO 📢!!!", embeds: [embed]});
            
        }else{

            const errEmbed = new Discord.MessageEmbed()
                .setTitle('🚫 Access Denied')
                .setDescription(`You're not part of the faction.`)
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
                .setFooter(`Glowstone Bot | Glowstone-Development`);
                return message.channel.send({embeds: [errEmbed]})
        }

    }
}