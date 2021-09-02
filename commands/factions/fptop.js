const chalk = require('chalk');

module.exports = {
    name : 'fptop',
    description : 'Sends you f-ptop information',
    usage: 'fptop [page_no]',
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
            client.data.fptop = []
            client.bot.chat(`/f ptop ${chat}`)
            setTimeout(()=> {
                let fptop_data = client.data.fptop
                let reply = (fptop_data.length >2) ? embed.setDescription(`\`\`\`fix\n${fptop_data.join('\n')}\`\`\``) : embed.setDescription(`There was an error in trying to retrieve the data.`)
                client.data.fptop = []

                embed.setTitle(`🏆 F-ptop Value \`\`${options.minecraft_options.ip}\`\``)
                .setTimestamp()
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
                message.channel.send({embeds: [embed]});
            }, 500)
            
        } else {
            embed.setTitle(`⚠️ Warning`)
            .setDescription(`There is no bot online in the server \`${options.minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\``)
            .setFooter('Glowstone Bot | Glowstone-Development');
            return message.channel.send({embeds: [embed]});
        }

        
    }
}