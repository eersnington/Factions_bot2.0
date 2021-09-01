const chalk = require('chalk');

module.exports = {
    name : 'sudo',
    description : 'Chat through the bot',
    usage: 'sudo <message>',
    aliases: [],
    whitelist: true,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
            .setColor(options.color);

        if (client.bot != null){

            if (args.length == 0) return;
            const chat = args.join(" ")
            
            client.bot.chat(chat)
            setTimeout(()=> {
                let server_chat = client.data.server_chat
                let reply = (options.server_chat.toggle) ? embed.setDescription(`:white_check_mark: ${message.author.tag} sent \`${chat}\`\n\`\`\`${server_chat.join("\n")}\`\`\``) : embed.setDescription(`:white_check_mark: ${message.author.tag} sent \`${chat}\``)

                embed.setColor(options.color)
                .setFooter('Glowstone Bot | Glowstone-Development');
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