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
    name: 'unban',
    description: 'Unban a user',
    usage: 'unban @user <reason>',
    aliases: [],
    requiredRoles: [],
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let id = (args[0]).replace('<@!', '').replace('>', '')

        const member = await client.users.fetch(id)
        let reason = args.slice(1).join(' ');

        if (!reason) return message.reply('No Reason provided.');

        client.punish.unban(client, message, member, reason)

    }
}