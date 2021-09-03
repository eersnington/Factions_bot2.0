const chalk = require('chalk');
const {Canvas} = require("canvacord");

module.exports = {
    name : 'facepalm',
    description : 'Dammit!',
    usage: 'facepalm [@user]',
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

        const image = await Canvas.facepalm(avatar)
        m.delete({timeout: 5000});

        let attachment = new Discord.MessageAttachment(image, "facepalm.png");

        embed.setTitle(`Facepalm`)
        .setDescription(`**Smh...**`)
        .setColor(options.color)
        .setTimestamp()
        .setImage('attachment://facepalm.png')
        .setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));

        message.channel.send({embeds: [embed], files: [attachment]})
    }
}