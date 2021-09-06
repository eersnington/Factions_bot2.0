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
    name: 'unmute',
    description: 'Unmute a user',
    usage: 'unmute @user',
    aliases: [],
    requiredRoles: [],
    requiredPerms: [],
    async execute(client, Discord, message, args){

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args[0] || x.user.tag === args[0]);
        const reason = args.slice(1).join(' ');

        if (!member) return message.reply('Mention a user! (or the user isn\'t in the guild)');
        if (!reason) return message.reply('Tell me a reason');

        client.punish.unmute(client, message, member, reason)

    }
}