import { downloadContentFromMessage } from '@whiskeysockets/baileys'
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
  let fileName = join('./temp', `${m.chat}_welcome_${Date.now()}.mp3`)
  if (!fs.existsSync('./temp')) fs.mkdirSync('./temp')
  fs.writeFileSync(fileName, buffer)

  chat.welcomeAudio = fileName
  await global.db.write()

  m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 🎵 *AUDIO DE BIENVENIDA GUARDADO*
│
│ *Ya sonara cuando entre alguien*
╰─────────────────🐉`);
}
handler.help = ['audiowelcome']
handler.tags = ['group']
handler.command = ['audiowelcome']
handler.admin = true
handler.group = true
export default handler