const chalk = require('chalk');
const Discord = require("discord.js");

module.exports = {
    name : 'lever',
    description : 'Flick a lever or safe clock a cannon',
    usage: 'lever [cannon_speed] [tnt_amount] [pulsed]',
    aliases: [],
    whitelist: true,
    member: true,
    async execute(client, message, player, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        const chat = args.substring(1);

        lever_flick(chat, client);

    }
}

function lever_flick(args, client) {
    const mcData = require('minecraft-data')(client.bot.version)
    const block = client.bot.findBlock({
      matching: mcData.blocksByName["lever"].id,
      maxDistance: 4,
      count: 1
    });
    if (!block) {
        return client.bot.chat("No lever near me");
    }
    const parameters = args.split(" ") 
    
    if (parameters[0] == ""){
        client.bot.activateBlock(block);
        return client.bot.chat(`Levered!`)
    }
    
    if (parameters.length != 3){
        return client.bot.chat(`Incorrect Usage. Please check for command usage in discord with ${options.discord_options.prefix}help`);
        
    }else {
        const cannon_speed = parseFloat(parameters[0])
        const tnt_amount = parseInt(parameters[1])
        const pulsed = parseInt(parameters[2])

        client.bot.chat(`Safe Clocked! Cannon-speed: ${cannon_speed}, Tnt-filled: ${tnt_amount}, Pulsed: ${pulsed}`);
        client.bot.activateBlock(block);
        setTimeout(()=> {
            client.bot.activateBlock(block)
            client.bot.chat(`Deactivated Cannon! Out of tnt!!`);
        }, ((tnt_amount-pulsed)/pulsed)*cannon_speed*1000)
    }
}