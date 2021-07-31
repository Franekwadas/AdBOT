const Discord = require('discord.js');
const keepAlive = require('./server');
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

    //Here we are checking if message sender is NOT a any else discord bot and we are checking where the message was sended (message sended to bot on pv in that situation can totaly crash him)
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;

    //Here we are getting from a configs list a config with a same guild id like message guild id
    var config = Client.configFile.find(g => g.guildId == message.guild.id);

    //Here we are checking is config defined - if not we are pushing config for that server to server list
    if (typeof config === 'undefined') {
        Client.configFile.push({

            "guildId": message.guild.id,
            "inConfiguration": true,
            "prefix": "a.",
            "logChannels": []

        });

        //Here we updating every JSON file in function Client.updateConfig();
        Client.updateConfig();

        //Here we again setting config from configs list to a config wich is overwrited to that server.
        config = Client.configFile.find(g => g.guildId == message.guild.id);
    }

    //Here we are setting Client.prefix to prefix wich is overwrite in config
    Client.prefix = config.prefix;

    //Here we checking if bot is configurated if no we are checking if message sender has permission MANAGE_GUILD if he has we are alerting him about not configurated bot.
    if (config.inConfiguration) {
        if (message.member.permissions.has('MANAGE_GUILD')) {
            message.member.send(`**Hello <@${message.author.id}>!** J just want to say jm not configurated on discord server named ${message.guild.name}!`);
        }
    } 

    //Here we are checking if message starts with Client.prefix wich is overwrited above
    if (message.content.startsWith(Client.prefix)) {

        //Here we getting a arguments its mean when j say "Hello world" we are cutting "Hello " and we have only "world" left
        const args = message.content.slice(Client.prefix.length).split(/ +/);
        //Here we doing oposite thing. Its mean we are getting only first word for example "Hello" and we cutting everything else
        const command = args.shift().toLowerCase();

        try {
            
            //Here we are getting a command from a command list and execute this command.
            Client.commands.get(command).execute(message, args, Client);

        } catch (error) {
            
            //Here if command wich user send doesnt exist or dont working we are alerting him using message bellow.
            message.channel.send(`**J dont know that command use ${Client.prefix}help to see current commands list**`);
            //Here we sending error to the console so we can easly fix the bug.
            console.error(error);

        }

    }

});

Client.updateConfig = () => {

    try {
        var appconfig = Client.configFile;
    } catch (error) {
        console.error(error);
    }

    fs.writeFileSync('./appconfig.json', JSON.stringify(appconfig));

}
keepAlive();

Client.login(process.env['TOKEN']);