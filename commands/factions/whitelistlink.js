const chalk = require('chalk');
const uuid = require("uuid");

module.exports = {
    name : 'whitelistlink',
    description : 'Link your minecraft account to discord (whitelist)',
    usage: 'whitelistlink',
    aliases: ['w-link', 'wlink'],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');

        if (!client.temp_uuid) client.temp_uuid = {}
        
        const whitelistEmbed = new Discord.MessageEmbed()
        .setThumbnail(message.guild.iconURL())
        .setColor(options.color)
        .setFooter(`Glowstone Bot | Glowstone-Development`);

        if (message.guild.channels.cache.get(options.discord_options.whitelist_channel) === undefined){
            whitelistEmbed.setTitle('⁉️ Invalid Channel')
            .setDescription(`Please set a whitelist channel with \`${options.discord_options.prefix}set whitelist_channel\``);
            return message.channel.send({embeds:[whitelistEmbed]});

        }else if(message.channel.id !=options.discord_options.whitelist_channel){
            whitelistEmbed.setTitle('🚫 Access Denied')
            .setDescription(`You did not issue this command in <#${options.discord_options.whitelist_channel}>`);

            return message.channel.send({embeds:[whitelistEmbed]});
        }  

        let tempUUID = "wl"+uuid.v4().substring(8,36);
        for (let user in client.temp_uuid) {
            if (client.temp_uuid[user] == message.author){
                whitelistEmbed.setTitle('⁉️ Temporary Token Exists')
                .setDescription(`There is already a token generated for <@${message.author.id}>\n\nCheck this Bot's DM, or get a <@&${options.discord_options.developer_role}> to do 
                \`${options.discord_options.prefix}tokenclear @user\``);

                return message.channel.send({embeds:[whitelistEmbed]});
            }
        }
        client.temp_uuid[tempUUID] = message.author.id;
        
        whitelistEmbed.setTitle(`💬 Almost Whitelisted`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`Final step: In-order to link the account <@${message.author.id}> to your minecraft account, issue the command sent in your DM's.`);

        message.channel.send({embeds:[whitelistEmbed]});

        whitelistEmbed.setTitle(`💬 Almost Whitelisted`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`Final step: Please issue the following command in-game\`\`\`${options.discord_options.prefix}link ${tempUUID}\`\`\`\nNote: **Do not share** this command to anyone else as it will
        link their minecraft account to your discord in ${message.guild.name}`);

        message.author.send({embeds:[whitelistEmbed]});
    }
}