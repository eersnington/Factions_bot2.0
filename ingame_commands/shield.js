const chalk = require('chalk');
const Discord = require("discord.js");

module.exports = {
    name : 'shield',
    description : 'Turn on/off shield alerts',
    usage: 'shield [on/off]',
    aliases: [],
    whitelist: true,
    member: false,
    async execute(client, message, player, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        const chat = args.substring(1);

        buffer_logic(chat, client, player)

    }
}

function buffer_logic(status, client, player) {

    const shieldEmbed = new Discord.MessageEmbed()

    let options = client.db.get("options");
    let buffer_chat = client.channels.cache.get(options.discord_options.buffer_channel);

    if (status == "off"){
        shieldEmbed.setTitle(`🛡️ Shield is now OFF`)
        .setAuthor(`${player}`, "https://mc-heads.net/avatar/" + player + "/100/nohelm.png")
        .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
        .setFooter(`Glowstone Bot | ${buffer_chat.guild.name}`)
        .setDescription('☢️ **You will now get regular wall/buffer check alerts**\n**Priority:** DO NOT FOLD ☠️')
        .setColor(options.color);
      
        client.bot.chat(`!!! Wall/Buffer Check Alert !!! Check walls/buffers right now and do ${options.discord_options.prefix}checked N/S/E/W`)
        client.buffer_interval = setInterval(()=>{

            let options = client.db.get("options");
            let buffer_chat = client.channels.cache.get(options.discord_options.buffer_channel);

            if (!buffer_chat) return
            if(client.bot == null) {
                shieldEmbed.setTitle(`⚠️ Warning`)
                .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
                .setDescription(`Shield alerts cancelled due to the bot being offline in \`${options.minecraft_options.ip}\`\nTo join the server, simply issue the command \`${options.discord_options.prefix}join\``)
                .setColor(options.color);
                clearInterval(options.checks.buffer_interval);
                return buffer_chat.send({embeds:[shieldEmbed]}); 
            }
            if (client.buffer_check_count == 0){
                client.bot.chat(`${client.buffer_check_count} checks since the last ${options.discord_options.interval} minutes!! Do not slack!!`)
            } else if (client.buffer_check_count == 1){
                client.bot.chat(`There has only been ${client.buffer_check_count} check since the last ${options.discord_options.interval} minutes!`)
            }else {
                client.bot.chat(`There have been ${client.buffer_check_count} checks since the last ${options.discord_options.interval} minutes!`)
            }
            client.buffer_check_count = 0
            setTimeout(()=>client.bot.chat(`!!! Wall/Buffer Check Alert !!! Check walls/buffers right now and do ${options.discord_options.prefix}checked N/S/E/W`), 2000);
            
        }, parseInt(client.db.get("options").discord_options.interval)*60000)
        buffer_chat.send({embeds:[shieldEmbed]});

    } else if (status == "on") {

        clearInterval(client.buffer_interval)
        shieldEmbed.setTitle(`🛡️ Shield is now ON`)
        .setAuthor(`${player}`, "https://mc-heads.net/avatar/" + player + "/100/nohelm.png")
        .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
        .setDescription(`🔕 **You will no longer get regular wall/buffer check alerts**\n**Priority:** Grind 💪`)
        .setFooter(`Glowstone Bot | ${buffer_chat.guild.name}`)
        .setColor(options.color);

        buffer_chat.send({embeds:[shieldEmbed]});
        return client.bot.chat('Wall/Buffer Check Alerts are now Disabled');

    }
}