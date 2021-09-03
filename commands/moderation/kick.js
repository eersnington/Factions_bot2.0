module.exports = {
    name: 'kick',
    description: 'Kicks a user',
    usage: 'kick @user <reason>',
    aliases: [],
    whitelist: true,
    dev: true,
    requiredPerms: ["KICK_MEMBERS"],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');

        const member = message.mentions.members.first();
        let reason = args.slice(1).join(' ');
        let channel = client.channels.cache.get(options.discord_options.logs_channel)
        
        if(!member) return message.reply("**Mention a valid user!**")
        if(!reason) return message.reply("**Please mention a reason!**")
        if (member.id === message.author.id) return message.reply('You can\'t kick your self!')
        if (member.id === client.id) return message.reply('You can\'t kick me!')
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply('You can\'t kick this user')

        const logsEmbed = new Discord.MessageEmbed()
        .setColor(options.color)
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setThumbnail(message.guild.iconURL())
        .setDescription(
            `__**Player kicked**__\n
            **Channel: **\`${message.channel.name}\`\n**Moderator: **<@${message.member.id}>\n**User: **<@${member.user.id}>\n**Reason: ** \`${reason}\``
        )
        .setTitle(`📋 Logs`)
        .setTimestamp()
        .setFooter(`Glowstone Bot | ${message.guild.name}`);

        member.kick().then(() => {
            message.channel.send({content: `**${member.user.tag}** got kicked!`})
            if (channel){
                channel.send({embeds:[logsEmbed]})
            }
        })

    }
}