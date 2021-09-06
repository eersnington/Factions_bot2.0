const Discord = require('discord.js');
const ms = require('ms');
const moment = require('moment');

module.exports.ban = async (client, message, member, reason) =>{
    await member.ban({
        reason: reason,
    }).then(() => {
        
        message.channel.messages.fetch({
            limit: 100 
        }).then((messages) => { 
            const botMessages = [];
            messages.filter(m => m.author.id === member.user.id).forEach(msg => botMessages.push(msg));
            message.channel.bulkDelete(botMessages);
        })
        message.channel.send(`**${member.user.tag}** got banned!`);

        client.modlogs.run(client, message, member, "ban", reason);
    })
}

module.exports.unban = async (client, message, member, reason) =>{
    await message.guild.members.unban(member).then(() => {
        
        message.channel.send(`**${member}** got unbanned!`);

        client.modlogs.run(client, message, member, "unban", reason, moment().format('MMM Do YYYY'));
    }).catch(()=>{message.channel.send("Unknown ban!")})
}

module.exports.tempban = async (client, message, member, reason, duration) =>{

    await member.ban({
        reason: reason,
    }).then(() => {

        let day = moment().format('MMM Do YYYY')
        
        message.channel.messages.fetch({
            limit: 100 
        }).then((messages) => { 
            const botMessages = [];
            messages.filter(m => m.author.id === member.user.id).forEach(msg => botMessages.push(msg))
            message.channel.bulkDelete(botMessages);
        })
        message.channel.send(`**${member.user.tag}** got banned for **${ms(ms(duration))}**!`);

        client.modlogs.run(client, message, member, "tempban", reason, duration);

        setTimeout(async() => {
            await message.guild.members.unban(member.user.id);
            
            client.modlogs.run(client, message, member, "unban", "Ban duration completed", day);

        }, ms(duration))
    })
}

module.exports.mute = async (client, message, member, reason, duration) =>{
    if (!client.db.get('muted')) client.db.set('muted', {});
    let mutedJson = client.db.get('muted');
    
    const role = message.guild.roles.cache.find(role => role.name === 'muted');
    const roleCache = member.roles.cache;

    if (!role) {
        try {
            let missing = new Discord.MessageEmbed()
            .setDescription('No muted role.. making one..!')
            .setColor("RED");
            message.channel.send({embeds:[missing]});

            let muterole = await message.guild.roles.create({ name: "muted", color: "#262626" });
            message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async (channel, id) => {
                await channel.permissionOverwrites.create(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                })
            });
            let success = new Discord.MessageEmbed()
            .setDescription('Muted role has been created successfully!')
            .setColor("GREEN");
            message.channel.send({embeds:[success]});

        } catch (error) {
            return console.log(error)
        }
    };
    let role2 = message.guild.roles.cache.find(role => role.name === 'muted');
    
    if (member.roles.cache.has(role2.id)) return message.reply('User is already muted! ');

    try{

        await member.roles.remove(roleCache)
        await member.roles.add(role2)

    }catch (err){
        return message.reply('I do not have the required permissions. Make sure my role is on the top')
    }

    client.modlogs.run(client, message, member, "mute", reason, duration)

    let timeMuted = Date.now();
    message.channel.send(`**${member.user.username}** has been muted for **${ms(ms(duration))}**, Reason: *${reason}*`);
    mutedJson[member.id] = {date: timeMuted, duration: ms(duration), moderator: message.member.id, channel: message.channel.name, moment: moment().format('MMM Do YYYY')};
    client.db.set('muted', mutedJson);

    setTimeout(async() => {
        let newMutedJson = client.db.get('muted');

        if (!newMutedJson[member.id]) return;

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
       
        let day = mutedJson[member.id].moment;

        client.modlogs.run(client, message, member, "unmute", "Mute duration completed", day);

        delete newMutedJson[member.id];
        client.db.set('muted', newMutedJson);
        
    }, ms(duration))
}

module.exports.unmute = async (client, message, member, reason, duration) =>{
    if (!client.db.get('muted')) client.db.set('muted', {});
    let mutedJson = client.db.get('muted');
    
    const role = message.guild.roles.cache.find(role => role.name === 'muted');
    const join_role = member.guild.roles.cache.find(r => r.id == client.db.get('options').discord_options.join_role);

    if(member.roles.cache.has(role.id)){

        try{
            await member.roles.remove(role)
            if(join_role) await member.roles.add(join_role)
            
        }catch (err){
    
            return message.reply('I do not have the required permissions. Make sure my role is on the top')
        }

        message.channel.send(`**${member.user.username}** has been unmuted!`);
    
        client.modlogs.run(client, message, member, "unmute", reason, mutedJson[member.id].moment);
    
        delete mutedJson[member.id];
        client.db.set('muted', mutedJson);
        
    }else{
        return message.reply("This user isn't muted!")
    }

}

module.exports.kick = async (client, message, member, reason) =>{

    member.kick().then(() => {
        message.channel.send({content: `**${member.user.tag}** got kicked!`})
        client.modlogs.run(client, message, member, "kick", reason);
    })
}

module.exports.purge = async (client, message, member, count) =>{

    await message.channel.messages.fetch({limit:count}).then(async msgs => {
        await message.channel.bulkDelete(msgs).then((deletedMsgs) =>{

            const embed = new Discord.MessageEmbed()
            .setFooter(`Requested By ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle(`💬💀 Purge:`)
            .setThumbnail(message.author.displayAvatarURL({dynamic:true}))
            .setDescription(`**Purge Requested:** \`${count}\`\n**Total Purged:** \`${deletedMsgs.size}\``)
            .setFooter(`Glowstone Bot | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
            .setColor(client.db.get('options'));

            message.channel.send({embeds:[embed]});

            client.modlogs.run(client, message, member, "purge", deletedMsgs.size);

        }).catch(()=>{});
    });
}