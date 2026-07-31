let handler = async (m, { conn, isAdmin }) => {
  if (!isAdmin) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 😡 *SOLO ADMINS*
╰─────────────────🐉`);

  if (!m.quoted) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ ⚠️ *RESPONDE A UN AUDIO*
╰─────────────────🐉`);

  let q = m.quoted
  let mime = (q.msg || q).mimetype || ''
  if (!mime ||!mime.includes('audio')) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ ⚠️ *ESO NO ES UN AUDIO*
│
│ *Responde a una nota de voz o audio*
╰─────────────────🐉`);

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}
  chat = global.db.data.chats[m.chat]

  let url = await conn.downloadAndSaveMediaMessage(q)
  chat.byeAudio = url
  await global.db.write()

  m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 💀 *AUDIO DE DESPEDIDA GUARDADO*
╰─────────────────🐉`);
}
handler.help = ['audiobye']
handler.tags = ['group']
handler.command = ['audiobye']
handler.admin = true
handler.group = true
export default handler