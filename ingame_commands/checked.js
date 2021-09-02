const chalk = require('chalk');
const Discord = require("discord.js");

module.exports = {
    name : 'checked',
    description : 'Notifies the bot when you check a side',
    usage: 'checked <N/S/E/W>',
    aliases: [],
    whitelist: true,
    member: true,
    async execute(client, message, player, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        const chat = args.substring(1);

        let buffer_chat = client.channels.cache.get(options.discord_options.buffer_channel);
        if(!buffer_chat){
            client.bot.chat('buffer_channel not set!')
            return console.log(chalk.red.bold(`[Glowstone] ${player} checked walls/buffers! You haven't set a buffer_channel!!`));
        }

        embed.setFooter(`Glowstone Bot | ${message.guild.name}`);

        if (chat.length < 1){
            return client.bot.chat("Please specify a direction <N/S/E/W>")
        }
        let amount_checked = options.checks.members[player];

        if (!amount_checked){
            options.checks.members[player] = 1
        }else{
            options.checks.members[player]++;
        }
        client.buffer_check_count++;

        client.db.set('options', options);

        embed.setTitle(`BUFFER CHECKED`)
        .setDescription(`${player} just completed a wall/buffer check\n**Total Checks:** ${options.checks.members[player]}\n**Direction:** ${chat}`)
        .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
        .setImage("https://mc-heads.net/avatar/" + player + "/100/nohelm.png")
        buffer_chat.send({embeds: [embed]})
        client.bot.chat(`Your contribution has beed noted ${player}`);

    }
}