const handler = async (m, {conn, isAdmin, groupMetadata }) => {
  if (isAdmin) return m.reply(`*⚠️ AVISO DEL SISTEMA ⚠️*
*━━━━━━━━━━━━━━━*

╭─「 🐉 ESTADO 」─╮
│ *Ya eres administrador*
│ *Tu ki ya esta al maximo*
╰───────────────╯`);

  try {
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
    await m.react('✅')
    m.reply(`*🌟 ASCENSO CONCEDIDO 🌟*
*━━━━━━━━━━━━━━━*

╭─「 ⚡ REPORTE 」─╮
│ *USUARIO*: @${m.sender.split('@')[0]}
│ *NUEVO RANGO*: ADMINISTRADOR
│ *PODER*: Nivel Super Saiyajin
│ *POR*: SISTEMA
╰───────────────╯

> "Tu ki ha evolucionado. Ahora eres guardian"`, null, { mentions: [m.sender] });

  } catch (e) {
    console.error(e)
    m.reply(`*❌ ERROR CRITICO ❌*
*━━━━━━━━━━━━━━━*

╭─「 💥 DETALLE 」─╮
│ *No se pudo dar admin*
│ *El bot no tiene suficiente poder*
╰─────────────────╯

╭─「 🛡️ SOLUCION 」─╮
│ *Dale permisos de admin al bot*
│ *Necesita ki para promover*
╰─────────────────╯`);
  }
};

handler.tags = ['owner'];
handler.help = ['autoadmin'];
handler.command = ['autoadmin'];
handler.rowner = true;
handler.group = true;
handler.botAdmin = true;
handler.owner = true;

export default handler;