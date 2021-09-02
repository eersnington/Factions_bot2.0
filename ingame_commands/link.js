const chalk = require('chalk');
const Discord = require("discord.js");

module.exports = {
    name : 'link',
    description : 'Link your minecraft account to discord',
    usage: 'link <token>',
    aliases: [],
    whitelist: false,
    member: false,
    async execute(client, message, player, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setFooter('Glowstone Bot | Glowstone-Development')
        .setColor(options.color);

        const chat = args.substring(1);
        const authority = chat.substring(0,2);

        if (!Object.keys(client.temp_uuid).includes(chat)) return client.bot.chat("Invalid Key!");

        const url = `https://mc-heads.net/body/${player}/right`;

        if (authority == 'wl'){
            
            const channel = message.guild.channels.cache.get(options.discord_options.whitelist_channel);

            options.players.whitelist[player] = client.temp_uuid[chat];
                
            embed.setTitle(`✅ Successfully whitelisted!`)
            .setImage(url)
            .setThumbnail(client.users.cache.get(client.temp_uuid[chat]).displayAvatarURL({dynamic: true}))
            .setDescription(`**${client.users.cache.get(client.temp_uuid[chat]).tag}** has succesfully linked his/her account to the player **${player}**\n
                If you wish to add more accounts, simply redo the linking process with \`${options.discord_options.prefix}whitelistlink\``);

            client.db.set('options', options)

            delete client.temp_uuid[chat];
            channel.send({embeds: [embed]})
            return client.bot.chat(`You are now whitelisted ${player}!`);
            
        }else {
            options.players.faction[player] = client.temp_uuid[chat];

            embed.setTitle(`✅ Successfully registered as a member!`)
            .setImage(url)
            .setThumbnail(client.users.cache.get(client.temp_uuid[chat]).displayAvatarURL())
            .setDescription(`**${client.users.cache.get(client.temp_uuid[chat]).tag}** has succesfully linked his/her account to the player **${player}**\n
                If you wish to add more accounts, simply redo the linking process with \`${options.discord_options.prefix}memberlink\``);

            client.db.set('options', options)

            delete client.temp_uuid[chat];
            message.channel.send({embeds: [embed]})
            return client.bot.chat(`You are now registered as a member ${player}!`);
        }

    }
}