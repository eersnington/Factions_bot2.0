const ms = require('ms')

module.exports = {
    name: 'purge',
    description: 'Bulk delete messages',
    usage: 'purge <no. of messages>',
    aliases: [],
    requiredRoles: [],
    requiredPerms: [],
    async execute(client, Discord, message, args){
        if(!args[0]) return message.reply("**Please enter the amount of messages that you want to clear!**")
        if(isNaN(args[0])) return message.reply("**Please enter a real integer!**")

        if(args[0]>100) return message.reply("**You cannot delete more than 100 messages**");
        if(args[0]<0) return message.reply("**You must delete at least 1 message**");

        client.punish.purge(client, message, null, args[0]);
    }
}