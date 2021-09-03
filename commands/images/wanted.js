const chalk = require('chalk');
const {Canvas} = require("canvacord");

module.exports = {
    name : 'wanted',
    description : 'This man has a bounty on him',
    usage: 'wanted [@user]',
    aliases: [],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        const member = message.mentions.members.first() || message.member;

        const avatar = member.user.displayAvatarURL({format: "png"})

        let m = await message.channel.send("**Please Wait...**");

        const image = await Canvas.wanted(avatar)
        m.delete({timeout: 5000});

        let attachment = new Discord.MessageAttachment(image, "wanted.png");

        embed.setTitle(`Wanted`)
        .setDescription(`**This man has a bounty on him**`)
        .setColor(options.color)
        .setTimestamp()
        .setImage('attachment://wanted.png')
        .setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));

        message.channel.send({embeds: [embed], files: [attachment]})
    }
}