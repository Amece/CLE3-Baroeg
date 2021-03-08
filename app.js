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
client.on('message', (channel, tags, message, self) => {
    console.log(channel, message);
	//if(message.toLowerCase() === '!hello') {
	//	client.say(channel, `@${tags.username}, heya!`);
	//}
});