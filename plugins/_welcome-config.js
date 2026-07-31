import fs from 'fs'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

// FUNCION PARA GUARDAR AUDIO EN MP3
const saveAudio = async (m, type) => {
  let q = m.quoted
  let mime = (q.msg || q).mimetype || q.mimetype || ''
  if (!/audio/.test(mime)) return m.reply(`*🍓 STRAWBERRY PREM 🍓*\n*⚠️ ESO NO ES UN AUDIO*`);

  let chat = global.db.data.chats[m.chat] || {}
  let buffer = await q.download()
  let tempFile = join('./temp', `${m.chat}_temp_${Date.now()}.ogg`)
  let fileName = join('./temp', `${m.chat}_${type}_${Date.now()}.mp3`)
  if (!fs.existsSync('./temp')) fs.mkdirSync('./temp')
  fs.writeFileSync(tempFile, buffer)

  await execAsync(`ffmpeg -y -i "${tempFile}" -vn -ar 44100 -ac 2 -b:a 128k -c:a libmp3lame -id3v2_version 3 -metadata ptt="" "${fileName}"`)
  fs.unlinkSync(tempFile)

  chat[`${type}Audio`] = fileName
  global.db.data.chats[m.chat] = chat
  await global.db.write()
  return fileName
}

let handler = async (m, { conn, text, command, isAdmin }) => {
  if (!isAdmin) return m.reply(`*🍓 STRAWBERRY PREM 🍓*\n*😡 SOLO ADMINS*`);

  let chat = global.db.data.chats[m.chat] || {}

  switch(command) {
    case 'setwelcome':
      if (!text) return m.reply(`*🍓 STRAWBERRY PREM 🍓*

*⚠️ FALTA TEXTO ⚠️*

*Ejemplo*: .setwelcome @name llego a @group
*Variables*: @user @name @group @desc %users @action @date`);
      chat.welcomeText = text;
      global.db.data.chats[m.chat] = chat
      await global.db.write()
      return m.reply(`*🍓 STRAWBERRY PREM 🍓*

*💖 BIENVENIDA GUARDADA 💖*

*── PREVISUALIZACION ──*
${text}

> *"Una nueva fresita se unio al huerto"*`);

    case 'setbye':
      if (!text) return m.reply(`*🍓 STRAWBERRY PREM 🍓*

*⚠️ FALTA TEXTO ⚠️*

*Ejemplo*: .setbye @name abandono @group
*Variables*: @user @name @group %users @action @date`);
      chat.byeText = text;
      global.db.data.chats[m.chat] = chat
      await global.db.write()
      return m.reply(`*🍓 STRAWBERRY PREM 🍓*

*😢 DESPEDIDA GUARDADA 😢*

*── PREVISUALIZACION ──*
${text}

> *"Otra fresita dejo el huerto"*`);

    case 'delwelcome':
      chat.welcomeText = null;
      global.db.data.chats[m.chat] = chat
      await global.db.write()
      return m.reply(`*🍓 STRAWBERRY PREM 🍓*

*✅ BIENVENIDA ELIMINADA ✅*

*Volvio al mensaje fresita por defecto*`);

    case 'delbye':
      chat.byeText = null;
      global.db.data.chats[m.chat] = chat
      await global.db.write()
      return m.reply(`*🍓 STRAWBERRY PREM 🍓*

*✅ DESPEDIDA ELIMINADA ✅*

*Volvio al mensaje fresita por defecto*`);

    case 'audiowelcome':
      if (!m.quoted) return m.reply(`*🍓 STRAWBERRY PREM 🍓*\n*⚠️ RESPONDE A UN AUDIO*`);
      await saveAudio(m, 'welcome')
      return m.reply(`*🍓 STRAWBERRY PREM 🍓*\n*🎵 AUDIO MP3 GUARDADO*\n*Ya no se silenciara en grupos*`);

    case 'audiobye':
      if (!m.quoted) return m.reply(`*🍓 STRAWBERRY PREM 🍓*\n*⚠️ RESPONDE A UN AUDIO*`);
      await saveAudio(m, 'bye')
      return m.reply(`*🍓 STRAWBERRY PREM 🍓*\n*🎵 AUDIO MP3 GUARDADO*\n*Ya no se silenciara en grupos*`);

    case 'delaudiowelcome':
      chat.welcomeAudio = null
      global.db.data.chats[m.chat] = chat
      await global.db.write()
      return m.reply(`*🍓 STRAWBERRY PREM 🍓*\n*✅ AUDIO DE BIENVENIDA ELIMINADO*`);

    case 'delaudiobye':
      chat.byeAudio = null
      global.db.data.chats[m.chat] = chat
      await global.db.write()
      return m.reply(`*🍓 STRAWBERRY PREM 🍓*\n*✅ AUDIO DE DESPEDIDA ELIMINADO*`);
  }
}

handler.help = [
  'setwelcome <texto>', 
  'setbye <texto>', 
  'delwelcome', 
  'delbye',
  'audiowelcome',
  'audiobye', 
  'delaudiowelcome',
  'delaudiobye'
];
handler.tags = ['group'];
handler.command = /^(setwelcome|setbye|delwelcome|delbye|audiowelcome|audiobye|delaudiowelcome|delaudiobye)$/i;
handler.admin = true;
handler.group = true;

export default handler