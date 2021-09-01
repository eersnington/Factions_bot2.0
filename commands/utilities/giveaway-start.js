const ms = require('ms');

module.exports = {
    name: 'giveaway-start',
    description: 'Start a giveaway',
    usage: 'giveaway-start <duration> <winner_count> <prize>',
    aliases: ['g-start', 'gstart'],
    whitelist: true,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const errEmbed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(options.color)
            .setTimestamp()
            .setFooter(`Glowstone Bot | Glowstone-Development`);
        
        if (args.length <1){
            errEmbed.setDescription(`Please follow the giveaway format! \`${options.discord_options.prefix}help giveaway-start\``)
            return message.reply({embeds: [errEmbed]});
        }
        if (!ms(args[0]) || isNaN(parseInt(args[1]))){

            errEmbed.setDescription(`Please follow the giveaway format! \`${options.discord_options.prefix}help giveaway-start\``)
            return message.reply({embeds: [errEmbed]});
        } 
        
        client.giveawaysManager.start(message.channel, {
            time: ms(args[0]),
            winnerCount: parseInt(args[1]),
            prize: args.slice(2).join(' '),
            messages: {
                giveaway: '🎉🎉 **GIVEAWAY** 🎉🎉 @here',
                giveawayEnded: '🎉🎉 **GIVEAWAY ENDED** 🎉🎉',
                inviteToParticipate: 'React with 🎉 to participate!',
                timeRemaining: 'Time remaining: **{duration}**',
                winMessage: 'Congratulations, {winners}! You won **{prize}**!',
                embedFooter: `${message.guild.name}`,
                noWinner: 'Giveaway cancelled, no valid participations.',
                winners: 'winner(s)',
                endedAt: 'Ended at',
                hostedBy: 'Hosted by: {user}',
              }
        }).then((gData) => {
            message.channel.send(`Giveaway end command \`${options.discord_options.prefix}g-end ${gData.messageId}\``);
            message.channel.send(`Giveaway reroll command \`${options.discord_options.prefix}g-reroll ${gData.messageId}\``);
        });
        // And the giveaway has started!
    }
}