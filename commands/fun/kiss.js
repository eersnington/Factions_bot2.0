const chalk = require('chalk');

module.exports = {
    name : 'kiss',
    description : 'Send a kiss to someone',
    usage: 'kiss <@user>',
    aliases: [],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        const member = message.mentions.members.first();
        if (!member) return message.reply('Mention a user! (or the user isn\'t in the guild)');
        if (member.id == message.author.id) return message.reply(`that's kinda sad to try kissing yourself`)

        embed.setTitle(`💕 Kiss`)
        .setDescription(`<@${message.author.id}> has sent a kiss to <@${member.id}>`)
        .setImage('https://c.tenor.com/cfR6UVu0WCAAAAAM/wave-blow-kiss.gif')
        .setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));

        message.channel.send({embeds: [embed]})
    }
}