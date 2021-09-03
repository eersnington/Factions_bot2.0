const chalk = require('chalk');

module.exports = {
    name : 'marry',
    description : 'Marry a member',
    usage: 'marry <@user>',
    aliases: [],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
        .setColor(options.color);

        const member = message.mentions.members.first();

        if (!member) return message.reply('Mention a user! (or the user isn\'t in the guild)');
        if (member.id == message.author.id) return message.reply("You can't marry yourself :/")

        let role = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'married')
        if(!role) {
            try {
                let muterole = await message.guild.roles.create({name : 'Married', color: '#FF40EB' });
            } catch (error) {
                return console.log(error)
            }
        }

        role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'married')

        const filter1 = (m) => m.author.id === message.author.id;
        message.channel.send({content: `Do you promise to love, honor, cherish, and protect him/her, forsaking all others, and holding only onto him/her forevermore <@${message.author.id}>?\n\`Yes/No\``});
        const collector1 = message.channel.createMessageCollector({filter: filter1, max:1, time:60000});

        collector1.on('end', (collected, reason) => {
            if (reason == "limit"){

                const msg = collected.first()

                if (msg.content.toLowerCase() == 'yes'){

                    const filter2 = (m) => m.author.id === member.id;
                    message.channel.send(`And <@${member.id}>, do you take <@${message.author.id}> to be your husband/wife??\n\`Yes/No\``)
                    const collector2 = message.channel.createMessageCollector({filter: filter2, time:60000, max:1});

                    collector2.on('end', (collected, reason) => {
                        const msg = collected.first();
                        
                        if (reason == "limit"){

                            if (msg.content.toLowerCase() == 'yes'){
                                if (role) {
                                    message.member.roles.add(role)
                                    member.roles.add(role)
                                }
                                let embed  = new Discord.MessageEmbed()
                                embed.setColor(options.color)
                                .setTitle(`🎊 Marriage 👯‍♂️`)
                                .setDescription(`**Congratulations!!**\n<@${message.author.id}> and <@${member.id}>\n have married\n`)
                                .setImage("https://static.reuters.com/resources/r/?m=02&d=20190524&t=2&i=1390410346&r=LYNXNPEF4N0CH&w=640")
                                .setTimestamp()
                                .setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));
        
                                return message.channel.send({content: "**You may now kiss the bride**",embeds:[embed]})
                            }else{
                                return message.channel.send(`Yikes! That's rough buddy <@${message.author.id}>`)
                            }
                        }

                        if (reason == "time") return message.channel.send("F, your proposal got left on seen.")
                    });

                }else{
                    return message.channel.send("Sheesh, imagine proposing and rejecting it yourself, you attention seeking whore!")
                }
            }
            if (reason == "time") return
        });
    }
}