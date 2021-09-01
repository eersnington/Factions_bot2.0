module.exports = {
    name: 'serverinfo',
    description: 'Tells you the server info',
    usage: 'serverinfo',
    aliases: ['serverinfo-command', 'sinfo'],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){
        let guildOwner = await message.guild.fetchOwner()
        
        const sinfoEmbed = new Discord.MessageEmbed()
        .setAuthor(`${message.guild.name} | Server info`, message.guild.iconURL({ dynamic: true }))
        .setColor(client.db.get('options').color)
        .setThumbnail(message.guild.iconURL())
        .addField('\`📅 \` Created:', `\`\`\`fix\n${require('moment')(message.guild.createdAt).format('ddd, MMMM Do YYYY [at] hh:mm A')} | ${require('moment')(message.guild.createdAt).fromNow()}\`\`\``)
        .addField('\`👑 \` Owner:', `\`\`\`fix\n${guildOwner.user.tag}\`\`\``, true)
        .addField('\`🌍\` Region:', `\`\`\`fix\n${message.guild.preferredLocale}\`\`\``,true)
        .addField('-----------------------------------------------------------', '-----------------------------------------------------------')
        .addField('\`👤\` Members:', `\`\`\`yaml\n${message.guild.memberCount}\`\`\``,true)
        .addField('\`🤖\` Bots:', `\`\`\`yaml\n${message.guild.members.cache.filter(member => member.user.bot).size}\`\`\``,true)
        .addField('\`💬 \` Text:', `\`\`\`yaml\n${message.guild.channels.cache.size}\`\`\``,true)
        .addField('\`🔉 \` Voice:', `\`\`\`yaml\n${message.guild.channels.cache.filter(c => c.type === 'voice').size}\`\`\``,true)
        .addField('\`💂\` Roles:', `\`\`\`yaml\n${message.guild.roles.cache.size}\`\`\``,true)
        .addField('\`😃 \` Emojis:', `\`\`\`yaml\n${message.guild.emojis.cache.size}\`\`\``,true)
        .addField('\`🚀\` Boosts:', `\`\`\`yaml\n${message.guild.premiumSubscriptionCount}\`\`\``,true)
        .addField('\`💎\` Boost Tier:', `\`\`\`yaml\n${message.guild.premiumTier}\`\`\``,true)
        .setFooter(`Requested By ${message.author.tag}  | ${message.guild.name}`, message.author.displayAvatarURL({ dynamic: true }))
        message.channel.send({embeds: [sinfoEmbed]})
    }
}