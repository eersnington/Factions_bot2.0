const chalk = require("chalk")

module.exports = async (Discord, client, message) =>{
    if (!client.toggle){
        console.log(chalk.hex("#e12120")("[Glowstone] HWID not authenticated"))
        process.exit(0)
    }

    setTimeout(()=> client.user.setActivity(
        `${client.db.get('options').minecraft_options.ip} Servers Chat | For Help Do  ${client.db.get('options').discord_options.prefix}help`, {
            type: "WATCHING"
        }),1000 )

    console.log(chalk.green(`[Glowstone] Logged in as ${client.user.tag}`));
}