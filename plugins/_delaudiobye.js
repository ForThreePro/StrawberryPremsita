let handler = async (m, { conn, isAdmin }) => {
  if (!isAdmin) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 😡 *SOLO ADMINS*
╰─────────────────🐉`);

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}
  chat = global.db.data.chats[m.chat]

  chat.byeAudio = null
  await global.db.write()
  m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ ✅ *AUDIO DE DESPEDIDA ELIMINADO*
╰─────────────────🐉`);
}
handler.help = ['delaudiobye']
handler.tags = ['group']
handler.command = ['delaudiobye']
handler.admin = true
handler.group = true
export default handler