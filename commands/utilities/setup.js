module.exports = {
    name: 'setup',
    description: 'Setup faction bot channels',
    usage: 'setup',
    aliases: [],
    whitelist: false,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const errEmbed = new Discord.MessageEmbed();
        
        let required_channels = {
            'alerts_channel': 'alerts',
            'server_chat_channel': 'server-chat',
            'weewoo_channel': 'weewoo',
            'buffer_channel': 'checks',
            'flist_channel': 'flist',
            'fptop_channel': 'fptop',
            'ftop_channel': 'ftop',
            'logs_channel': 'logs',
            'whitelist_channel': 'verify'
        }

        let category = client.channels.cache.find(c => c.name.toLowerCase() == "factions bot" && c.type == "GUILD_CATEGORY");
    
        if (!category){
            errEmbed.setTitle('⁉️ Missing Category')
                .setDescription(`Please create a category called \`Factions bot\`, then redo the same command.`)
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
                .setFooter(`Glowstone Bot | Glowstone-Development`);
            return message.channel.send({embeds: [errEmbed]})
        }


        const embed = new Discord.MessageEmbed()
            .setColor(options.color)
            .setFooter(`Glowstone Bot | Glowstone-Development`);
        embed.setDescription('**Setting up channels, please wait...**');

        let m = await message.channel.send({embeds:[embed]});
        setTimeout(()=> m.delete(),5000);
        for(c in required_channels){    
            let exists = category.children.some((channel) => channel.name === required_channels[c])
                if (!exists){
                    message.guild.channels.create(required_channels[c], { type: 'GUILD_TEXT' }).then( m => {
                        m.setParent(category.id);
                        options.discord_options[c] = m.id

                    });
                }else {
                    let channel = message.guild.channels.cache.find(channel => channel.name === required_channels[c]);
                    if (channel.name == required_channels[c]){
                    
                        options.discord_options[c] = channel.id
                    }
                }
        }

        client.db.set('options', options)

        embed.setTitle('✅ Setup complete')
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Completed setup!\nSet the IP and Join-command with \`${options.discord_options.prefix}set\``)
            .setThumbnail(message.guild.iconURL());
        return message.channel.send({embeds: [embed]})
    }
}