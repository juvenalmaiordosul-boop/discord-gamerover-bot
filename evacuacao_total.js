const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('evacuacao_total')
    .setDescription('Executa a evacuação total do servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    // 🔐 VERIFICA PERMISSÃO
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ Apenas administradores podem usar este comando.',
        ephemeral: true
      });
    }

    // 🚨 EMBED INICIAL
    const inicio = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('🚨 PROTOCOLO DE EVACUAÇÃO INICIADO')
      .setDescription(`
Um administrador iniciou a evacuação total.

**Ações planejadas:**
• Remover todos os canais  
• Remover todos os cargos  
• Revogar permissões  

Digite **CONFIRMAR** para continuar.
      `)
      .setFooter({ text: 'Sistema de Segurança do Servidor' });

    await interaction.reply({ embeds: [inicio] });

    // ⏳ AGUARDAR CONFIRMAÇÃO
    const filter = msg =>
      msg.author.id === interaction.user.id &&
      msg.content === 'CONFIRMAR';

    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 15000,
      max: 1
    });

    collector.on('collect', async () => {

      const progresso = new EmbedBuilder()
        .setColor('#ffaa00')
        .setTitle('⚙️ EXECUTANDO PROTOCOLO...')
        .setDescription('Iniciando limpeza estrutural do servidor...');
      
      await interaction.followUp({ embeds: [progresso] });

      const guild = interaction.guild;

      // 🔧 REMOVER CANAIS
      for (const channel of guild.channels.cache.values()) {
        try {
          await channel.delete();
        } catch {}
      }

      // 🔧 REMOVER CARGOS
      for (const role of guild.roles.cache.values()) {
        if (role.name !== '@everyone') {
          try {
            await role.delete();
          } catch {}
        }
      }

      // 🔧 BLOQUEAR @everyone
      try {
        await guild.roles.everyone.setPermissions([]);
      } catch {}

      // ☠️ EMBED FINAL
      const final = new EmbedBuilder()
        .setColor('#000000')
        .setTitle('☠️ EVACUAÇÃO CONCLUÍDA')
        .setDescription(`
O servidor foi neutralizado com sucesso.

🔒 Servidor isolado  
🛑 Estruturas removidas  
🛡️ Permissões revogadas  

**Operação finalizada.**
        `)
        .setFooter({ text: 'Game Over' });

      await interaction.user.send({ embeds: [final] }).catch(() => {});
    });

    collector.on('end', collected => {
      if (!collected.size) {
        interaction.followUp('⏰ Tempo esgotado. Operação cancelada.');
      }
    });
  }
};
