module.exports = {
    name: 'database',
    description: 'Manage the database',
    usage: 'database',
    aliases: ['db'],
    whitelist: false,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){
        let options = client.db.get('options');

        const errEmbed = new Discord.MessageEmbed()
            .setTitle(`💾  Reset error`)
            .setThumbnail(message.guild.iconURL())
            .setColor(options.color)
            .setTimestamp()
            .setFooter(`Glowstone Bot | Glowstone-Development`);

        const dbEmbed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setThumbnail(message.guild.iconURL())
            .setColor(options.color)
            .setTimestamp()
            .setFooter(`Glowstone Bot | Glowstone-Development`);

            let available_options = {"checks": "checks", "deposits": "banks", "macros": "macros", "members": "members", "playtime": "playtime", "whitelist": "whitelist", "new_map":"new_map"}

        if (args[0] == 'wipe'){

            client.db.set('options',{
                color: client.config.embed_color,
                //mineflayer variables
                online: false,
                config: {mc_username: client.config.username, mc_password: client.config.password,  auth: client.config.auth}, 
                minecraft_options:{bot: null, version: '1.8.9', ip: "pvp.thearchon.net", join_command: "/onyx"},
                //discord bot variables
                discord_options: {prefix: '*', developer_role: client.config.developer_role_id, server_chat_channel: null, weewoo_channel: null, buffer_channel: null,
                ftop_channel: null, fptop_channel: null, flist_channel: null, alerts_channel: null, whitelist_channel: null, logs_channel: null, interval: 5},
                //members
                players: {
                    whitelist: {}, faction: {}},
                //bank data
                bank: {total_deposits: 0, members: {}},
                //checks data
                checks: {buffer_check_count: 0, buffer_interval: null, members:{}},
                //chat data
                server_chat: {toggle: true},
                ftop: {toggle: false},
                fptop: {toggle: false},
                flist: {toggle: false},
                cegg_alert: false,
                tnt_alert: false,
                logs: false,
                macros: {},
                playtime:{},
                vanish: {track: false, count: 0}
                })

            dbEmbed.setTitle('💾 Data wiped')
            .setDescription(`✅ A fresh database was generated for this discord server!\n Note: The prefix is now ${client.db.get(options).discord_options.prefix}`);

            return message.channel.send({embeds: [dbEmbed]})

        } else if (args[0] == 'reset'){
            let parameter = args[1]

            if (!Object.keys(available_options).includes(parameter)){
                
                errEmbed.setDescription(`⚠️ The option \`${parameter}\` is invalid`)
                return message.channel.send({embeds: [errEmbed]});
            }

            let newJson = client.db.get('options');

            if(parameter == "checks"){

                newJson.checks.members = {}
            }else if (parameter == "deposits"){

                newJson.bank.members = {}
            }else if (parameter == "macros"){

                newJson.macros = {}
                newJson.macros["Macros1"] = {"content": "/ff DON'T SLACK CANE", "interval" : "1"}
            }else if (parameter == "playtime"){

                newJson.playtime= {}
            }
            
            else if (parameter == "members"){

                newJson.players.faction = {}
            }else if (parameter == "whitelist"){

                newJson.players.whitelist = {}
            }else if (parameter == "new_map"){
                
                newJson.checks.members = {}
                newJson.bank.members = {}
                newJson.playtime = {}
            }

            client.db.set('options', newJson)

            dbEmbed.setTitle(`💾  Reset successful`)
            .setDescription(`✅ You have successfully reset the option \`${parameter}\``);

            return message.channel.send({embeds:[dbEmbed]});
        }else{
            dbEmbed.setTitle('💾 Database')
            .setDescription(`**Database commands**`)
            .addFields(
                {name: `wipe`, value: `Wipes your entire database\n **⚠️ This will wipe out your entire data if you have already edited the settings in** \`${options.discord_options.prefix}set\`
                                     \`\`\`${options.discord_options.prefix}db wipe\`\`\``},
                {name: `reset`, value: `Reset specific data like checks, deposits, or playtime for a new map\n
                Available options: \`${Object.keys(available_options).join(", ")}\`
                \`\`\`${options.discord_options.prefix}db reset <option>\`\`\``},
            );


            return message.channel.send({embeds: [dbEmbed]})
        }
            
        
    }
}