// .env file is used to safely store discord token, alongside a git ignore file to prevent private info being pushed
require('dotenv').config();
const { Client, IntentsBitField, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');

// List of intents can be found on the discord developer gateway (specification of what our bot will be able to do)
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

// Connecting to our database
(async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to DB.");
  
      eventHandler(client)
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  })();


client.login(process.env.TOKEN);



