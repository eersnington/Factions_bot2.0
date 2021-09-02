const chalk = require('chalk');
const Discord = require("discord.js");


module.exports = {
    name : 'sudo',
    description : 'Chat through the bot',
    usage: 'sudo',
    aliases: [],
    whitelist: true,
    member: false,
    async execute(client, message, player, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        const chat = args.substring(1);

        client.bot.chat(chat)
    }
}