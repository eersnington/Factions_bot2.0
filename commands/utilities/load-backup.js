const backup = require("discord-backup");
const {MessageButton,MessageActionRow} = require('discord.js');

module.exports = {
    name: 'load-backup',
    description: 'Load a discord backup',
    usage: 'load-backup [backup-id]',
    aliases: [],
    whitelist: false,
    dev: true,
    requiredPerms: ["ADMINISTRATOR"],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const errEmbed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(options.color)
            .setTimestamp()
            .setFooter(`Glowstone Bot | Glowstone-Development`);
        
        const backupID = args.join(' ');

        backup.fetch(backupID).then(() => {

            const buttonFilter = (interaction) => interaction.user.id == message.author.id;

            const embed2 = new Discord.MessageEmbed()
                .setColor("RED")
                .setDescription('All the server channels, roles, and settings will be cleared.\n⚠️ Do you want to continue?');
                    
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('confirm-backup')
                    .setLabel('Confirm')
                    .setStyle('DANGER'),
                ).addComponents(
                    new MessageButton()
                    .setCustomId('cancel-backup')
                    .setLabel('Cancel')
                    .setStyle('SECONDARY'),
                );
                    
            message.channel.send({embeds: [embed2], components: [row]});

            const collector2 = message.channel.createMessageComponentCollector({buttonFilter, max:1, time:60000});

            collector2.on("end", (interaction, reason)=>{
                if (interaction.first().customId === 'confirm-backup'){
                    backup.load(backupID, message.guild).then(() => {
                        backup.remove(backupID); // When the backup is loaded, it's recommended to delete it
                    }).catch((err) => {
                
                        if (err === 'No backup found')
                            return message.channel.send(':x: No backup found for ID '+backupID+'!');
                        else
                            return message.author.send(':x: An error occurred: '+(typeof err === 'string') ? err : JSON.stringify(err));
                
                    });
                } else if (interaction.first().customId === 'cancel-backup'){
                    return message.channel.send(':x: Cancelled.');
                } else if (reason === 'time') return message.channel.send(':x: Command timed out! Please retry.');
            });

        }).catch(() => {
            return message.channel.send(':x: No backup found for ID '+backupID+'!');
        });

    }
}