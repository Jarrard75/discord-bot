//Import dependencies
import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import * as Datastore from './datastore.json';

// console.log(typeof(Datastore));
let quote_registry = Datastore.quote_registry;
// console.log(typeof(quotes));

// console.log(quotes)

// quotes.

// interface Datastore {
//     quote_registry: [];
// }

// let quotes = JSON.parse(Datastore.toString());



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
        name:'quote',
        description:'Shares a quote from a user.',
        options: [
            {
                name: 'username',
                description: 'The name of the registered user.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'quoteid',
                description: 'The id number of the quote.',
                required: false,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            },
        ]
    });

});

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand())
        return
    
    const { commandName, options } = interaction

    if(commandName === 'quote'){
        const username = options.getString('username')!;
        const quoteid = options.getNumber('quoteid');

        await interaction.deferReply({

        })

        let reply_content

        let userQuotes = Datastore.quote_registry.find(o => o.name === username);

        if(userQuotes && quoteid === null){
            const i = Math.floor(Math.random() * (userQuotes.quotes.length));
            reply_content = userQuotes.quotes[i];
        }
        else if (userQuotes && quoteid !== null){
            reply_content = userQuotes.quotes[quoteid];
        }
        else{
            reply_content = "User does not exist or isn't registered with /quote."
        }

        interaction.editReply({
            content:`${reply_content}`
        });
    }
    
    
});

client.login(process.env.TOKEN);