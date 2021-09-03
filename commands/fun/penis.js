const chalk = require('chalk');

module.exports = {
    name : 'penis',
    description : 'Find our the penis size of a user',
    usage: 'penis <@user>',
    aliases: ['pepecheck'],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');

        let dickSizeMin = 0;
        let dickSizeMax = 10;
        let dickSize = Math.floor(Math.random()*(dickSizeMax - dickSizeMin +1)+dickSizeMin)
        let dickOfUser = (dickSize >0) ? "8"+"=".repeat(dickSize)+"D":  "404 not found"
        let dickuser = message.mentions.users.first()

        if (!dickuser) {
            return message.channel.send('You must mention someone!\n(This is 100% accurate!)');
        }

        let Toxic  = new Discord.MessageEmbed()
        .setColor(options.color)
        .setAuthor(`🍆 ${message.mentions.users.first().username} Dick Size`)
        .setDescription(`**Size:**\n 8=============================D\n**Note:** This is 100% accurate.`)
        .setFooter(`Sized by: ${message.author.username}`)

        let CHAD = ["364018024665186304", "714736434782666752"]
        if (CHAD.includes(dickuser.id)) {
            return message.channel.send({embeds:[Toxic]});
        } // rigged

        let embed  = new Discord.MessageEmbed()
        embed.setColor(options.color)
        .setAuthor(`🍆 ${message.mentions.users.first().username} Dick Size`)
        .setDescription(`**Size:**\n${dickOfUser}\n**Note: This is 100% accurate.`)
        .setFooter(`Sized by: ${message.author.username}`);

        message.channel.send({embeds:[embed]})
    }
}