const chalk = require('chalk');

module.exports = {
    name : 'tpyes',
    description : 'Accepts any pending tpa requests',
    usage: 'tpyes',
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
                
            client.bot.chat(`/tpyes`)
            setTimeout(()=> {
                let tpa = client.data.server_chat
                let reply = (options.server_chat.toggle) ? embed.setDescription(`:white_check_mark: ${message.author.tag}\`\n\`\`\`yaml\n${tpa.join("\n")}\`\`\``) : embed.setDescription(`:white_check_mark: ${message.author.tag}`)

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