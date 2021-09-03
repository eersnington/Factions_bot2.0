const djsGames = require('djs-games')

module.exports = {
    name: 'fasttype',
    description: 'Fastest to type the word wins!',
    usage: 'fasttype',
    aliases: ['ft', 'speedtype'],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        const FastTyper = new djsGames.FastTyper()
        FastTyper.startGame(message)
    }
}