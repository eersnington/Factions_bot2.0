const ms = require('ms');

module.exports = {
    name: 'giveaway-reroll',
    description: 'Reroll a giveaway',
    usage: 'giveaway-refoll <message_id>',
    aliases: ['g-reroll', 'greroll'],
    whitelist: false,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');

        const errEmbed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(options.color)
            .setTimestamp()
            .setFooter(`Glowstone Bot | Glowstone-Development`);

            if(!args[0]){
                errEmbed.setDescription('Please specify the giveaway id')
                return message.reply({embeds: [errEmbed]});
            } 
        
            const messageID = args[0];
            client.giveawaysManager.reroll(messageID).then(() => {
                message.channel.send('Success! Giveaway rerolled!');
            }).catch((err) => {
                message.channel.send('No giveaway found for \`' + messageID + '\`, please check and try again');
            });
    }
}