const chalk = require('chalk');

module.exports = {
    name: 'shutdown',
    description: 'Closes the client',
    usage: 'shutdown',
    aliases: ['exit', 'pce'],
    whitelist: false,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const botEmbed = new Discord.MessageEmbed()
            .setTitle(`👋 Bot shutting down`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setThumbnail(message.guild.iconURL())
            .setDescription(`Shutting down!`)
            .setColor(options.color)
            .setFooter('Glowstone Bot | Glowstone-Development');

            console.log(chalk.red.bold(`[Glowstone] ${message.author.tag} has shutdown the bot!`))
            message.channel.send({embeds: [botEmbed]}).then(() => {
                if (client.bot != null){
                    client.bot.quit()
                    client.bot.end()
                }
                process.exit(0);
            })
    }
}