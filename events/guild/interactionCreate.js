module.exports = async (Discord, client, interaction) => {
    
    await interaction.deferUpdate();
    if (interaction.isButton()) {
        let user = interaction.user;

        if (interaction.customId === 'application-accept'){
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
                .setAuthor(client.config.branding.name, interaction.guild.iconURL({dynamic: true}))
                .setDescription(client.config.application_settings.accepted_response)
                .setTimestamp()
                .setFooter(client.config.branding.ip);

            interaction.message.delete()
            appsUser.user.send({embeds: [embedSuccess]})
            
            delete appsJson[appsUserID]
                    
            client.db.set('applications', appsJson)
            
        }else if (interaction.customId === 'application-deny'){

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
                .setAuthor(client.config.branding.name, interaction.guild.iconURL({dynamic: true}))
                .setDescription(client.config.application_settings.rejected_response)
                .setTimestamp()
                .setFooter(client.config.branding.ip);

            interaction.message.delete()
            appsUser.user.send({embeds: [embedSuccess]})
            
            delete appsJson[appsUserID]
                    
            client.db.set('applications', appsJson)
    
        }else {
            return
        }
    }

}