module.exports = {
    name: 'kick',
    description: 'Kicks a user',
    usage: 'kick @user <reason>',
    aliases: [],
    requiredRoles: [],
    requiredPerms: [],
    async execute(client, Discord, message, args){
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args[0] || x.user.tag === args[0]);
        let reason = args.slice(1).join(' ');
        
        if(!member) return message.reply('mention any member!');
        if(!reason) return message.reply('No Reason provided.');
        if (member.id === message.author.id) return message.reply('You can\'t kick your self!')
        if (member.id === client.id) return message.reply('You cant kick me!')
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply('You cant kick this user')  

        client.punish.kick(client, message, member, reason);
    }
}