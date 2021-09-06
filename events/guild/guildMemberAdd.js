const canvacord = require("canvacord");

module.exports = async (Discord, client, member) => {
    
    let channel = client.channels.cache.get(client.db.get('options').discord_options.welcome_channel);
    const join_role = member.guild.roles.cache.find(r => r.id == client.db.get('options').discord_options.join_role);

    if (join_role) member.roles.add(join_role)
    if (!channel) return;


    const card = new canvacord.Welcomer()
    .setUsername(member.user.username)
    .setDiscriminator(member.user.discriminator)
    .setAvatar(member.user.displayAvatarURL({format:"png"}))
    .setMemberCount(member.guild.memberCount)
    .setGuildName(member.guild.name);

    card.build()
    .then(data => {

        let attachment = new Discord.MessageAttachment(data, "welcome.png");
        channel.send({content:`<@${member.user.id}>`,files: [attachment]})
    })

}