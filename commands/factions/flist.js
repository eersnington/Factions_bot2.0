const chalk = require('chalk');

module.exports = {
    name : 'flist',
    description : 'Sends you f-list information',
    usage: 'flist [page_no]',
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
            client.data.flist = []
            client.bot.chat(`/f list ${chat}`)

            setTimeout(()=> {
                let flist_data = client.data.flist
                let reply = (flist_data.length >2) ? embed.setDescription(`\`\`\`yaml\n${flist_data.join('\n')}\`\`\``) : embed.setDescription(`There was an error in trying to retrieve the data.`)
                client.data.flist = []

                embed.setTitle(`👥 F-List \`\`${options.minecraft_options.ip}\`\``)
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
                message.channel.send({embeds:[embed]});
            }, 500)
            
        } else {
            embed.setTitle(`⚠️ Warning`)
            .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
            .setDescription(`There is no bot online in the server \`${options.minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\``)
            .setFooter('Glowstone Bot | Glowstone-Development');
            return message.channel.send({embeds:[embed]});
        }

        
    }
}