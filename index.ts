//Import dependencies
import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import * as Quotes from './datastore.json';

let quotes = JSON.parse(Quotes.toString());



//Configure Environment Variables
dotenv.config()

//bot initialization
const client = new DiscordJS.Client({
    
    //tells discord what bot intends to use and what information it needs
    //Only subscribe to intents you intend to use
    intents:[
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

//Bot event handler functions

//Startup Notify
client.on('ready', ()=>{
    // console.log('bot startup');
    //defining constants
    const guildId = '739660402836766790';
    const guild = client.guilds.cache.get(guildId);

    let commands

    if(guild){
        commands = guild.commands
    }
    else{
        commands = client.application?.commands
    }

    commands?.create({
        name:'ping',
        description:'Plays a random quote'
    });

    commands?.create({
        name:'quote',
        description:'Shares a quote from a user.',
        options: [
            {
                name: 'userName',
                description: 'The Name of the registered user.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'quoteID',
                description: 'the id number of the quote.',
                required: false,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            },
        ]
    })

});

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand())
        return
    
    const { commandName, options } = interaction

    if(commandName === 'ping'){
        interaction.reply({
            content: 'pong',
            ephemeral: true,
        });
    }
    else if(commandName === 'quote'){
        const userName = options.getString('userName')!;
        const quoteID = options.getNumber('quoteID');

        if(quotes.hasOwnProperty(userName) && quoteID === null){
            const i = Math.floor(Math.random() * (quotes[userName].length))
        }
    }
    
    
});

// client.on('messageCreate', (message)=>{
//     if(message.content === 'ping'){
//         message.reply({
//             content:'pong',
//         })
//     }
// });

client.login(process.env.TOKEN);