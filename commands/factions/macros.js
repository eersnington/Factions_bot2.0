const chalk = require('chalk');
const {MessageButton,MessageActionRow} = require('discord.js');

let disc_page_no = 0
let active_macros = {}

module.exports = {
    name : 'macros',
    description : 'Setup, add, remove macros',
    usage: 'macros',
    aliases: [],
    whitelist: true,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        disc_page_no = 0

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        const errEmbed = new Discord.MessageEmbed();

        if (args[0] == null){

            const macrosEmbed1 = new Discord.MessageEmbed();
            macrosEmbed1.setTitle("⏱️💬 Macros")
            .setDescription(`You can add a custom macros that will make the minecraft bot send a message in an interval (in minutes)\n\n
            **Syntax: **\`\`\`${options.discord_options.prefix}macros add <name>, <chat>, <interval>\`\`\`
            \`\`\`${options.discord_options.prefix}macros remove <name>\`\`\`
            **Example: **\`\`\`${options.discord_options.prefix}macros add Cane1, No cane no gain, 30\`\`\`
            \`\`\`${options.discord_options.prefix}macros add Macros1, /ff DON'T SLACK CANE, 1\`\`\`
            \`\`\`${options.discord_options.prefix}macros remove Cane1\`\`\``)
            macrosEmbed1.addField('\u200B', '*Note: The parameters in angular brackets <> are required*')
            .setColor(options.color)
            .setThumbnail(message.guild.iconURL())
            .setFooter(`Glowstone Bot | Glowstone Development`);

            const macrosEmbed2 = new Discord.MessageEmbed();
            macrosEmbed2.setTitle("⏱️💬 Macros")
            .setDescription(`List of active macros`)
            .setColor(options.color)
            .setThumbnail(message.guild.iconURL())
            .setFooter(`Glowstone Bot | Glowstone Development`);

            let macros_json = options.macros
            let macros_id = Object.keys(macros_json);

            macros_id.forEach( (macros) => {
                macrosEmbed2.addField(`🔸 ${macros}`, `**Text: ** \`${macros_json[macros].content}\`\n**Time-period: ** \`${macros_json[macros].interval} mins\``)
            });
            if (macros_id.length == 0) macrosEmbed2.addField(`No Macros`, `Set a macro now (check page 1 for the command)`)
            macrosEmbed2.addField('\u200B', '*Note: The time period is in minutes*')

            let pages = {1: macrosEmbed1, 2:macrosEmbed2};

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

            return message.channel.send({embeds: [macrosEmbed1], components: [row]}).then(async embed => {
                const buttonFilter = (interaction) => interaction.user.id == message.author.id;

                const collector = message.channel.createMessageComponentCollector({buttonFilter, max:6});

                collector.on("collect", (interaction)=>{


                    if (interaction.customId === 'button-right' && interaction.message.id == embed.id){

                        if (disc_page_no < Object.keys(pages).length -1){
                            disc_page_no++;
                            embed.edit({embeds: [pages[disc_page_no+1]]});
                        }

                    }
                    if (interaction.customId === 'button-left' && interaction.message.id == embed.id){

                        if (disc_page_no > 0){
                            disc_page_no--;
                            embed.edit({embeds: [pages[disc_page_no+1]]});
                        }
                    }
                });
            });;

        }else if(args[0] == "add"){
            args.shift();
            const parameters =  args.join(" ").split(",");

            if (parameters.length != 3){
                errEmbed.setTitle('⁉️ Parameters missing')
                .setDescription(`You have to specify all the parameters in angular brackets <> mentioned in \`${options.discord_options.prefix}macros\``)
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
                .setFooter(`Glowstone Bot | Glowstone-Development`);
                return message.channel.send({embeds: [errEmbed]});
            }else{
                const macro_name = parameters[0];
                const macro_content = parameters[1].substring(1);
                const macro_interval = parseInt(parameters[2].substring(1));
                
                if (isNaN(macro_interval)){
                    errEmbed.setTitle('⁉️ Invalid parameter')
                    .setDescription(`The interval should be a number. Please check the syntax for the command in \`${options.discord_options.prefix}macros\``)
                    .setThumbnail(message.guild.iconURL())
                    .setColor(options.color)
                    .setFooter(`Glowstone Bot | Glowstone-Development`);
                    return message.channel.send({embeds: [errEmbed]});
                }

                let macros_json = options
                macros_json.macros[macro_name] = {"content": macro_content, "interval": macro_interval};
                client.db.set('options', macros_json)

                const macrosEmbed = new Discord.MessageEmbed()
                    .setTitle("⏱️💬 Macros")
                    .setDescription(`✅ Added **${macro_name}** to the macros list\nToggle the macros with \`${options.discord_options.prefix}macros toggle ${macro_name}\``)
                    .setColor(options.color)
                    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setThumbnail(message.guild.iconURL())
                    .setFooter(`Glowstone Bot | Glowstone Development`);
                    return message.channel.send({embeds: [macrosEmbed]});

            }
        }else if (args[0] == "remove"){
            const macro_name = args[1];

            let macros_json = options
            const clearEmbed = new Discord.MessageEmbed();

            let macroCleared = []

            Object.keys(macros_json.macros).forEach(macro => {
                if (macro == macro_name){
                    macroCleared.push(macro_name)
                    delete macros_json.macros[macro]
                }
            });

            if (macroCleared.length >= 1){
                client.db.set('options', macros_json)
            }else {
                clearEmbed.setTitle(`⏱️💬  Invalid macro`)
                .setThumbnail(message.guild.iconURL())
                .setDescription(`⁉️ There is no macro with the name \`${macro_name}\``)
                .setColor(options.color)
                .setFooter('Glowstone Bot | Glowstone-Development');
                return message.channel.send({embeds: [clearEmbed]});
            }

            clearEmbed.setTitle(`⏱️💬  Macro cleared`)
            .setThumbnail(message.guild.iconURL())
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`✅ You have successfully cleared the macro \`${macroCleared}\``)
            .setColor(options.color)
            .setFooter('Glowstone Bot | Glowstone-Development');
            return message.channel.send({embeds: [clearEmbed]});


        }else if (args[0] == "toggle"){
            const macro_name = args[1];
            if (!Object.keys(options.macros).includes(macro_name)){
                
                errEmbed.setTitle('⁉️ Nonexistant Macro')
                    .setDescription(`The macro with the name ${macro_name} doesn't exist.\nPlease check the list of macros \`${options.discord_options.prefix}macros\` (page 2)`)
                    .setThumbnail(message.guild.iconURL())
                    .setColor(options.color)
                    .setFooter(`Glowstone Bot | Glowstone-Development`);
                return message.channel.send({embeds: [errEmbed]});
            }

            const macrosEmbed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setColor(options.color)
            .setThumbnail(message.guild.iconURL())
            .setFooter(`Glowstone Bot | Glowstone Development`);

            if (Object.keys(active_macros).includes(macro_name)){
                clearInterval(active_macros[macro_name])
                delete active_macros[macro_name]

                macrosEmbed.setTitle("⏱️💬 Macros")
                .setDescription(`Toggled macro **${macro_name}** 🟥`);
                return message.channel.send({embeds: [macrosEmbed]});
            }else{
                const macrosEmbed = new Discord.MessageEmbed();
                macrosEmbed.setTitle("⏱️💬 Macros")
                .setDescription(`Toggled macro **${macro_name}** 🟩`);

                active_macros[macro_name] = setInterval(()=> {

                    if (client.bot != null){

                        client.bot.chat(options.macros[macro_name].content)
            
                    } else {
                        embed.setTitle(`⚠️ Warning`)
                        .setDescription(`There is no bot online in the server \`${client.db.get('options').minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\``)
                        .setFooter('Glowstone Bot | Glowstone-Development');

                        let channel = client.channels.cache.get(client.db.get('options').discord_options.alerts_channel)

                        errEmbed.setTitle(`⚠️ Warning`)
                        .setDescription(`Macro \`${macro_name}\` cancelled due to the bot is offline.\nTo join the server, simply issue the command \`${client.db.get('options').discord_options.prefix}join\``)
                        .setColor(options.color)
                        .setFooter('Glowstone Bot | Glowstone-Development');
                        if (!channel) return console.log(chalk.red.bold(`[Glowstone] Please set an alerts_channel! The macro ${macro_name} got cancelled due to the bot being offline`));
                        return channel.send({embeds:[errEmbed]});

                    }

                },client.db.get('options').macros[macro_name].interval*60000);

                return message.channel.send({embeds: [macrosEmbed]});
            }
        }

    }
}