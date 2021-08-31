const fs = require('fs');

module.exports = (client, Discord) =>{
    const commands_dir = './commands/';
    const command_folder = fs.readdirSync(commands_dir);

    for (const folder of command_folder) {
        const command_folder = fs.readdirSync(`${commands_dir}${folder}`).filter(file => file.endsWith('.js'));
        for (const file of command_folder) {
            const command = require(`.${commands_dir}${folder}/${file}`);

            client.commands.set(command.name, command);
        }
    }
}
