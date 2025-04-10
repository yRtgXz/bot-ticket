const Discord = require("discord.js");
require("dotenv").config();

const client = new Discord.Client({ 
  intents: [ 
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers
  ]
});

module.exports = client;

client.slashCommands = new Discord.Collection();

require('./handler')(client);

client.on("interactionCreate", async (interaction) => {
  if (interaction.type === Discord.InteractionType.ApplicationCommand) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return interaction.reply(`Error`);
    interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
    cmd.run(client, interaction);
  }

  require('./events/config-ticket').execute(interaction, client);
  require('./events/ticket').execute(interaction, client);
  require('./events/gerenciar').execute(interaction, client);
});

client.on('ready', () => {
  console.log(`🔥 Estou online em ${client.user.username}!`);
});

client.login(process.env.TOKEN);