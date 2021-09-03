module.exports = {
    name: 'purge',
    description: 'Bulk delete messages',
    usage: 'purge <no. of messages>',
    aliases: [],
    whitelist: true,
    dev: true,
    requiredPerms: ["MANAGE_GUILD"],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');

        if(!args[0]) return message.reply("**Please enter the amount of messages that you want to clear!**")
        if(isNaN(args[0])) return message.reply("**Please enter a real integer!**")

        if(args[0]>100) return message.reply("**You cannot delete more than 100 messages**");
        if(args[0]<0) return message.reply("**You must delete at least 1 message**");

        let channel = client.channels.cache.get(options.discord_options.logs_channel)
        
       await message.channel.messages.fetch({limit:args[0]}).then(async msgs => {
            await message.channel.bulkDelete().catch(()=> message.channel.send("These messages are older than 14 days!"));
            const embed = new Discord.MessageEmbed()
            .setFooter(`Requested By ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle(`Purge:`)
            .setThumbnail(message.author.displayAvatarURL())
            .addField(`Purge Requested:`, `${args[0]}`)
            .addField(`Total Purged:`, `${msgs.size}` )
            .setFooter(`Glowstone Bot | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
            .setColor(options.color)
            message.channel.send({embeds:[embed]});

            const logsEmbed = new Discord.MessageEmbed()
            .setColor(options.color)
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setThumbnail(message.guild.iconURL())
            .setDescription(
                `__**Purged **__\n
                **Moderator: **<@${message.member.id}>\n**Purged amount: ** \`${msgs.size}\``
            )
            .setTitle(`📋 Logs`)
            .setTimestamp()
            .setFooter(`Glowstone Bot | ${message.guild.name}`);

            if (channel){
                channel.send({embeds:[logsEmbed]})
            }
        });
    }
}