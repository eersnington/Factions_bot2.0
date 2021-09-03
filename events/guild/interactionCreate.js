module.exports = async (Discord, client, interaction) => {
    
    await interaction.deferUpdate();
    if (interaction.isButton()) {
        let user = interaction.user;

        if (interaction.customId === 'application-accept'){

            const errEmbed = new Discord.MessageEmbed()
            .setTimestamp()
            .setAuthor(`${user.tag}`, user.displayAvatarURL())
            .setColor(client.db.get('options').color)
            .setFooter(`Glowstone Bot |  ${interaction.guild.name} `);

            if (!interaction.member.roles.cache.has(client.db.get('options').discord_options.developer_role)){
        
                if (!Object.keys(client.db.get('options').players.whitelist).includes(user.id)){
                    errEmbed.setDescription(`You do not have <@${client.db.get('options').discord_options.developer_role}> nor you're a whitelisted member to execute this command!`);
                    return interaction.channel.send({embeds:[errEmbed]});
                }
            }

            const appsJson =  client.db.get('applications')

            let appsUserID = Object.keys(appsJson).find(key => appsJson[key] === interaction.message.id);
            let appsUser = await interaction.guild.members.fetch(appsUserID);

            if (!appsUser){
                delete appsJson[appsUserID]
                client.db.set('applications', appsJson)
                interaction.message.delete()
                return interaction.reply(`User is not in the Discord server! \`User ID: ${appsUserID}\``)
            } 
            
            const embedSuccess = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(interaction.guild.name, interaction.guild.iconURL({dynamic: true}))
            .setDescription(client.config.application_settings.accepted_response)
            .setTimestamp()
            .setFooter(`Glowstone Bot |  ${interaction.guild.name} `);

            interaction.message.delete()
            appsUser.send({embeds: [embedSuccess]}).catch(()=> {message.reply("User has disabled his DMs")});
            
            delete appsJson[appsUserID]
                    
            client.db.set('applications', appsJson)
            
        }else if (interaction.customId === 'application-deny'){

            const errEmbed = new Discord.MessageEmbed()
            .setTimestamp()
            .setAuthor(`${user.tag}`, user.displayAvatarURL())
            .setColor(client.db.get('options').color)
            .setFooter(`Glowstone Bot |  ${interaction.guild.name} `);

            if (!interaction.member.roles.cache.has(client.db.get('options').discord_options.developer_role)){
        
                if (!Object.keys(client.db.get('options').players.whitelist).includes(user.id)){
                    errEmbed.setDescription(`You do not have <@${client.db.get('options').discord_options.developer_role}> nor you're a whitelisted member to execute this command!`);
                    return interaction.channel.send({embeds:[errEmbed]});
                }
            }

            const appsJson =  client.db.get('applications')
            let appsUserID = Object.keys(appsJson).find(key => appsJson[key] === interaction.message.id);
            let appsUser = await interaction.guild.members.fetch(appsUserID);

            if (!appsUser){
                delete appsJson[appsUserID]
                client.db.set('applications', appsJson)
                interaction.message.delete()
                return interaction.reply(`User is not in the Discord server! \`User ID: ${appsUserID}\``)
            } 
            
            const embedSuccess = new Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor(interaction.guild.name, interaction.guild.iconURL({dynamic: true}))
            .setDescription(client.config.application_settings.rejected_response)
            .setTimestamp()
            .setFooter(`Glowstone Bot |  ${interaction.guild.name} `);

            interaction.message.delete()
            appsUser.send({embeds: [embedSuccess]}).catch(()=> {message.reply("User has disabled his DMs")});
            
            delete appsJson[appsUserID]
                    
            client.db.set('applications', appsJson)
    
        }else {
            return
        }
    }

}