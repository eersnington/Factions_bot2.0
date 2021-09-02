const chalk = require('chalk');
const Discord = require("discord.js");


module.exports = {
    name : 'tpyes',
    description : 'Accept any pending tp request',
    usage: 'tpyes',
    aliases: [],
    whitelist: true,
    member: false,
    async execute(client, message, player, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        client.bot.chat(`/tpyes`)
    }
}