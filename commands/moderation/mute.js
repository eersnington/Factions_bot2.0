const ms = require('ms')

/**
 * Mutes structure
 * {    user:{
 *          date:
 *          duration:
 *      }
 * }
 * 
 */

module.exports = {
    name: 'mute',
    description: 'Mute a user',
    usage: 'mute @user <time> <reason>',
    aliases: [],
    requiredRoles: [],
    requiredPerms: [],
    async execute(client, Discord, message, args){

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args[0] || x.user.tag === args[0]);
        let time = args[1];
        const reason = args.slice(2).join(' ');

        if (!member) return message.reply('Mention a user! (or the user isn\'t in the guild)');
        if (!time) return message.reply('Tell the time!');
        if (!reason) return message.reply('Tell me a reason');

        if (member.id === client.id) return message.reply('You can\'t mute me!');
        if (member.id === message.author.id) return message.reply('You can\'t mute your self!');
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply('You can\'t ban this user');

        client.punish.mute(client, message, member, reason, time)

    }
}