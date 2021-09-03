const chalk = require('chalk');
const got = require('got');

module.exports = {
    name : 'meme',
    description : 'Send a meme',
    usage: 'meme',
    aliases: [],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');

        const meme = new Discord.MessageEmbed();
        got('https://www.reddit.com/r/memes/random/.json')
            .then(response => {
                const [list] = JSON.parse(response.body);
                const [post] = list.data.children;
    
                const permalink = post.data.permalink;
                const memeUrl = `https://reddit.com${permalink}`;
                const memeImage = post.data.url;
                const memeTitle = post.data.title;
                const memeUpvotes = post.data.ups;
                const memeNumComments = post.data.num_comments;
    
                meme.setTitle(`${memeTitle}`);
                meme.setURL(`${memeUrl}`);
                meme.setColor(options.color);
                meme.setImage(memeImage);
                meme.setTimestamp()
                meme.setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));
    
                message.channel.send({embeds: [meme]});
            })
            .catch(console.error); 
    }
}