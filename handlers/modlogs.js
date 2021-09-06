const Discord = require('discord.js');
const ms = require('ms');

module.exports.run = async (client, message, member, action, reason, duration) =>{

    let channel = client.channels.cache.get(client.db.get('options').discord_options.logs_channel);

    const logsEmbed = new Discord.MessageEmbed()
    .setColor(client.db.get('options').color)
    .setThumbnail(message.guild.iconURL({dynamic:true}))
    .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
    .setTimestamp()
    .setTitle(`📋 Logs`)
    .setFooter(`Glowstone Bot | ${message.guild.name}`);

    if (action == "ban"){

        logsEmbed.setDescription(
            `__**Player banned**__\n
            **Moderator: **<@${message.member.id}>\n**User: **<@${member.user.id}>\n**Reason: ** \`${reason}\`\n**Duration: ** \`Permanent\``
        );

        if (channel)return channel.send({embeds:[logsEmbed]})
        return
    }

    if (action == "tempban"){

        logsEmbed.setDescription(
            `__**Player banned**__\n
            **Moderator: **<@${message.member.id}>\n**User: **<@${member.user.id}>\n**Reason: ** \`${reason}\`\n**Duration: ** \`${ms(ms(duration))}\``
        );

        if (channel)return channel.send({embeds:[logsEmbed]})
        return

    }

    if (action == "unban"){

        let user_id = (member.user) ? member.user.id: member.id

        logsEmbed.setDescription(
            `__**Player unbanned**__\n
            **Moderator: **<@${message.member.id}>\n**User: **<@${user_id}>\n**Reason: ** \`${reason}\`\n**Date: ** \`${duration}\``
        );

        if (channel)return channel.send({embeds:[logsEmbed]})
        return
    }

    if (action == "mute"){

        logsEmbed.setDescription(
            `__**Player muted**__\n
            **Channel: **\`${message.channel.name}\`\n**Moderator: **<@${message.member.id}>\n**User: **<@${member.user.id}>\n**Reason: ** \`${reason}\`\n**Duration: ** \`${ms(ms(duration))}\``
        );

        if (channel)return channel.send({embeds:[logsEmbed]})
        return

    }

    if (action == "unmute"){

        logsEmbed.setDescription(
            `__**Player unmuted**__\n
            **Channel: **\`${message.channel.name}\`\n**Moderator: **<@${message.member.id}>\n**User: **<@${member.user.id}>\n**Reason: ** \`${reason}\`\n**Date: ** \`${duration}\``
        );

        if (channel)return channel.send({embeds:[logsEmbed]})
        return

    }

    if (action == "kick"){

        logsEmbed.setDescription(
            `__**Player kicked**__\n
            **Channel: **\`${message.channel.name}\`\n**Moderator: **<@${message.member.id}>\n**User: **<@${member.user.id}>\n**Reason: ** \`${reason}\``
        );

        if (channel)return channel.send({embeds:[logsEmbed]})
        return

    }

    if (action == "purge"){

        logsEmbed.setDescription(
            `__**Purged **__\n
            **Moderator: **<@${message.member.id}>\n**Purged amount: ** \`${reason}\``
        );

        if (channel)return channel.send({embeds:[logsEmbed]})
        return

    }

}