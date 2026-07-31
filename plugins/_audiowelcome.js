import fs from 'fs'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

let handler = async (m, { conn, isAdmin }) => {
  if (!isAdmin) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮\n│ 😡 *SOLO ADMINS*\n╰─────────────────🐉`);
  if (!m.quoted) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮\n│ ⚠️ *RESPONDE A UN AUDIO*\n╰─────────────────🐉`);

  let q = m.quoted
  let mime = (q.msg || q).mimetype || q.mimetype || ''
  if (!/audio/.test(mime)) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮\n│ ⚠️ *ESO NO ES UN AUDIO*\n╰─────────────────🐉`);

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  let buffer = await q.download()
  let tempFile = join('./temp', `${m.chat}_temp_${Date.now()}.ogg`)
  let fileName = join('./temp', `${m.chat}_welcome_${Date.now()}.mp3`) // GUARDAR COMO MP3
  if (!fs.existsSync('./temp')) fs.mkdirSync('./temp')
  fs.writeFileSync(tempFile, buffer)

  // CONVERTIR A MP3 LIMPIO SIN METADATOS PTT
  await execAsync(`ffmpeg -y -i "${tempFile}" -vn -ar 44100 -ac 2 -b:a 128k -c:a libmp3lame -id3v2_version 3 -metadata ptt="" "${fileName}"`)
  fs.unlinkSync(tempFile)

  chat.welcomeAudio = fileName
  await global.db.write()

  m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮\n│ 🎵 *AUDIO MP3 GUARDADO*\n│ *Ya no se silenciará en grupos*\n╰─────────────────🐉`);
}
handler.help = ['audiowelcome']
handler.tags = ['group']
handler.command = ['audiowelcome']
handler.admin = true
handler.group = true
export default handler