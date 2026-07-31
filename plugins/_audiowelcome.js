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
  chat.welcomeAudio = url
  await global.db.write()

  m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 🎵 *AUDIO DE BIENVENIDA GUARDADO*
│
│ *Cada vez que entre alguien sonara este audio*
╰─────────────────🐉`);
}
handler.help = ['audiowelcome']
handler.tags = ['group']
handler.command = ['audiowelcome']
handler.admin = true
handler.group = true
export default handler