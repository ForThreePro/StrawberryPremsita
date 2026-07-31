const handler = async (m, {conn, isAdmin, groupMetadata }) => {
  if (isAdmin) return m.reply(`*🍓 STRAWBERRY PREM 🍓*

*⚠️ AVISO ⚠️*

╭─「 ESTADO 」─╮
│ *Ya eres administrador*
╰──────────────╯`);

  try {
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
    await m.react('✅')
    m.reply(`*🍓 ASCENSO CONCEDIDO 🍓*

╭─「 REPORTE 」─╮
│ *USUARIO*: @${m.sender.split('@')[0]}
│ *NUEVO RANGO*: ADMINISTRADOR
│ *POR*: SISTEMA
╰──────────────╯

> "Ahora tienes permisos de admin"`, null, { mentions: [m.sender] });

  } catch (e) {
    console.error(e)
    m.reply(`*🍓 STRAWBERRY PREM 🍓*

*❌ ERROR CRITICO ❌*

╭─「 DETALLE 」─╮
│ *No se pudo dar admin*
│ *El bot no tiene permisos*
╰──────────────╯

╭─「 SOLUCION 」─╮
│ *Dale permisos de admin al bot*
╰────────────────╯`);
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