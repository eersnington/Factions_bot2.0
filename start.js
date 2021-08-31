const chalk = require("chalk")
const Discord = require("discord.js");
const logs = require('discord-logs');
const fs = require("fs");
const YAML = require("js-yaml");
const hwid = require('node-hwid');
const https = require('https');

const intents = new Discord.Intents(32727);
const client = new Discord.Client({intents});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.config = YAML.load(fs.readFileSync("config.yml"));
client.db = require('quick.db');
client.toggle = false;

hwid({
    hash: true, 
}).then(id =>{
    https.get(`https://glowstone-factions-bot-beast-default-rtdb.europe-west1.firebasedatabase.app/${id}.json`, (res)=>{
        let data = ''
        res.on('data', chunk =>{
            data += chunk
        })

        res.on('end', ()=>{
            const obj = JSON.parse(data)
            try{
                if (res.socket._host != res.socket.servername){
                    console.log(chalk.hex("#e12120")("[Glowstone] » Authentication Failed"))
                    process.exit(0)
                }
                if (obj.id != "GYGAxa0ksAHYkeJmSm2NML6AgHpEW1") {
                    console.log(chalk.hex("#e12120")("[Glowstone] » Authentication Failed"))
                    process.exit(0)
                }else{
                    client.toggle = true
                    console.log(chalk.blue("[Glowstone] » Authentication Successful"))
                    return client.login(String(client.config.discord_bot_token)).catch((err)=> {
                        console.log(chalk.red("[Glowstone] Discord bot token is Invalid! (Make sure you've enabled privledged intents in Devs Portal for your bot)"))
                        console.log(err)
                    })
                }

            }catch (err){

                console.log(chalk.hex("#e12120")("[Glowstone] » Authentication Failed"))
                process.exit(0)
            }

        })
    })
})


if (!client.db.get('options')) {
    client.options = client.db.set('options',{
    color: client.config.embed_color,
    //mineflayer variables
    online: false,
    config: {mc_username: client.config.username, mc_password: client.config.password,  auth: client.config.auth}, 
    minecraft_options:{bot: null, version: '1.8.9', ip: "pvp.thearchon.net", join_command: "onyx"},
    //discord bot variables
    discord_options: {prefix: '*', developer_role: client.config.developer_role_id, member_role: null, server_chat_channel: null, weewoo_channel: null, buffer_channel: null,
    ftop_channel: null, fptop_channel: null, flist_channel: null, alerts_channel: null, whitelist_channel: null, logs_channel: null, interval: 5},
    //members
    players: {
        whitelist: {}, faction: {}},
    //bank data
    bank: {total_deposits: 0, members: {}},
    //checks data
    checks: {buffer_check_count: 0, buffer_interval: null, members:{}},
    //chat data
    server_chat: {toggle: true, data: []},
    ftop: {toggle: false, data: []},
    fptop: {toggle: false, data: []},
    flist: {toggle: false, data: []},
    cegg_alert: false,
    tnt_alert: false,
    logs: false,
    temp_uuid: {},
    commands: {},
    macros: {},
    playtime:{},
    vanish: {track: false, count: 0, list: []}
    })
}else{
    client.options = client.db.get('options')
}

logs(client);

// HANDLERS
require(`./handlers/command`)(client, Discord);
require(`./handlers/events`)//(client, Discord);
require(`./handlers/giveaways`)//(client, Discord);
require(`./handlers/automod`)//(client, Discord);