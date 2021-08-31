const chalk = require("chalk")
module.exports = (Discord, client, message) => {
    const prefix = client.config.bot.prefix
    const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
    if (!client.toggle){
        console.log(chalk.hex("#e12120")("[Glowstone] HWID not authenticated"))
        process.exit(0);
    }
    let mentionEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setAuthor(`${message.client.user.username}`, message.client.user.avatarURL())
        .setDescription("✨Hello, my prefix is \`" + prefix + "\`. Use \`" + prefix + "help\`  for all of my commands!✨")
        .setColor(client.config.embed_color)
        .setFooter(`Glowstone Bot |  ${client.user.tag} `);

    const errEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setAuthor(`${message.member.username}`, message.member.avatarURL())
        .setColor(client.config.embed_color)
        .setFooter(`Glowstone Bot |  ${message.guild.name} `);
    
    if (message.mentions.users.has(message.client.user.id)) message.channel.send({content: `<@${message.author.id}>`, embeds: [mentionEmbed]})

    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/[ ]+/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName)|| client.commands.find(command => command.aliases.includes(commandName));
    
    if (!command) return;
    
    let role_count = 0

    if (!client.config.bot.whitelist.includes(message.member.id)){
        if (command.requiredRoles.length !=0){
            command.requiredRoles.forEach(role => {
                if (message.member.roles.cache.has(role)) role_count++;
            })
            
            if (role_count <1) return message.reply(`You do not have the required roles!`);
        }
    
        if (!message.member.permissions.has(command.requiredPerms)){

            errEmbed.setDescription(`You do not have the required permissions!\n**Permissions Required:** ${command.requiredPerms}`)
            return message.reply({embeds: [errEmbed]});
        } 
    }

    if (!client.toggle){
        console.log(chalk.hex("#e12120")("[Glowstone] HWID not authenticated"))
        process.exit(0);
    }
    
    if(client.toggle) command.execute(client, Discord, message, args);

}