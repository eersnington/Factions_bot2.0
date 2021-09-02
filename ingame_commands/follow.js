const chalk = require('chalk');
const Discord = require("discord.js");
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const Movements = require('mineflayer-pathfinder').Movements;
const { GoalNear } = require('mineflayer-pathfinder').goals;

module.exports = {
    name : 'follow',
    description : 'Bot will walk over to you or the player mentioned',
    usage: 'follow [player_ign]',
    aliases: [],
    whitelist: true,
    member: false,
    async execute(client, message, player, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        const chat = args.substring(1);

        client.bot.loadPlugin(pathfinder)

        const mcData = require('minecraft-data')(client.bot.version)

        const defaultMove = new Movements(client.bot, mcData)

        if (player === client.bot.username) return

        let target
        let target_chosen

        if (chat != ""){
            target = client.bot.players[chat] ? client.bot.players[chat].entity : null
            target_chosen = chat
        }else {
            target = client.bot.players[player] ? client.bot.players[player].entity : null
            target_chosen = player
        }

        if (!target) return client.bot.chat(`${target_chosen} might be an invalid player or is out of my range`)

        const p = target.position

        client.bot.pathfinder.setMovements(defaultMove);
        client.bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1));
        client.bot.chat(`Following ${target_chosen}!`)

    }
}