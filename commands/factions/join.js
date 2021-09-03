const mineflayer = require("mineflayer");
const Discord = require('discord.js')
const chalk = require('chalk');
const performance = require('perf_hooks').performance;
const tpsPlugin = require('mineflayer-tps')(mineflayer);

let login_timeout;
let relog_interval;
let bot;

const botEmbed = new Discord.MessageEmbed();

const tnt_cooldown = new Set();
const cegg_cooldown = new Set();
const playtime = new Set();
const tempTime = {}

module.exports = {
    name : 'join',
    description : 'Connect the minecraft-bot to a server',
    usage: 'join',
    aliases: [],
    whitelist: true,
    dev: true,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        let options = client.db.get('options');
        const embed = new Discord.MessageEmbed()
            .setColor(options.color);

        if (client.bot != null){
            embed.setTitle(`‼️ Warning`)
            .setThumbnail(message.guild.iconURL())
            .setDescription(`There is already a bot instance with the ign \`${bot.username}\`. 
                              If you want to disconnect then please issue the command \`${options.discord_options.prefix}disconnect\``)
            .setColor(options.color)
            .setFooter('Glowstone Bot | Glowstone-Development');
            return message.channel.send({embeds:[embed]});
        }
        
        main(options, message, client);
  
    }
}

/** 
 * Mineflayer Bot Main 
 */

 function main(options, message, client) {

    client.data = {ftop: [], fptop: [], flist: [], server_chat: []}

    let data = client.data
    login_timeout = setTimeout(()=> {
        let channel = client.channels.cache.get(client.db.get('options').discord_options.server_chat_channel);
        client.bot = null
        if (!channel) {
            return console.log(chalk.red("[Glowstone] Failed to connect"));
        };
        botEmbed.setTitle(`‼️ Login Timeout`)
        .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
        .setDescription(`The minecraft bot took too long to connect to \`${options.minecraft_options.ip}\`\n 
                        There might be network issues in your end or the server end. Maybe try again in a couple of minutes.`)
        .setColor(options.color)
        .setFooter('Glowstone Bot | Glowstone-Development');
        channel.send({embeds: [botEmbed]});
    }, 15000);
  
    botEmbed.setTitle(`🟨 Standby`)
    .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
    .setDescription(`Please wait a couple of seconds for the bot to join the server.`)
    .setColor(options.color)
    .setFooter('Glowstone Bot | Glowstone-Development');
    message.channel.send({embeds:[botEmbed]});

    bot = mineflayer.createBot({
        host: client.db.get('options').minecraft_options.ip,
        username: options.config.mc_username,
        password: options.config.mc_password,
        auth: options.config.auth,
        version: client.db.get('options').minecraft_options.version,
        viewDistance: "far"
      })
      // Binding Events
  
    bot.on("login", async ()=>{
        client.bot = bot;
      
        if (options.online == false){

            options.online = true;
            bot.loadPlugin(tpsPlugin);
    
            let chatRegex = new RegExp(`^(\\*|\\*\\*|\\*\\*\\*|\\+|\\+\\+|\\-|\\-\\-|@)(\\w+): \\${options.discord_options.prefix}(\\w+)(.*)`);
            let mapleCraftRegex = new RegExp(`^FACTION: (\\*|\\*\\*|\\*\\*\\*|\\+|\\+\\+|\\-|\\-\\-)(\\w+): \\${options.discord_options.prefix}(\\w+)(.*)`);
            let conquerMcRegex = new RegExp(`^\\[factions] \\[(\\*|\\*\\*|\\*\\*\\*|\\+|\\+\\+|\\-|\\-\\-)] (\\w+): \\${options.discord_options.prefix}(\\w+)(.*)`);
    
            bot.addChatPattern("facChat1", chatRegex , { parse: true});
            bot.addChatPattern("facChat1", mapleCraftRegex , { parse: true});
            bot.addChatPattern("facChat1", conquerMcRegex , { parse: true});
            bot.addChatPattern("deposit", /^(\*|\*\*|\*\*\*|\+|\+\+|\-|\-\-)(\w+) gave \$((?=.)(\d{1,3}(,\d{3})*)?(\.\d+)?) to your faction\./, { parse: true});
            bot.addChatPattern("deposit", /^(\*|\*\*|\*\*\*|\+|\+\+|\-|\-\-)(\w+) gave ((?=.)(\d{1,3}(,\d{3})*)?(\.\d+)?) to your faction\./, { parse: true});
            bot.addChatPattern("paydeposit", /\$((?=.)(\d{1,3}(,\d{3})*)?(\.\d+)?) has been received from (\w+)\./, { parse: true});
        }
        
        botEmbed.setTitle(`✅ Successful Login`)
        .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
        .setDescription(`The bot \`${bot.username}\` has succesfully logged into \`${options.minecraft_options.ip}\`\n
                          To check the status, issue the command \`${options.discord_options.prefix}status\`\n
                          If you want to disconnect, then please issue the command \`${options.discord_options.prefix}disconnect\``)
        .setColor(options.color)
        .setFooter('Glowstone Bot | Glowstone-Development');
  
        message.channel.send({embeds:[botEmbed]});

        clearTimeout(login_timeout);
        clearTimeout(relog_interval);
        
        setTimeout(()=>{
            bot.chat(`${client.db.get('options').minecraft_options.join_command}`)

        }, 1000)
        console.log(chalk.green(`[Glowstone] Logged in as`, chalk.bold.underline(`${bot.username}`),`in`,chalk.bold.underline(`${options.minecraft_options.ip}`)));
    });

    bot.on("chat:facChat1", (matches) => {
        
        const main_match = matches[0]
        const player = main_match[1]
        const commandName = main_match[2]
        const args = main_match[3]

        const command = client.ingame_commands.get(commandName)|| client.ingame_commands.find(command => command.aliases.includes(commandName));
        
        if(!command)return
    
        if (command.whitelist && !command.member && !Object.keys(client.db.get('options').players.whitelist).includes(player)) return client.bot.chat("You have to whitelistlink in the Discord to perform this command!")
        if (command.whitelist && command.member 
            && !Object.keys(client.db.get('options').players.faction).includes(player) && !Object.keys(client.db.get('options').players.whitelist).includes(player)) return client.bot.chat("You have to memberlink or whitelistlink in the Discord to perform this command!")

        command.execute(client, message, player, args);
    });

    bot.on("chat:deposit", (matches) => {
        
        const main_match = matches[0]
        const player = main_match[1]
        const amount = parseInt(main_match[2].replace(/\,/g,''))

        let optionsJson = client.db.get('options')
  
        if (Object.keys(optionsJson.bank.members).includes(player)){
            const previous_amt = parseInt(optionsJson.bank.members[player])
            const new_amt = previous_amt+amount
            optionsJson.bank.members[player] = new_amt
        }else{
            optionsJson.bank.members[player] = amount
        }

        client.db.set('options', optionsJson);
        client.bot.chat(`Your contribution has beed noted ${player}`);
    });
  
    bot.on("chat:paydeposit", (matches) => {
        
        const main_match = matches[0]
        const player = main_match[4]
        const amount = parseInt(main_match[0].replace(/\,/g,''))
  
        let optionsJson = client.db.get('options')
  
        if (Object.keys(optionsJson.bank.members).includes(player)){
            const previous_amt = parseInt(optionsJson.bank.members[player])
            const new_amt = previous_amt+amount
            optionsJson.bank.members[player] = new_amt
        }else{
            optionsJson.bank.members[player] = amount
        }

        client.db.set('options', optionsJson);
        client.bot.chat(`Your contribution has beed noted ${player}`);
    });
  
    bot.on("message", (message, position) =>{
        let channel = client.channels.cache.get(client.db.get('options').discord_options.server_chat_channel)
        if (!channel) return;
        if (position == 'game_info') return;
        let server_message = `${message}`
  
        if (server_message.includes('$')){
            data.ftop.push(server_message);
            data.fptop.push(server_message);
        }
        if (server_message.includes('/')){
            data.flist.push(server_message)
        }
        if (client.db.get('options').server_chat.toggle){
            data.server_chat.push(server_message)
            setTimeout(() => {
                if (data.server_chat.length >= 2){
                channel.send({content: `\`\`\`${data.server_chat.join('\n')}\`\`\``})
                data.server_chat = []
                } else if (data.server_chat.length == 1){
                channel.send({content: `\`\`\`${data.server_chat.shift()}\`\`\``})
                }
            }, 750); 
        }
    });
    
    bot.on("kicked", async (reason) => {
        let channel = client.channels.cache.get(client.db.get('options').discord_options.server_chat_channel)
  
        relog_interval = setTimeout(() => {
          main(options, message, client);
        }, 120000);

        if (!channel) {
            bot.end();
            client.bot = null;
            options.online = false;
            console.log(chalk.red(`[Glowstone] Minecraft Bot kicked:`, reason));
            return console.log(chalk.yellow('[Glowstone] Reconnecting in 2 mins'));
        };
  
        botEmbed.setTitle(`⁉️ Bot Kicked`)
        .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
        .setDescription(`The bot \`${bot.username}\` was kicked from \`${options.minecraft_options.ip}\`\n
                          **Reason:** \`\`\`${reason}\`\`\`
                          The bot will attemp to reconnect in 2 minutes`)
        .setColor(options.color)
        .setFooter('Glowstone Bot | Glowstone-Development');
  
        channel.send({content: `<@&${options.discord_options.developer_role}>`, embeds:[botEmbed]});
        console.log(chalk.red(`[Glowstone] Minecraft Bot kicked:`, reason));
        console.log(chalk.yellow('[Glowstone] Reconnecting in 2 mins'));
        bot.end();
        client.bot = null;
        options.online = false;
    });
      
    bot.on('error', async (err) => {
        let channel = client.channels.cache.get(client.db.get('options').discord_options.server_chat_channel);
        if (!channel){
          console.log(chalk.red(`[Glowstone] Bot Error: ${err}`));
          return console.log(chalk.red(`[Glowstone] Minecraft Bot has shut down!`));
        }
  
        botEmbed.setTitle(`⁉️ Bot Error`)
        .setThumbnail("https://eu.mc-api.net/v3/server/favicon/" + options.minecraft_options.ip)
        .setDescription(` \`\`\`${err}\`\`\`\n **Minecraft bot has shut down**`)
        .setColor(options.color)
        .setFooter('Glowstone Bot | Glowstone-Development');
        
        channel.send({content: `<@&${options.discord_options.developer_role}>`,embeds:[botEmbed]});
        console.log(chalk.red(`[Glowstone] Minecraft Bot Error: ${err}`));
        console.log(chalk.red(`[Glowstone] Minecraft Bot has shut down!`));
        bot.end();
        client.bot = null;
        options.online = false;
    });
  
    bot.on("playerJoined", (player)=>{
    
        if (Object.keys(client.db.get('options').players.whitelist).includes(player.username) || Object.keys(client.db.get('options').players.faction).includes(player.username)){

            if(!playtime.has(player.username)){
                playtime.add(player.username)
                tempTime[player.username] = performance.now()
            }
         
        }else {
        
          return
        }
        
    });
  
    bot.on("playerLeft", (player)=>{
        if (Object.keys(client.db.get('options').players.whitelist).includes(player.username) || Object.keys(client.db.get('options').players.faction).includes(player.username)){
          if(playtime.has(player.username)){
  
            playtime.delete(player.username)
            let endTime = performance.now()
            let onlineTime = Math.round(endTime-tempTime[player.username])
  
            let playTimeMinutes = Math.floor(onlineTime / 60000);

            let optionsJson = client.db.get('options')
            if (!optionsJson.playtime[player.username]){
                optionsJson.playtime[player.username] = playTimeMinutes;
            }else{
                optionsJson.playtime[player.username] += playTimeMinutes;
            }
  
            client.db.set('options', optionsJson);
            
          }
        } else return;
  
    });
  
    bot._client.on('explosion', data => {
        let alerts_chat = client.channels.cache.get(client.db.get('options').discord_options.alerts_channel);
        
        if (client.db.get('options').tnt_alert == true && !tnt_cooldown.has("cooldown")){
          tnt_cooldown.add("cooldown");
          setTimeout(()=> tnt_cooldown.delete("cooldown"), 6000);
          if (data.radius == 4){
  
            const tntEmbed = new Discord.MessageEmbed();
  
            tntEmbed.setTitle(`💣 TNT Shot Alert`)
            .setColor(options.color)
            .setTimestamp()
            .setThumbnail("https://art.pixilart.com/12f55dd3412c81c.png")
            .setDescription(`Tnt shot detected near me\n**Coords:** (${parseFloat(data.x).toFixed(2)}, ${parseFloat(data.y).toFixed(2)}, ${parseFloat(data.z).toFixed(2)})`)
            .setFooter(`Glowstone Bot | ${message.guild.name}`);

            if (!alerts_chat) return console.log(chalk.red(`[Glowstone] A TNT shot has been detected! Please set`));
            alerts_chat.send({content: '@everyone' ,embeds: [tntEmbed]});
            
          }
  
        }
        if(client.db.get('options').cegg_alert == true && !cegg_cooldown.has("cooldown")){
  
          cegg_cooldown.add("cooldown");
          setTimeout(()=> cegg_cooldown.delete("cooldown"), 6000);
  
          if (data.radius != 4) {
            const ceggEmbed = new Discord.MessageEmbed();
  
            ceggEmbed.setTitle(`💣 Cegg Egg Alert`)
            .setColor(options.color)
            .setTimestamp()
            .setThumbnail("https://i.pinimg.com/originals/84/3b/6b/843b6b77f46c1c3a69091d13fa9593d7.jpg")
            .setDescription(`Possible free-cam cegg detected\n**Coords:** (${parseFloat(data.x).toFixed(2)}, ${parseFloat(data.y).toFixed(2)}, ${parseFloat(data.z).toFixed(2)})`)
            .setFooter(`Glowstone Bot | ${message.guild.name}`);
            
            alerts_chat.send({content: '@everyone' ,embeds: [ceggEmbed]});
  
          }
  
        }
    });
  }