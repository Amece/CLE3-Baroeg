require('dotenv').config();
const tmi = require('tmi.js');
const client = new tmi.Client({
	options: { debug: true, messagesLogLevel: "info" },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_AUTH_CODE
	},
	channels: [process.env.TWITCH_USERNAME]
});
client.connect().catch(console.error);
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.on('message', (channel, userstate, message, self) => {
	//uncomment this to remove the chat filter for the host.
	//if(self) return;
	//if(userstate.username === process.env.TWITCH_USERNAME) return;

	filterChat(userstate, message, channel);
});

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

function filterChat(userstate, message, channel) {
	const blockedWords = ['test'];

	message = message.toLowerCase();
	let shouldSendMessage = false;
	shouldSendMessage = blockedWords.some(blockedWord => message.includes(blockedWord.toLowerCase()));
	if (shouldSendMessage) {
		// tells user
		client.say(channel, `@${userstate.username} The message you typed was inappropriate and got deleted.`)
		// delete message
		client.deletemessage(channel, userstate.id)
	}
}
