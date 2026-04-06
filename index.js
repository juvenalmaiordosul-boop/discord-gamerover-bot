require('dotenv').config();
const express = require("express");
const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

////////////////////////////
// WEB SERVER 24H
////////////////////////////
const app = express();
app.get("/", (req,res)=> res.send("Bot online"));
app.listen(3000, ()=> console.log("Web server ON"));

client.once("ready", () => {
  console.log(`Logged as ${client.user.tag}`);
});

////////////////////////////
// SLASH COMMAND
////////////////////////////
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "gamerover") return;

  if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
    return interaction.reply({ content:"Only admins!", ephemeral:true });

  const embed = new EmbedBuilder()
    .setTitle("🚨 EVACUAÇÃO INICIADA")
    .setDescription("Apagando canais e cargos...")
    .setColor("Red");

  await interaction.reply({ embeds:[embed] });

  const guild = interaction.guild;

  guild.channels.cache.forEach(c => c.delete().catch(()=>{}));
  guild.roles.cache.forEach(r => { if(r.editable) r.delete().catch(()=>{}); });

  setTimeout(async ()=>{
    const ch = await guild.channels.create({ name:"server-evacuated", type:0 });
    ch.send("☢️ Server wiped successfully.");
  },5000);
});

client.login(process.env.TOKEN);
