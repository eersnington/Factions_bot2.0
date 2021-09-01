const chalk = require('chalk');
const Discord = require('discord.js');

let ftop_interval;
let fptop_interval;
let flist_interval;

module.exports = {
    name : 'toggle',
    description : 'Toggle various events (e.g. ftop, fptop, flist)',
    usage: 'toggle',
    aliases: [],
    whitelist: true,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        if (client.bot == null){
            embed.setTitle(`⚠️ Warning`)
            .setDescription(`There is no bot online in the server \`${options.minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\``)
            .setFooter('Glowstone Bot | Glowstone-Development');
            return message.channel.send({embeds: [embed]});
        }

        if (args[0] == "chat"){
                
            chat_toggle(client, message)
        }else if (args[0] == "ftop"){
            
            ftop_toggle(client, message)
        }else if (args[0] == "fptop"){
            
            fptop_toggle(client, message)
        }else if (args[0] == "flist"){
            
            flist_toggle(client, message)
        }else if (args[0] == "cegg"){
            
            cegg_toggle(client, message)
        }else if (args[0] == "tnt"){
            
            tnt_toggle(client, message)
        }else {
            embed.setTitle(`🔄 Toggle Events`)
            .setDescription('Here are the events you can toggle')
            .addFields(
                { name: 'server chat', value: `Usage: \`${options.discord_options.prefix}toggle chat\`\nDescription: *Toggle server chat*` },
                { name: 'ftop', value: `Usage: \`${options.discord_options.prefix}toggle ftop\`\nDescription: *Toggle sending ftop info in an interval*` },
                { name: 'fptop', value: `Usage: \`${options.discord_options.prefix}toggle fptop\`\nDescription: *Toggle sending fptop info in an interval*` },
                { name: 'flist', value: `Usage: \`${options.discord_options.prefix}toggle flist\`\nDescription: *Toggle sending flist info in an interval*` },
                { name: 'cegg', value: `Usage: \`${options.discord_options.prefix}toggle cegg\`\nDescription: *Toggle checking for cegg*` },
                { name: 'tnt', value: `Usage: \`${options.discord_options.prefix}toggle tnt\`\nDescription: *Toggle checking for tnt shots*` },
            )
            .setThumbnail(message.guild.iconURL())
            .setFooter(`Glowstone Bot | ${message.guild.name}`);
            return message.channel.send({embeds: [embed]});
        }
        
    }
}

function chat_toggle(client, message){

    let newOptions = client.db.get('options');

    let server_chat = client.channels.cache.get(newOptions.discord_options.server_chat_channel);
    const chatEmbed = new Discord.MessageEmbed()
    .setColor(newOptions.color);

    if (!server_chat){
        chatEmbed.setTitle('⁉️ Invalid Channel')
        .setDescription(`Please set a server-chat channel with \`${newOptions.discord_options.prefix}set server_chat_channel\``)
        .setFooter(`Glowstone Bot | Glowstone-Development`);
        return message.channel.send({embeds:[chatEmbed]});
    }

    newOptions.server_chat.toggle = !newOptions.server_chat.toggle;
    client.db.set('options', newOptions);
    
    let toggle_msg  = (newOptions.server_chat.toggle) ? chatEmbed.setDescription("**Server chat enabled**") : chatEmbed.setDescription("**Server chat disabled**")
    chatEmbed.setTitle(`✅ Toggle Events`)
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setThumbnail(message.guild.iconURL())
    .setFooter(`Glowstone Bot | ${message.guild.name}`);

    return message.channel.send({embeds:[chatEmbed]}); 
}

function ftop_toggle(client, message){

    let newOptions = client.db.get('options');
    let ftop_chat = client.channels.cache.get(client.db.get('options').discord_options.ftop_channel);

    const ftopEmbed = new Discord.MessageEmbed()
    .setColor(newOptions.color);

    if (!ftop_chat){
        ftopEmbed.setTitle('⁉️ Invalid Channel')
        .setDescription(`Please set an ftop channel with \`${newOptions.discord_options.prefix}set ftop_channel\``)
        .setThumbnail(message.guild.iconURL())
        .setFooter(`Glowstone Bot | Glowstone-Development`);
        return message.channel.send({embed: [ftopEmbed]});
    }

    newOptions.ftop.toggle = !newOptions.ftop.toggle
    client.db.set('options', newOptions)

    let toggle_msg  = (newOptions.ftop.toggle) ? ftopEmbed.setDescription("**Regular F-top updates enabled**") : ftopEmbed.setDescription("**Regular F-top updates disabled**")
    ftopEmbed.setTitle(`✅ Toggle Events`)
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setColor(newOptions.color)
    .setThumbnail(message.guild.iconURL())
    .setFooter(`Glowstone Bot | ${message.guild.name}`);
    message.channel.send({embeds: [ftopEmbed]});

    if (newOptions.ftop.toggle){
        ftop_interval = setInterval(() => {
            let ftop_chat = client.channels.cache.get(client.db.get('options').discord_options.ftop_channel);

            if(!client.bot) {
                const error = new Discord.MessageEmbed()
                .setColor(client.db.get('options').color)
                .setTitle(":warning: Bot Error")
                .setDescription(`F-top updates cancelled \n**Factions Bot is offline**`);
                return ftop_chat.send({embeds: [error]}); 
            }

            const embed = new Discord.MessageEmbed().setColor(client.db.get('options').color);

            client.data.ftop = []
            client.bot.chat(`/f top`)
            setTimeout(()=> {
                let ftop_data = client.data.ftop
                let reply = (ftop_data.length >2) ? embed.setDescription(`\`\`\`fix\n${ftop_data.join('\n')}\`\`\``) : embed.setDescription(`There was an error in trying to retrieve the data.`)
                client.data.ftop = []
                
                embed.setTitle(`🏆 F-top Value \`\`${client.db.get('options').minecraft_options.ip}\`\``)
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
                ftop_chat.send({embeds:[embed]});
            }, 500)
        }, parseInt(client.db.get('options').discord_options.interval)*60000)
    } else {
        clearInterval(ftop_interval)
    }

}

function fptop_toggle(client, message){

    let newOptions = client.db.get('options');
    let fptop_chat = client.channels.cache.get(client.db.get('options').discord_options.fptop_channel);

    const fptopEmbed = new Discord.MessageEmbed();

    if (!fptop_chat){
        fptopEmbed.setTitle('⁉️ Invalid Channel')
        .setDescription(`Please set an fptop channel with \`${newOptions.discord_options.prefix}set fptop_channel\``)
        .setThumbnail(message.guild.iconURL())
        .setColor(client.db.get('options').color)
        .setFooter(`Glowstone Bot | Glowstone-Development`);
        return message.channel.send({embeds: [fptopEmbed]});
    }

    newOptions.fptop.toggle = !newOptions.fptop.toggle
    client.db.set('options', newOptions)

    let toggle_msg  = (newOptions.fptop.toggle) ? fptopEmbed.setDescription("**Regular F-ptop updates enabled**") : fptopEmbed.setDescription("**Regular F-ptop updates disabled**")
    fptopEmbed.setTitle(`✅ Toggle Events`)
    .setColor(newOptions.color)
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setThumbnail(message.guild.iconURL())
    .setFooter(`Glowstone Bot | ${message.guild.name}`);
    message.channel.send({embeds: [fptopEmbed]}); 

    if (newOptions.fptop.toggle){
        fptop_interval = setInterval(() => {
            let fptop_chat = client.channels.cache.get(client.db.get('options').discord_options.fptop_channel);

            if(!client.bot) {
                const error = new Discord.MessageEmbed()
                .setColor(client.db.get('options').color)
                .setTitle(":warning: Bot Error")
                .setDescription(`F-ptop updates cancelled \n**Factions Bot is offline**`);
                return fptop_chat.send({embeds: [error]}); 
            }

            const embed = new Discord.MessageEmbed().setColor(client.db.get('options').color);

            client.data.fptop = []
            client.bot.chat(`/f ptop`)
            setTimeout(()=> {
                let fptop_data = client.data.fptop
                let reply = (fptop_data.length >2) ? embed.setDescription(`\`\`\`fix\n${fptop_data.join('\n')}\`\`\``) : embed.setDescription(`There was an error in trying to retrieve the data.`)
                client.data.fptop = []

                embed.setTitle(`🏆 F-ptop Value \`\`${client.db.get('options').minecraft_options.ip}\`\``)
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
                fptop_chat.send({embeds: [embed]});
            }, 500)
        }, parseInt(client.db.get('options').discord_options.interval)*60000)
    } else {
        clearInterval(fptop_interval)
    }
}

function flist_toggle(client, message){

    let newOptions = client.db.get('options');
    let flist_chat = client.channels.cache.get(client.db.get('options').discord_options.flist_channel);

    const flistEmbed = new Discord.MessageEmbed();

    if (!flist_chat){
        flistEmbed.setTitle('⁉️ Invalid Channel')
        .setDescription(`Please set an flist channel with \`${newOptions.discord_options.prefix}set flist_channel\``)
        .setThumbnail(message.guild.iconURL())
        .setColor(client.db.get('options').color)
        .setFooter(`Glowstone Bot | Glowstone-Development`);
        return message.channel.send({embeds: [flistEmbed]});
    }

    newOptions.flist.toggle =  !newOptions.flist.toggle
    client.db.set('options', newOptions);

    let toggle_msg  = (newOptions.flist.toggle) ? flistEmbed.setDescription("**Regular F-list updates enabled**") : flistEmbed.setDescription("**Regular F-list updates disabled**")
    flistEmbed.setTitle(`✅ Toggle Events`)
    .setColor(newOptions.color)
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setThumbnail(message.guild.iconURL())
    .setFooter(`Glowstone Bot | ${message.guild.name}`);
    message.channel.send({embeds: [flistEmbed]}); 

    if (newOptions.flist.toggle){
        flist_interval = setInterval(() => {
            let flist_chat = client.channels.cache.get(client.db.get('options').discord_options.flist_channel);

            if(!client.bot) {
                const error = new Discord.MessageEmbed()
                .setColor(client.db.get('options').color)
                .setTitle(":warning: Bot Error")
                .setDescription(`F-list updates cancelled \n**Factions Bot is offline**`);
                return flist_chat.send({embeds: [error]}); 
            }

            const embed = new Discord.MessageEmbed().setColor(client.db.get('options').color);

            client.data.flist = []
            client.bot.chat(`/f list`)

            setTimeout(()=> {
                let flist_data = client.data.flist
                let reply = (flist_data.length >2) ? embed.setDescription(`\`\`\`yaml\n${flist_data.join('\n')}\`\`\``) : embed.setDescription(`There was an error in trying to retrieve the data.`)
                client.data.flist = []

                embed.setTitle(`👥 F-List \`\`${client.db.get('options').minecraft_options.ip}\`\``)
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
                flist_chat.send({embeds:[embed]});
            }, 500)
        }, parseInt(client.db.get('options').discord_options.interval)*60000)
    } else {
        clearInterval(flist_interval)
    }
}

function cegg_toggle(client, message){

    let newOptions = client.db.get('options');

    let alerts_chat = client.channels.cache.get(client.db.get('options').discord_options.alerts_channel);
    const ceggEmbed = new Discord.MessageEmbed();

    if (!alerts_chat){
        ceggEmbed.setTitle('⁉️ Invalid Channel')
        .setDescription(`Please set an alerts channel with \`${newOptions.discord_options.prefix}set alerts_channel\``)
        .setThumbnail(message.guild.iconURL())
        .setColor(newOptions.color)
        .setFooter(`Glowstone Bot | Glowstone-Development`);
        return message.channel.send({embeds: [ceggEmbed]});
    }

    newOptions.cegg_alert =  !newOptions.cegg_alert;
    client.db.set('options', newOptions);

    let toggle_msg  = (newOptions.cegg_alert) ? ceggEmbed.setDescription("**Cegg alert enabled**") : ceggEmbed.setDescription("**Cegg alert disabled**")
    ceggEmbed.setTitle(`✅ Toggle Events`)
    .setColor(newOptions.color)
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setThumbnail(message.guild.iconURL())
    .setFooter(`Glowstone Bot | ${message.guild.name}`);
    message.channel.send({embeds: [ceggEmbed]}); 

}

function tnt_toggle(client, message, options){

    let newOptions = client.db.get('options');

    let alerts_chat = client.channels.cache.get(client.db.get('options').discord_options.alerts_channel);
    const tntEmbed = new Discord.MessageEmbed();

    if (!alerts_chat){
        tntEmbed.setTitle('⁉️ Invalid Channel')
        .setDescription(`Please set an alerts channel with \`${newOptions.discord_options.prefix}set alerts_channel\``)
        .setThumbnail(message.guild.iconURL())
        .setColor(newOptions.color)
        .setFooter(`Glowstone Bot | Glowstone-Development`);
        return message.channel.send({embeds: [tntEmbed]});
    }

    newOptions.tnt_alert =  !newOptions.tnt_alert;
    client.db.set('options', newOptions);

    let toggle_msg  = (newOptions.tnt_alert) ? tntEmbed.setDescription("**Tnt alert enabled**") : tntEmbed.setDescription("**Tnt alert disabled**")
    tntEmbed.setTitle(`✅ Toggle Events`)
    .setColor(newOptions.color)
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setThumbnail(message.guild.iconURL())
    .setFooter(`Glowstone Bot | ${message.guild.name}`);
    message.channel.send({embeds: [tntEmbed]}); 
}