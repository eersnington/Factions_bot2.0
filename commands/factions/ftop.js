const chalk = require('chalk');

module.exports = {
    name : 'ftop',
    description : 'Sends you f-top information',
    usage: 'ftop [page_no]',
    aliases: [],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
            .setColor(options.color);

        if (client.bot != null){
            const chat = args.join(" ")
            client.data.ftop = []
            client.bot.chat(`/f top ${chat}`)
            setTimeout(()=> {
                let ftop_data = client.data.ftop
                let reply = (ftop_data.length >2) ? embed.setDescription(`\`\`\`fix\n${ftop_data.join('\n')}\`\`\``) : embed.setDescription(`There was an error in trying to retrieve the data.`)
                client.data.ftop = []
                
                embed.setTitle(`🏆 F-top Value \`\`${options.minecraft_options.ip}\`\``)
                .setTimestamp()
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
                message.channel.send({embeds:[embed]});
            }, 500)
            
        } else {
            embed.setTitle(`⚠️ Warning`)
            .setDescription(`There is no bot online in the server \`${options.minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\``)
            .setFooter('Glowstone Bot | Glowstone-Development');
            return message.channel.send({embeds:[embed]});
        }

        
    }
}