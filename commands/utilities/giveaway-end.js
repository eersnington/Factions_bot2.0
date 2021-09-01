const ms = require('ms');

module.exports = {
    name: 'giveaway-end',
    description: 'End a giveaway',
    usage: 'giveaway-end <message_id>',
    aliases: ['g-end', 'gend'],
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

            if(!args[0]){
                errEmbed.setDescription('Please specify the giveaway id')
                return message.reply({embeds: [errEmbed]});
            } 
        
        const messageID = args[0];
        client.giveawaysManager.end(messageID).then(() => {
            message.channel.send('Success! Giveaway ended!');
        }).catch((err) => {
            message.channel.send('No giveaway found for \`' + messageID + '\`, please check and try again');
         });
        // And the giveaway has started!
    }
}