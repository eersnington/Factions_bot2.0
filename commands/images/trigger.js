const chalk = require('chalk');
const {Canvas} = require("canvacord");

module.exports = {
    name : 'trigger',
    description : 'Uh ohh, someone\'s triggered',
    usage: 'trigger [@user]',
    aliases: ['triggered'],
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

        const image = await Canvas.trigger(avatar)
        m.delete({timeout: 5000});

        let attachment = new Discord.MessageAttachment(image, "triggered.gif");

        embed.setTitle(`Triggered`)
        .setDescription(`**L Dance**`)
        .setColor(options.color)
        .setTimestamp()
        .setImage('attachment://triggered.gif')
        .setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));

        message.channel.send({embeds: [embed], files: [attachment]})
    }
}