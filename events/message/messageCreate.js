const chalk = require("chalk")
module.exports = (Discord, client, message) => {
    const prefixMention = new RegExp(`^<@!?${client.user.id}> `);

    if (!client.toggle){
        console.log(chalk.hex("#e12120")("[Glowstone] HWID not authenticated"))
        process.exit(0);
    }
    let mentionEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setAuthor(`${message.client.user.username}`, client.user.avatarURL())
        .setDescription("✨Hello, my prefix is \`" + client.db.get('options').discord_options.prefix + "\`. Use \`" + client.db.get('options').discord_options.prefix + "help\`  for all of my commands!✨")
        .setColor(client.db.get('options').color)
        .setFooter(`${message.guild.name}` +  ` |  ${client.user.tag} `)
    if (message.mentions.users.has(message.client.user.id)) message.channel.send({content: `<@${message.author.id}>`, embeds: [mentionEmbed]})


    const errEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(client.db.get('options').color)
        .setFooter(`Glowstone Bot |  ${message.guild.name} `);

    if (!message.content.startsWith(client.db.get('options').discord_options.prefix) || message.author.bot) return

    const args = message.content.slice(client.db.get('options').discord_options.prefix.length).trim().split(/[ ]+/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName)|| client.commands.find(command => command.aliases.includes(commandName));
    
    if (!command) return

    if (!message.member.roles.cache.has(client.db.get('options').discord_options.developer_role)){

        if(command.dev && !message.member.roles.cache.has(client.db.get('options').discord_options.developer_role)){
            errEmbed.setDescription(`You do not have <@${client.db.get('options').discord_options.developer_role}> to execute this command!`);
            return message.channel.send({embeds:[errEmbed]});
        }

        if (command.whitelist && !Object.keys(client.db.get('options').players.whitelist).includes(message.member.id)){
            errEmbed.setDescription(`You do not have <@${client.db.get('options').discord_options.developer_role}> nor you're a whitelisted member to execute this command!`);
            return message.channel.send({embeds:[errEmbed]});
        }

        if (!message.member.permissions.has(command.requiredPerms)){
            errEmbed.setDescription(`You do not have the required permissions!\n**Permissions Required:** ${command.requiredPerms}`)
            return message.channel.send({embeds: [errEmbed]});
        }
    }

    if (!client.toggle){
        console.log(chalk.hex("#e12120")("[Glowstone] HWID not authenticated"))
        process.exit(0);
    }
    
    if(client.toggle) command.execute(client, Discord, message, args);

}