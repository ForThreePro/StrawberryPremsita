let handler = async (m, { conn, isAdmin }) => {
  if (!isAdmin) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 😡 *SOLO ADMINS*
╰─────────────────🐉`);

  if (!m.quoted ||!m.quoted.audio) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ ⚠️ *RESPONDE A UN AUDIO*
│
│ *Manda o responde a una nota de voz/audio*
╰─────────────────🐉`);

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}
  chat = global.db.data.chats[m.chat]

  let url = await conn.downloadAndSaveMediaMessage(m.quoted)
  chat.byeAudio = url
  await global.db.write()

  m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 💀 *AUDIO DE DESPEDIDA GUARDADO*
│
│ *Cada vez que salga alguien sonara este audio*
╰─────────────────🐉`);
}
handler.help = ['audiobye']
handler.tags = ['group']
handler.command = ['audiobye']
handler.admin = true
handler.group = true
export default handler