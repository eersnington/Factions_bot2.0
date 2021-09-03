const djsGames = require('djs-games')

module.exports = {
    name: 'tictactoe',
    description: 'Play a game of tictactoe',
    usage: 'tictactoe @user',
    aliases: ['ttt', 'tictactoe-game'],
    whitelist: false,
    dev: false,
    requiredPerms: [],
    async execute(client, Discord, message, args){

        const TicTacToe = new djsGames.TicTacToe()
        TicTacToe.startGame(message)
    }
}