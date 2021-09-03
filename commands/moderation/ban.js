module.exports = {
    name : 'ban',
    description: 'Permanent ban a user (also clears their messages)',
    usage: 'ban @user <reason>',
    aliases: [],
    whitelist: true,
    dev: true,
    requiredPerms: ["BAN_MEMBERS"],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');

        const member = message.mentions.members.first();
        let reason = args.slice(1).join(' ');
        let channel = client.channels.cache.get(options.discord_options.logs_channel)
        
        if(!member) return message.reply("**Mention a valid user!**")
        if(!reason) return message.reply("**Please mention a reason!**")
        if (member.id === client.id) return message.reply('You can\'t kick me!')
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply('**You can\'t ban this user**')

        const logsEmbed = new Discord.MessageEmbed()
        .setColor(options.color)
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setThumbnail(message.guild.iconURL())
        .setDescription(
            `__**Player banned**__\n
            **Moderator: **<@${message.member.id}>\n**User: **<@${member.user.id}>\n**Reason: ** \`${reason}\`\n**Duration: ** \`Permanent\``
        )
        .setTitle(`📋 Logs`)
        .setTimestamp()
        .setFooter(`Glowstone Bot | ${message.guild.name}`);

        if (channel){
            channel.send({embeds:[logsEmbed]})
        }

        await member.ban({
            reason: reason,
        }).then(() => {
            message.channel.messages.fetch({
                limit: 100 // Change `100` to however many messages you want to fetch
            }).then((messages) => { 
                const botMessages = [];
                messages.filter(m => m.author.id === member.user.id).forEach(msg => botMessages.push(msg))
                message.channel.bulkDelete(botMessages);
            })
            message.channel.send(`**${member.user.tag}** got banned!`)

        })

    }
}