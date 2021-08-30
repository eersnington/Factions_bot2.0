const chalk = require("chalk");
const { Client, Discord } = require('discord.js')
const { exec } = require('child_process');
const hwid = require('node-hwid');
const https = require('https');
const {version} = require('./package.json')

console.log(
    chalk.hex("#F1C40F")  (" ██████╗ ██╗      ██████╗ ██╗    ██╗███████╗████████╗ ██████╗ ███╗   ██╗███████╗ "),chalk.magenta ("██████╗ ███████╗██╗   ██╗\n"),                                                                                                                                    
    chalk.hex("#F1C40F")   ("██╔════╝ ██║     ██╔═══██╗██║    ██║██╔════╝╚══██╔══╝██╔═══██╗████╗  ██║██╔════╝"), chalk.white ("██╔══██╗██╔════╝██║   ██║\n"),         
    chalk.hex("#F1C40F")   ("██║  ███╗██║     ██║   ██║██║ █╗ ██║███████╗   ██║   ██║   ██║██╔██╗ ██║█████╗  "),chalk.magenta ("██║  ██║█████╗  ██║   ██║\n"),        
    chalk.hex("#F1C40F")   ("██║   ██║██║     ██║   ██║██║███╗██║╚════██║   ██║   ██║   ██║██║╚██╗██║██╔══╝  "),  chalk.white("██║  ██║██╔══╝  ╚██╗ ██╔╝\n"),         
    chalk.hex("#F1C40F")   ("╚██████╔╝███████╗╚██████╔╝╚███╔███╔╝███████║   ██║   ╚██████╔╝██║ ╚████║███████╗"), chalk.magenta("██████╔╝███████╗ ╚████╔╝ \n"),       
    chalk.hex("#F1C40F")    (" ╚═════╝ ╚══════╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚══════ "), chalk.white("╚═════╝ ╚══════╝  ╚═══╝  \n"), 
    )

console.log("\n[»] "),console.log(chalk.blue(`Glowstone Development | Factions Bot v${version}`))
https.get(`https://glowstone-factions-bot-beast-default-rtdb.europe-west1.firebasedatabase.app/versionID.json`, (res)=>{
    let data = ''
    res.on('data', chunk =>{
        data += chunk
    })

    res.on('end', ()=>{
        if (data != `"${version}"`){
            console.log(chalk.hex("#ffa500")(`[Glowstone] » New Version Available >> v${data}`))
        }
    })
})
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
                if (obj.id != "zJGGAke0902TvOXaBjvhZWsq3kuLhRwk") {
                    console.log(chalk.hex("#e12120")("[Glowstone] » Authentication Failed"))
                    process.exit(0)
                }
            }catch (err){
                console.log(chalk.hex("#e12120")("[Glowstone] » Authentication Failed"))
                process.exit(0)
            }
        })
    })
})
require('./start.js')  

//find . -name ".DS_Store" -delete