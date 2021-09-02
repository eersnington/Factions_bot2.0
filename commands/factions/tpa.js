const chalk = require('chalk');

module.exports = {
    name : 'tpa',
    description : 'Send a tpa request to a player',
    usage: 'tpa <player_ign>',
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
                
            client.bot.chat(`/tpa ${chat}`)
            setTimeout(()=> {
                let tpa = client.data.server_chat
                let reply = (options.server_chat.toggle) ? embed.setDescription(`:white_check_mark: ${message.author.tag} attempted to send a tpa request to \`${chat}\`\n\`\`\`yaml\n${tpa.join("\n")}\`\`\``) : embed.setDescription(`:white_check_mark: ${message.author.tag} attempted to send a tpa request to \`${chat}\``)

                embed.setColor(options.color)
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                .setFooter('Glowstone Bot | Glowstone-Development');
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