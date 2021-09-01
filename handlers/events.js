const fs = require('fs');

module.exports = (client, Discord) =>{

    const events_dir = './events/';
    const events_folder = fs.readdirSync(events_dir);

    for (const folder of events_folder) {
        const events_folder = fs.readdirSync(`${events_dir}${folder}`).filter(file => file.endsWith('.js'));
        for (const file of events_folder) {
            const event = require(`.${events_dir}${folder}/${file}`);
            client.on(file.split('.')[0], event.bind(null, Discord, client));
        }
    }
    
}