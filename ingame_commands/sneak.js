const chalk = require('chalk');
const Discord = require("discord.js");

let sneaking = false

module.exports = {
    name : 'sneak',
    description : 'Toggle between shifting and unshifting',
    usage: 'sneak',
    aliases: [],
    whitelist: true,
    member: false,
    async execute(client, message, player, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        const chat = args.substring(1);

        sneaking = !sneaking
        client.bot.setControlState('sneak', sneaking);
        let sneaked = (sneaking ) ? client.bot.chat(`Holding shift!`) : client.bot.chat(`Unshifted!`)
    }
}