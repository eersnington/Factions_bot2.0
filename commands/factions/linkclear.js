const chalk = require('chalk');

module.exports = {
    name : 'linkclear',
    description : 'Clear any minecraft links associated to a discord account',
    usage: 'linkclear @user',
    aliases: ['l-clear', 'lclear'],
    whitelist: true,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        const discID = args.join(" ").match(/\d+/)[0]
        let whitelistCleared = []
        let memberCleared = []

        for (let user in options.players.whitelist){
            if (options.players.whitelist[user] == discID){
                whitelistCleared.push(user)
                delete options.players.whitelist[user]
            }
        }

        for (let user in options.players.faction){
            if (options.players.faction[user] == discID){
                memberCleared.push(user)
                delete options.players.faction[user]
            }
        }

        client.db.set('options', options);

        embed.setTitle(`🔗  Link clear`)
        .setDescription(`Here are the list of accounts associated with <@${discID}> that has been cleared\n
        **Whitelisted Accounts:** \`${(whitelistCleared.length >= 1) ? whitelistCleared.join(", "): "None"}\`\n**Member Accounts:** \`${(memberCleared.length >= 1) ? memberCleared.join(", "): "None"}\``)
        .setFooter('Glowstone Bot | Glowstone-Development');
        return message.channel.send({embeds: [embed]});

    }
}