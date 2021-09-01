const moment = require("moment");

module.exports = {
    name: 'userinfo',
    description: 'Tells you the user info',
    usage: 'userinfo @user',
    aliases: ['userinfo-command', 'uinfo', 'whois'],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){
        const member1 = message.mentions.members.first() || message.member;
        
        const roles = member1.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);

        const bot = member1.user.bot ? "Bot" : "Member";
        
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.guild.name} | User info`, message.guild.iconURL({ dynamic: true }))
            .setThumbnail(member1.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addField('User', [
                `**❯ Username:** ${member1.user.tag}`,
                `**❯ ID:** ${member1.id}`,
                `**❯ Avatar:** [Link to avatar](${member1.user.displayAvatarURL({ dynamic: true })})`,
                `**❯ Time Created:** ${moment(member1.user.createdTimestamp).format('LT')} ${moment(member1.user.createdTimestamp).format('LL')} ${moment(member1.user.createdTimestamp).fromNow()}`,
                `\u200b`
            ].join('\n'))
            .addField(bot, [
                `**❯ Highest Role:** ${member1.roles.highest.id === message.guild.id ? 'None' : member1.roles.highest.name}`,
                `**❯ Server Join Date:** ${moment(member1.joinedAt).format('LL LTS')}`,
                `**❯ Hoist Role:** ${roles[1] ? roles[1] : 'None'}`,
                `**❯ Roles [${roles.length}]:** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'None'}`,
                `\u200b`
            ].join('\n'))
            .setColor(client.db.get('options').color)
            .setFooter(`Requested By ${message.author.tag}  | ${message.guild.name}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            ;
        return message.channel.send({embeds:[embed]});
    }
} 