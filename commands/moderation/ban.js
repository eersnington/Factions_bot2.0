module.exports = {
    name: 'ban',
    description: 'Permanent ban a user (also clears their messages)',
    usage: 'ban @user <reason>',
    aliases: [],
    requiredRoles: [],
    requiredPerms: [],
    async execute(client, Discord, message, args){

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args[0] || x.user.tag === args[0]);
        let reason = args.slice(1).join(' ');
        
        if (!member) return message.reply('Mention a member! (or the user isn\'t in the guild)')
        if (!reason) return message.reply('No Reason provided.');
        if (member.id === client.id) return message.reply('You can\'t ban me!');
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply('You can\'t ban this user');

        client.punish.ban(client, message, member, reason);
    }
}