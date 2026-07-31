let handler = async (m, { conn, isAdmin }) => {
  if (!isAdmin) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 😡 *SIN PERMISOS*
╰─────────────────🐉`);

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}
  chat = global.db.data.chats[m.chat]

  chat.welcomeText = null;
  await global.db.write()
  m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ ✅ *BIENVENIDA ELIMINADA*
│
│ *Volvio al mensaje DBZ por defecto*
╰─────────────────🐉`);
}

handler.help = ['delwelcome'];
handler.tags = ['group'];
handler.command = ['delwelcome'];
handler.admin = true;
handler.group = true;

export default handler;