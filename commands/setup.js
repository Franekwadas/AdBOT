module.exports = {

    "name": "setup",
    "description": "Using that command you can setup bot to your discord server!",

    execute(message, args, client) {

        var config = client.configFile.find(g => g.guildId == message.guild.id);

        if (config.inConfiguration) {

            

        } else {

            message.channel.send("**Jm sorry but its looks like someone else configurated me before you!**")

        }

    }

}