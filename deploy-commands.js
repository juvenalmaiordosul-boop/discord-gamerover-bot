const fs = require('fs');
const path = require('path');

const commands = [];
const files = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for (const file of files) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}
