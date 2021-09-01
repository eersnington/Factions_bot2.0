const chalk = require('chalk');

module.exports = {
    name : 'shield',
    description : 'Turn on/off shield alerts',
    usage: 'shield <on/off>',
    aliases: [],
    whitelist: true,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        if (client.bot != null){

            const chat = args.join(" ")

            let buffer_chat = client.channels.cache.get(options.discord_options.buffer_channel);
            if(!buffer_chat){
                embed.setTitle('⁉️ Missing Channel')
                .setDescription(`Please set a buffer channel with \`${options.discord_options.prefix}set buffer_channel\``)
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
                .setFooter(`Glowstone Bot | Glowstone-Development`);
                message.channel.send({embeds:[embed]});

                return console.log(chalk.red.bold(`[Glowstone] ${message.author.tag} called shield alerts command! You haven't set a buffer_channel!!`));
            }

            buffer_logic(client, chat, message, Discord)
            
        } else {
            embed.setTitle(`⚠️ Warning`)
            .setDescription(`There is no bot online in the server \`${options.minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\``)
            .setFooter('Glowstone Bot | Glowstone-Development');
            return message.channel.send({embeds:[embed]});
        }

    }
}

function buffer_logic(client, status, message, Discord) {

    const shieldEmbed = new Discord.MessageEmbed()

    let options = client.db.get("options");
    let buffer_chat = client.channels.cache.get(options.discord_options.buffer_channel);

    if (status == "off"){
        shieldEmbed.setTitle(`🛡️ Shield is now OFF`)
        .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
        .setFooter(`Glowstone Bot | ${message.guild.name}`)
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
            if (options.checks.buffer_check_count == 0){
                client.bot.chat(`${options.checks.buffer_check_count} checks since the last ${options.discord_options.interval} minutes!! Do not slack!!`)
            } else if (options.checks.buffer_check_count == 1){
                client.bot.chat(`There has only been ${options.checks.buffer_check_count} check since the last ${options.discord_options.interval} minutes!`)
            }else {
                client.bot.chat(`There have been ${options.checks.buffer_check_count} checks since the last ${options.discord_options.interval} minutes!`)
            }
            options.checks.buffer_check_count = 0
            setTimeout(()=>client.bot.chat(`!!! Wall/Buffer Check Alert !!! Check walls/buffers right now and do ${options.discord_options.prefix}checked N/S/E/W`), 2000);
            
        }, parseInt(client.db.get("options").discord_options.interval)*60000)
        buffer_chat.send({embeds:[shieldEmbed]});

    } else if (status == "on") {

        clearInterval(client.buffer_interval)
        shieldEmbed.setTitle(`🛡️ Shield is now ON`)
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
        .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
        .setDescription(`🔕 **You will no longer get regular wall/buffer check alerts**\n**Priority:** Grind 💪`)
        .setFooter(`Glowstone Bot | ${message.guild.name}`)
        .setColor(options.color);

        buffer_chat.send({embeds:[shieldEmbed]});
        return client.bot.chat('Wall/Buffer Check Alerts are now Disabled');

    } else {
        shieldEmbed.setTitle(`🛡️ Shield Alerts`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter('Glowstone Bot | Glowstone-Development')
        .setDescription(`Shield alerts reminds players in-game to buffer/wall check regularly and perform the \`${options.discord_options.prefix}checked\` command once they do so.\n
         It also tells you many checks have taken place every interval\n
         **Usage:**\`\`\`${options.discord_options.prefix}shield on\`\`\` \`\`\`${options.discord_options.prefix}shield off \`\`\``)
        .setColor(options.color);

        return message.channel.send({embeds:[shieldEmbed]});
    }
}