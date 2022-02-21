

//Import dependencies
const DiscordJS = require('discord.js');
const { Intents } = require('discord.js');
const dotenv = require('dotenv');
var datastore = require('./datastore.json');
// console.log(datastore);
// 'use strict';
const fs = require('fs');
// console.log(JSON.parse(fs.readFileSync('./datastore.json')));
// let datastore = JSON.parse(fs.readFileSync('datastore.json'));


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

//Comand Registry
    //quote registration
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

    //quoteregister registration
    commands?.create({
        name:'quoteregister',
        description:'Register as a user to save quotes with the bot.',
        options: [
            {
                name:'username',
                description:'The user name to save your quotes under.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
        ]
    });

    //addquote registration
    commands?.create({
        //TODO
    });

    //removequote registration
    commands?.create({
        //TODO
    });

    //quoteunregister registration
    commands?.create({
        //TODO
    });

    //clear registration
    commands?.create({
        //TODO
    });

    //play registration
    commands?.create({
        //TODO
    });

    //skip registration
    commands?.create({
        //TODO
    });

});

//Command Logic
client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand())
        return
    
    const { commandName, options } = interaction

    //quote command
    if(commandName === 'quote'){
        const username = options.getString('username');
        const quoteid = options.getNumber('quoteid');

        await interaction.deferReply({

        })

        let reply_content

        let userQuotes = datastore.quote_registry.find(o => o.name === username);

        if(userQuotes && quoteid === null){
            if(userQuotes.quotes.length > 0){
                const i = Math.floor(Math.random() * (userQuotes.quotes.length));
                reply_content = userQuotes.quotes[i];
            }
            else{
                reply_content = 'This user is registered but has no quotes to share. Use /addquote to add quotes to this username.'
            }
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

    //quote registration command
    else if(commandName === 'quoteregister'){
        const username = options.getString('username');
        
        // let newUser = {
        //     name:username,
        //     quotes:['this user currently has no quotes registered.']
        // }

        datastore.quote_registry.push({ name: username, quotes: ['this user currently has no quotes registered.']});
        // datastore.

        await interaction.deferReply({
            ephemeral: true
        });

        // console.log(datastore);
        // console.log(datastore.toString());
        // console.log(JSON.parse(datastore));
        // console.log(JSON.parse(datastore));

        try{
            fs.writeFileSync('./datastore.json', JSON.stringify(datastore, null, 4));
            interaction.editReply({
                content:'User Registration Successful.  Use /addquote to register quotes.'
            });
        } catch(err){
            interaction.editReply({
                content:'Registration Failed. Contact a server admin.'
            });
        }
    }

    //add quote command
    else if(commandName === 'addquote'){
        //TODO
    }

    //remove quote command
    else if(commandName === 'removequote'){
        //TODO
    }

    //unregister quote user command.
    else if(commandName === 'quoteunregister'){
        //TODO
    }

    //play command
    else if(commandName === 'play'){
        //TODO
    }

    //skip command
    else if(commandName === 'skip'){
        //TODO
    }
    
    //clear command
    else if(commandName === 'clear'){
        //TODO
    }
    
});

client.login(process.env.TOKEN);