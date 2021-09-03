const ms = require('ms');

module.exports = {
    name: 'mute',
    description: 'Mute a user',
    usage: 'mute @user <time> <reason>',
    aliases: [],
    whitelist: true,
    dev: true,
    requiredPerms: ["KICK_MEMBERS"],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');

        if (!client.db.get('muted')) client.db.set('muted', {})
        let mutesJson = client.db.get('muted');

        const member = message.mentions.members.first();
        let time = args[1];
        const reason = args.slice(2).join(' ');

        if(!member) return message.reply("**Mention a valid user!**")
        if (member.id === message.author.id) return message.reply('**You can\'t mute your self!**')
        if (member.id === client.id) return message.reply('**You can\'t mute me!**')
        if(isNaN(ms(time))) return message.reply("**Please enter a valid time period!**")
        if(!reason) return message.reply("**Please mention a reason!**")

        const role = message.guild.roles.cache.find(role => role.name === 'muted')
        let channel = client.channels.cache.get(options.discord_options.logs_channel)
        const roleCache = member.roles.cache

        if (!role) {
            try {
                message.channel.send('No muted role.. making one..!')
                let muterole = await message.guild.roles.create({ name: "muted", color: "#262626" });
                message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async (channel, id) => {
                    await channel.permissionOverwrites.create(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    })
                });
                let success = new Discord.MessageEmbed()
                .setDescription('Muted role has sucessfully been created')
                .setColor("GREEN")

                message.channel.send({embeds:[success]})
            } catch (error) {
                console.log(error)
            }
        };
        let role2 = message.guild.roles.cache.find(role => role.name === 'muted');
        
        if (member.roles.cache.has(role2)) return message.reply('User is already muted! ')

        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply('You cant mute this user')


        const logsEmbed = new Discord.MessageEmbed()
        .setColor(options.color)
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setThumbnail(message.guild.iconURL())
        .setDescription(
            `__**Player muted**__\n
            **Channel: **\`${message.channel.name}\`\n**Moderator: **<@${message.member.id}>\n**User: **<@${member.user.id}>\n**Reason: ** \`${reason}\`\n**Duration: ** \`${ms(ms(time))}\``
        )
        .setTitle(`📋 Logs`)
        .setTimestamp()
        .setFooter(`Glowstone Bot | ${message.guild.name}`);

        try{

            await member.roles.remove(roleCache)
            await member.roles.add(role2)

        }catch (err){
            message.reply('I do not have the required permissions. Make sure my role is on the top')
        }

        if (channel){
            channel.send({embeds:[logsEmbed]})
        }

        let timeMuted = Date.now()
        message.channel.send(`**${member.user.username}** has been muted for **${ms(ms(time))}**, Reason: *${reason}*`)
        mutesJson[member.id] = {date: timeMuted, duration: ms(time), moderator: message.member.id, channel: message.channel.name};
        client.db.set('muted', mutesJson)

        setTimeout(async() => {
            let newMutedJson = client.db.get('muted')
            delete newMutedJson[member.id]
            client.db.set('muted', newMutedJson)

            userRoles = []
            roleCache.each(role => {
                if (role.name != '@everyone') userRoles.push(role.id)
            })

            try{
                
                await member.roles.remove(role2);
                userRoles.forEach(role => member.roles.add(role))
            }catch (err){

                if (err == "DiscordAPIError: Unknown Member") return
            }

            // API ISSUE, discordapi flips out if you try to add a role a user already has
            
            const logsEmbed2 = new Discord.MessageEmbed()
            .setColor(options.color)
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
                .setThumbnail(message.guild.iconURL())
                .setDescription(
                    `__**Player unmuted**__\n
                    **Channel: **\`${message.channel.name}\`\n**Moderator: **<@${message.member.id}>\n**User: **<@${member.user.id}>\n**Reason: ** \`${reason}\`\n**Duration: ** \`Completed\``
                )
                .setTitle(`📋 Logs`)
                .setTimestamp()
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
            if (channel){
                channel.send({embeds: [logsEmbed2]})
            }
            
        }, ms(time))

    }
}