const chalk = require('chalk');
const Discord = require("discord.js");


module.exports = {
    name : 'tpa',
    description : 'Send a tpa request to a player',
    usage: 'tpa <player_ign>',
    aliases: [],
    whitelist: true,
    member: false,
    async execute(client, message, player, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        const chat = args.substring(1);

        client.bot.chat(`/tpa ${chat}`)
    }
}