const chalk = require('chalk');
const {Canvas} = require("canvacord");

module.exports = {
    name : 'spank',
    description : 'You see an opportunity ( ͡° ͜ʖ ͡°)',
    usage: 'spank [@user]',
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

        const image = await Canvas.spank(message.author.displayAvatarURL({format:"png"}), avatar)
        m.delete({timeout: 5000});

        let attachment = new Discord.MessageAttachment(image, "spank.png");

        embed.setTitle(`Spank`)
        .setDescription(`**He saw an opportunity and took it**`)
        .setColor(options.color)
        .setTimestamp()
        .setImage('attachment://spank.png')
        .setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));

        message.channel.send({embeds: [embed], files: [attachment]})
    }
}