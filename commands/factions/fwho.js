const chalk = require('chalk');

module.exports = {
    name : 'fwho',
    description : 'Sends you f-who information',
    usage: 'fwho [page_no]',
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
            
            client.bot.chat(`/f who ${chat}`)
            setTimeout(()=> {
                let fwho_data = client.data.server_chat
                let reply = (options.server_chat.toggle) ? embed.setDescription(`\`\`\`yaml\n${fwho_data.join('\n')}\`\`\``) : embed.setDescription(`There was an error in trying to retrieve the data.`)

                embed.setTitle(`📜 F-who \`\`${options.minecraft_options.ip}\`\``)
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