const {MessageButton,MessageActionRow} = require('discord.js');
let set_page_no = 0;

module.exports = {
    name: 'set',
    description: 'Set bot and channel settings',
    usage: 'set',
    aliases: [],
    whitelist: false,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        set_page_no = 0;
        
        let prefix = options.discord_options.prefix;
        let minecraft_options = options.minecraft_options;
        let discord_options = options.discord_options;

        const errEmbed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setThumbnail(message.guild.iconURL())
            .setColor(options.color)
            .setFooter('Glowstone Bot | Glowstone-Development');

        if (args[0] != null){
            
            const successEmbed = new Discord.MessageEmbed()
                .setTitle(`✅ Option set`)
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
                .setFooter('Glowstone Bot | Glowstone-Development');

            if (Object.keys(minecraft_options).includes(args[0])){
                if (args[1] == null){
                    errEmbed.setTitle(`⁉️ Invalid Argument`)
                    .setDescription(`Option \`${args[0]}\` **requires an ip address, version no. or a join_command.**\n If you're unsure, please do \`${options.discord_options.prefix}set\` for an example.`)
                    return message.channel.send({embeds:[errEmbed]})
                }
            
                let opt = args[0];
                let value
                if (opt == 'join_command'){
                    args.shift()
                    value = args.join(" ")
                }else{
                    value = args[1];
                }
                options.minecraft_options[opt] = value
                client.db.set('options', options)
                successEmbed.setDescription(`You have successfully set **${opt}** in Minecraft Options`);

                setTimeout(()=> client.user.setActivity(
                    `${options.minecraft_options.ip} Server Chat | For Help Do ${options.discord_options.prefix}help`, {
                        type: "WATCHING"
                    }),1000 )
                    
                return message.channel.send({embeds: [successEmbed]});
                
            }else if (Object.keys(discord_options).includes(args[0])){
                if (args[1] == null){
                    errEmbed.setTitle(`⁉️ Invalid Argument`)
                    .setDescription(`Option \`${args[0]}\` **requires a role, channel or prefix.**\n If you're unsure, please do \`${options.discord_options.prefix}set\` for an example.`)
  
                    return message.channel.send({embeds: [errEmbed]})
                }
            
                let opt = args[0];
                let value;
                if (opt != 'prefix'){
                    value = (args[1].match(/(\d+)/))[0];
                }else{
                    value = args[1];
                    if (options.minecraft_options.bot !=null){
                        options.minecraft_options.bot.removeChatPattern("facChat1")
                        let chatRegex = new RegExp(`^(\\*|\\*\\*|\\*\\*\\*|\\+|\\+\\+|\\-|\\-\\-|@)(\\w+): \\${value}(\\w+)(.*)`);
                        let mapleCraftRegex = new RegExp(`^FACTION: (\\*|\\*\\*|\\*\\*\\*|\\+|\\+\\+|\\-|\\-\\-)(\\w+): \\${value}(\\w+)(.*)`);
                        options.minecraft_options.bot.addChatPattern("facChat1", chatRegex , { parse: true});
                        options.minecraft_options.bot.addChatPattern("facChat1", mapleCraftRegex , { parse: true});
                    }
                }

                options.discord_options[opt] = value
                client.db.set('options', options)
                successEmbed.setDescription(`You have successfully set **${opt}** in Discord Options`)

                setTimeout(()=> client.user.setActivity(
                    `${options.minecraft_options.ip} Servers Chat | For Help Do  ${options.discord_options.prefix}help `, {
                        type: "WATCHING"
                    }),1000 )
                
                return message.channel.send({embeds:[successEmbed]});
                
            }else {
                errEmbed.setTitle(`⁉️ Invalid Option`)
                .setThumbnail(message.guild.iconURL())
                .setDescription(`${args[0]} is an Invalid Option. \nPlease make sure the option is listed in \`${options.discord_options.prefix}set\` pages`)
                .setColor(options.color)
                .setFooter('Glowstone Bot | Glowstone-Development');
                return message.channel.send({embeds: [errEmbed]})
            }
        }else {
            const setup1 = new Discord.MessageEmbed()
            .setTitle(`⚙️ Setup`)
            .setDescription('**Note:** Please make sure to set every option in order to take full advantage of this bot.')
            .addFields(
                { name: 'Syntax:', value: `\`\`\`${prefix}set <option> <argument>\`\`\`` },
                { name: 'Example:', value: `\`\`\`${prefix}set version 1.8.9\`\`\`\n\`\`\`${prefix}set developer_role @dev\`\`\`\n\`\`\`${prefix}set ftop_channel #ftop\`\`\`` }
            )
            .setColor(options.color)
            .setThumbnail(message.guild.iconURL());

            const setup2 = new Discord.MessageEmbed()
            .setTitle(`⚙️ Minecraft Setup`)
            .setDescription('**Note:** Please make sure to set every option in order to take full advantage of this bot.')
            .setColor(options.color)
            .setThumbnail(message.guild.iconURL());


            setup2.addFields(
                { name: 'ip ', value:  `\`\`${minecraft_options["ip"]}\`\``},
                { name: 'version ', value:  `\`\`${minecraft_options["version"]}\`\` *note: recommended -> 1.8.x*`},
                { name: 'join_command ', value:  `\`\`${minecraft_options["join_command"]}\`\``}
            )

            const setup3 = new Discord.MessageEmbed()
            .setTitle(`⚙️ Discord Setup`)
            .setDescription('**Note:** Please make sure to set every option in order to take full advantage of this bot.')
            .setColor(options.color)
            .setThumbnail(message.guild.iconURL());

            setup3.addField('prefix ',`\`\`${discord_options["prefix"]}\`\``);
            delete discord_options["prefix"];
                    
            setup3.addField('interval ',  `\`\` ${discord_options["interval"]} \`\` *note: this is the interval for in-game check alerts, ftop, fptop, and flist in minutes*`);
            delete discord_options["interval"];

            if (/\d/.test(discord_options["developer_role"])){
                setup3.addField('developer_role ',  `<@&${discord_options["developer_role"]}> *note: gives access to all discord bot commands*`);
                delete discord_options["developer_role"];
            } else {
                setup3.addField('developer_role ',  `\`\`${discord_options["developer_role"]}\`\` *note: gives access to discord bot commands*`);
                delete discord_options["developer_role"];
            }

            for (let option in discord_options){
                
                if (/\d/.test(discord_options[option])){
                    setup3.addField(`${option}`, `<#${discord_options[option]}>`)
                }else{
                    setup3.addField(`${option}`, `\`Channel not set\``)
                }
            }

            let pages = {1: setup1, 2: setup2, 3:setup3};
            setup1.setFooter(`Page 1/${Object.keys(pages).length} | ${message.guild.name}`);
            setup2.setFooter(`Page 2/${Object.keys(pages).length} | ${message.guild.name}`);
            setup3.setFooter(`Page 3/${Object.keys(pages).length} | ${message.guild.name}`);

            const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setCustomId('button-left')
                        .setLabel('⬅️')
                        .setStyle('PRIMARY'),
                    ).addComponents(
                        new MessageButton()
                        .setCustomId('button-right')
                        .setLabel('➡️')
                        .setStyle('PRIMARY'),
                    );

            message.channel.send({embeds: [setup1], components: [row]}).then(async embed => {
    
                const buttonFilter = (interaction) => interaction.user.id == message.author.id;

                const collector = message.channel.createMessageComponentCollector({buttonFilter, max:6});

                collector.on("collect", (interaction)=>{

                    if (interaction.customId === 'button-right' && interaction.message.id == embed.id){

                        if (set_page_no < Object.keys(pages).length -1){
                            set_page_no++;
                            embed.edit({embeds: [pages[set_page_no+1]]});
                        }

                    }
                    if (interaction.customId === 'button-left' && interaction.message.id == embed.id){

                        if (set_page_no > 0){
                            set_page_no--;
                            embed.edit({embeds: [pages[set_page_no+1]]});
                        }
                    }
                });
        
            });

        }
    }
}