const chalk = require('chalk');
const {Canvas} = require("canvacord");

module.exports = {
    name : 'beautiful',
    description : 'Oh this? This is beautiful!',
    usage: 'beautiful [@user]',
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

        const image = await Canvas.beautiful(avatar)
        m.delete({timeout: 5000});

        let attachment = new Discord.MessageAttachment(image, "beautiful.png");

        embed.setTitle(`Beautiful`)
        .setDescription(`**Oh this? This is beautiful! **`)
        .setColor(options.color)
        .setTimestamp()
        .setImage('attachment://beautiful.png')
        .setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));

        message.channel.send({embeds: [embed], files: [attachment]})
    }
}