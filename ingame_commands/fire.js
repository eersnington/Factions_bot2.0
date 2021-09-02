const chalk = require('chalk');
const Discord = require("discord.js");

module.exports = {
    name : 'fire',
    description : 'Fire a button or button spam',
    usage: 'fire [time]',
    aliases: [],
    whitelist: true,
    member: true,
    async execute(client, message, player, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        const chat = args.substring(1);

        button_click(chat, client);

    }
}

function button_click(args, client) {
    const mcData = require('minecraft-data')(client.bot.version);
    const block = client.bot.findBlock({
        matching: mcData.blocksByName["stone_button"].id,
        maxDistance: 4,
        count: 1
    });
    if (!block) {
        return client.bot.chat("Button is too far (max reach is 3 blocks)");
    }
    if (args == ""){
        client.bot.activateBlock(block);
        client.bot.chat(`Fired!`);
    }else{
        let time = parseFloat(args);
        let button_spam;
        client.bot.chat(`Button spamming for ${time} seconds!`);
        setTimeout(()=> clearInterval(button_spam), (time*1000))
        button_spam = setInterval(()=> client.bot.activateBlock(block), 100);
        
    }
}