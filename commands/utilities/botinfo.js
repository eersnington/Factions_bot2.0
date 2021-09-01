const { version } = require("discord.js");
const moment = require("moment");
const m = require("moment-duration-format");
let os = require('os')
let cpuStat = require("cpu-stat")
const ms = require("ms")

module.exports = {
    name: 'botinfo',
    description: 'Gives you the info about the bot',
    usage: 'botinfo',
    aliases: ['botinfo-command', 'binfo'],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){
        let cpuLol;
        cpuStat.usagePercent(async function (err, percent, seconds) {
            if (err) {
                return console.log(err);
            }
            const duration = moment.duration(message.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
            const botinfo = new Discord.MessageEmbed()
                .setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ dynamic: true }))
                .setTitle("__**Stats:**__")
                .setColor(client.db.get('options').color)
                .addField("Mem Usage", `\`\`\`yaml\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\`\`\``, true)
                .addField("CPU usage", `\`\`\`yaml\n${percent.toFixed(2)}%\`\`\``, true)
                .addField("Uptime ", `\`\`\`yaml\n${duration}\`\`\``, true)
                .addField("CPU", `\`\`\`fix\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
                .addField("Discord.js", `\`\`\`yaml\nv${version}\`\`\``, true)
                .addField("Node", `\`\`\`yaml\n${process.version}\`\`\``, true)
                .addField("Arch", `\`\`\`yaml\n${os.arch()}\`\`\``, true)
                .addField("Platform", `\`\`\`yaml\n${os.platform()}\`\`\``, true)
                .addField("API Latency", `\`\`\`yaml\n${(message.client.ws.ping)}ms\`\`\``)
                .addField("Requested by", `${message.author.tag}`)
                .setFooter("Glowstone Bot | " +` ${message.guild.name} `)
                .setTimestamp();

            message.channel.send({embeds: [botinfo]})

        });
    }
}