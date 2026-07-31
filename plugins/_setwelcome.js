let handler = async (m, { conn, text, isAdmin }) => {
  if (!isAdmin) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 😡 *SIN PERMISOS*
│
│ *Solo admins pueden cambiar el mensaje*
╰─────────────────🐉`);

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}
  chat = global.db.data.chats[m.chat]

  if (!text) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ ⚠️ *FALTA TEXTO*
│
│ *Ejemplo:*.setwelcome @name llego a @group
│ *Variables:* @user @name @group @desc %users @action @date
╰─────────────────🐉`);

  chat.welcomeText = text;
  await global.db.write()
  m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 💥 *BIENVENIDA GUARDADA*
╰─────────────────🐉

╭─「 𝗣𝗥𝗘𝗩𝗜𝗦𝗨𝗔𝗟𝗜𝗭𝗔𝗖𝗜𝗢𝗡 」─🐉─╮
│ ${text}
╰─────────────────🐉

> *"Un nuevo guerrero se acerca"*`);
}

handler.help = ['setwelcome <texto>'];
handler.tags = ['group'];
handler.command = ['setwelcome'];
handler.admin = true;
handler.group = true;

export default handler;