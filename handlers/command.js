const fs = require('fs');
const chalk = require("chalk");

module.exports = (client, Discord) =>{
    const commands_dir = './commands/';
    const command_folder = fs.readdirSync(commands_dir);

    const ingame_commands_dir = './ingame_commands/';
    const ingame_command_folder = fs.readdirSync(ingame_commands_dir).filter(file => file.endsWith('.js'));

    for (const folder of command_folder) {
        const command_folder = fs.readdirSync(`${commands_dir}${folder}`).filter(file => file.endsWith('.js'));
        for (const file of command_folder) {
            const command = require(`.${commands_dir}${folder}/${file}`);

            client.commands.set(command.name, command);
        }
    }

    for (const file of ingame_command_folder) {
        const command = require(`../ingame_commands/${file}`);
        client.ingame_commands.set(command.name, command);
    }
}

