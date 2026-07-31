import fs from 'fs'
import { join } from 'path'

let handler = async (m, { conn, isAdmin }) => {
  if (!isAdmin) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 😡 *SOLO ADMINS*
╰─────────────────🐉`);

  if (!m.quoted) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ ⚠️ *RESPONDE A UN AUDIO*
╰─────────────────🐉`);

  let q = m.quoted
  let mime = (q.msg || q).mimetype || q.mimetype || ''
  if (!/audio/.test(mime)) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ ⚠️ *ESO NO ES UN AUDIO*
╰─────────────────🐉`);

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}
  
  let buffer = await q.download()
  let fileName = join('./temp', `${m.chat}_bye_${Date.now()}.mp3`)
  if (!fs.existsSync('./temp')) fs.mkdirSync('./temp')
  fs.writeFileSync(fileName, buffer)

  chat.byeAudio = fileName
  await global.db.write()

  m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 💀 *AUDIO DE DESPEDIDA GUARDADO*
│
│ *Ya sonara cuando salga alguien*
╰─────────────────🐉`);
}
handler.help = ['audiobye']
handler.tags = ['group']
handler.command = ['audiobye']
handler.admin = true
handler.group = true
export default handler