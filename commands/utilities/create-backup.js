const backup = require("discord-backup");

module.exports = {
    name: 'create-backup',
    description: 'Create a discord backup',
    usage: 'create-backup',
    aliases: [],
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
        
        backup.create(message.guild).then((backupData) => {

            return message.channel.send('Backup created! Here is your ID: `'+backupData.id+'`! Use `'+options.discord_options.prefix+'load-backup '+backupData.id+'` to load the backup here or on another server!');
    
        }).catch(() => {
    
            return message.channel.send(':x: An error occurred, please check if the bot is administrator!');
    
        });

    }
}