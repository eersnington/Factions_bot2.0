const chalk = require('chalk');
const {Canvas} = require("canvacord");

module.exports = {
    name : 'slap',
    description : 'Send someone to the shadow realm',
    usage: 'slap [@user]',
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

        const image = await Canvas.slap(message.author.displayAvatarURL({format:"png"}), avatar)
        m.delete({timeout: 5000});

        let attachment = new Discord.MessageAttachment(image, "slap.png");

        embed.setTitle(`Slap`)
        .setDescription(`**Get bitch slapped**`)
        .setColor(options.color)
        .setTimestamp()
        .setImage('attachment://slap.png')
        .setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));

        message.channel.send({embeds: [embed], files: [attachment]})
    }
}