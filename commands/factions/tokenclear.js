const chalk = require('chalk');

module.exports = {
    name : 'tokenclear',
    description : 'Clear whitelistlink or memberlink tokens',
    usage: 'tokenclear',
    aliases: ['tclear'],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');

        const tokenclearEmbed = new Discord.MessageEmbed()
        .setColor(options.color)
        .setThumbnail(message.guild.iconURL())
        .setFooter('Glowstone Bot | Glowstone-Development');

        let id;
        
        try {
            id = (args[0].match(/(\d+)/))[0]
        } catch(err){
            tokenclearEmbed.setTitle(`⁉️ Invalid Argument`)
            .setDescription(`Tokenclear requires you to tag a user. \n**Command Usage:** \`${options.discord_options.prefix}tokenclear @user\``)
            return message.channel.send({embeds:[tokenclearEmbed]})
        }
        
        for (let user in client.temp_uuid) {
            if (client.temp_uuid[user] == id){
                delete client.temp_uuid[user]
                tokenclearEmbed.setTitle('✅ Cleared Token')
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`You have successfully removed any existing token of <@${id}>`);

                return message.channel.send({embeds:[tokenclearEmbed]});
            }
        }
        tokenclearEmbed.setTitle('🤷 Couldn\'t Find Token')
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`Couldn't find any tokens for <@${id}>`);

        return message.channel.send({embeds:[tokenclearEmbed]});
    }
}