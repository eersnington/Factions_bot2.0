const chalk = require('chalk');
const {MessageButton,MessageActionRow} = require('discord.js');

let top_page_no = 0

module.exports = {
    name : 'top',
    description : 'List of top checks, deposits and playtime',
    usage: 'top',
    aliases: [],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        top_page_no = 0

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed();

        const checkedEmbed = new Discord.MessageEmbed()
        .setTitle("🥇 Top Buffers/Walls Checked")
        .setImage("https://eu.mc-api.net/v3/server/favicon/"  + options.minecraft_options.ip)
        .setColor(options.color)
        .setFooter(`Glowstone Bot | ${message.guild.name}`);

        const depositEmbed = new Discord.MessageEmbed()
        .setTitle("🥇 Top Bank Deposits")
        .setImage("https://eu.mc-api.net/v3/server/favicon/"  + options.minecraft_options.ip)
        .setColor(options.color)
        .setFooter(`Glowstone Bot | ${message.guild.name}`);

        const playtimeEmbed = new Discord.MessageEmbed()
        .setTitle("🥇 Top Playtime")
        .setDescription("Work In Progress")
        .setImage("https://eu.mc-api.net/v3/server/favicon/"  + options.minecraft_options.ip)
        .setColor(options.color)
        .setFooter(`Glowstone Bot | ${message.guild.name}`);

        let checksArray = Object.values(options.checks.members).sort((a, b)=> b-a)
        let sortedChecks = []
        let top_checked_player;
        let iteration_count1 = 0;
        let searchChecks = Object.keys(options.checks.members)
        checksArray.forEach(e => {
            let key_from_value = searchChecks.find(key => options.checks.members[key] === e)
            searchChecks = arrayRemove(searchChecks, key_from_value);
            sortedChecks.push(`${key_from_value}: ${parseInt(e).toLocaleString()}`)
            if(iteration_count1 ==0){
                iteration_count1++;
                top_checked_player = key_from_value;
            }
        });
        checkedEmbed.setDescription(`\`\`\`elixir\n${(sortedChecks.length >= 1) ? sortedChecks.join("\n"): "No players in this list"}\`\`\``)
        .setThumbnail("https://mc-heads.net/avatar/" + top_checked_player + "/100/nohelm.png");

        let bankArray = Object.values(options.bank.members).sort((a, b)=> b-a)
        let sortedBank = []
        let top_deposited_player;
        let iteration_count2 = 0;
        let searchDeposits = Object.keys(options.bank.members)
        bankArray.forEach(e => {
            let key_from_value = searchDeposits.find(key => options.bank.members[key] === e);
            searchDeposits = arrayRemove(searchDeposits, key_from_value)
            sortedBank.push(`${key_from_value}: $${parseInt(e).toLocaleString()}`)
            if(iteration_count2 ==0){
                iteration_count2++;
                top_deposited_player = key_from_value;
            }
        });
        depositEmbed.setDescription(`\`\`\`elixir\n${(sortedBank.length >=1) ? sortedBank.join("\n"): "No players in this list"}\`\`\``)
        .setThumbnail("https://mc-heads.net/avatar/" +top_deposited_player+ "/100/nohelm.png");

        let playtimeArray = Object.values(options.playtime).sort((a, b)=> b-a)
        let sortedPlaytime = []
        let top_playtime_player;
        let iteration_count3 = 0;
        let searchPlaytime = Object.keys(options.playtime)
        playtimeArray.forEach(e => {
            let key_from_value = searchPlaytime.find(key => options.playtime[key] === e)
            searchPlaytime = arrayRemove(searchPlaytime, key_from_value)
            sortedPlaytime.push(`${key_from_value}: ${timeConvert(parseInt(e).toLocaleString())}`)
            if(iteration_count3 ==0){
                iteration_count3++;
                top_playtime_player = key_from_value;
            }
        });

        playtimeEmbed.setDescription(`\`\`\`elixir\n${(sortedPlaytime.length >=1) ? sortedPlaytime.join("\n"): "No players in this list"}\`\`\``)
        .setThumbnail("https://mc-heads.net/avatar/" +top_playtime_player+ "/100/nohelm.png");

        if (args[0] == "checks"){
            return message.channel.send({embeds:[checkedEmbed]})
        }else if (args[0] ==  "deposits"){
            return message.channel.send({embeds:[depositEmbed]})
        }else if (args[0] ==  "playtime"){
            return message.channel.send({embeds:[playtimeEmbed]})
        }

        let pages = {1: embed, 2: checkedEmbed, 3: depositEmbed, 4: playtimeEmbed}
        
        top_page_no = 0;

        embed.setTitle("🏅 Top Leaderboard")
        .setDescription('This is the leaderboard of top  wall/buffer checks, bank deposits, and playtime\n\n*You need to link your discord to minecraft for your name to show up in checked and playtime scoreboard\*')
        .setThumbnail("https://i.imgur.com/fgd9Dzk.png")
        .setImage("https://eu.mc-api.net/v3/server/favicon/"  + options.minecraft_options.ip)
        .setColor(options.color)
        .setFooter(`Glowstone Bot | ${message.guild.name}`);

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
        message.channel.send({embeds:[embed], components: [row]}).then(async embed => {
            const buttonFilter = (interaction) => interaction.user.id == message.author.id;

            const collector = message.channel.createMessageComponentCollector({buttonFilter, max:6});

            collector.on("collect", (interaction)=>{

                if (interaction.customId === 'button-right' && interaction.message.id == embed.id){

                    if (top_page_no < Object.keys(pages).length -1){
                        top_page_no++;
                        embed.edit({embeds: [pages[top_page_no+1]]});
                    }

                }
                if (interaction.customId === 'button-left' && interaction.message.id == embed.id){

                    if (top_page_no > 0){
                        top_page_no--;
                        embed.edit({embeds: [pages[top_page_no+1]]});
                    }
                }
            });
        });
    }
}

function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

function timeConvert(n) {
    var num = parseInt(n);
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " h(s) " + rminutes + " min(s)";
}