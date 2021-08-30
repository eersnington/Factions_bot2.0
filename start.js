const chalk = require("chalk")
const Discord = require("discord.js");
const logs = require('discord-logs');
const fs = require("fs");
const YAML = require("js-yaml");
const hwid = require('node-hwid');
const https = require('https');

const intents = new Discord.Intents(32727);
const client = new Discord.Client({intents});

hwid({
    hash: true, 
}).then(id =>{
    https.get(`https://glowstone-serverbot-beast-default-rtdb.europe-west1.firebasedatabase.app/${id}.json`, (res)=>{
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
                if (obj.id != "zJGGAke0902TvOXaBjvhZWsq3kuLhRwk") {
                    console.log(chalk.hex("#e12120")("[Glowstone] » Authentication Failed"))
                    process.exit(0)
                }else{
                    client.toggle = true
                    console.log(chalk.blue("[Glowstone] » Authentication Successful"))
                    return client.login(client.config.bot.token).catch(()=> console.log(chalk.red("[Glowstone] Discord bot token is Invalid! (Make sure you've enabled privledged intents in Devs Portal for your bot)")))
                }

            }catch (err){
                console.log(chalk.hex("#e12120")("[Glowstone] » Authentication Failed"))
                process.exit(0)
            }

        })
    })
})