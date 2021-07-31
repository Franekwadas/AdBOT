const Discord = require('discord.js');
const Client = new Discord.Client();
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
Client.configFile = JSON.parse(fs.readFileSync('./appconfig.json', 'utf-8'));
Client.commands = new Discord.Collection();

for (const file of commandFiles) {
    
    const command = require(`./commands/${file}`);

    Client.commands.set(command.name, command);

}

Client.on('message', message => {

    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;

    var config = Client.configFile.find(g => g.guildId == message.guild.id);

    if (typeof config === 'undefined') {
        Client.configFile.push({

            "guildId": message.guild.id,
            "inConfiguration": true,
            "prefix": "a.",
            "logChannels": []

        });
        config = Client.configFile.find(g => g.guildId == message.guild.id);
    }

    Client.prefix = config.prefix;

    if (config.inConfiguration) {
        if (message.member.permissions.has('MANAGE_GUILD')) {
            message.member.send(`**Hello <@${message.author.id}>!** J just want to say jm not configurated on discord server named ${message.guild.name}!`);
        }
    } 

    if (message.content.startsWith(Client.prefix)) {

        const args = message.content.slice(Client.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        try {
            
            Client.commands.get(command).execute(message, args, Client);

        } catch (error) {
            
            message.channel.send(`**J dont know that command use ${Client.prefix}help to see current commands list**`);
            console.error(error);

        }

    }

});

Client.login('');