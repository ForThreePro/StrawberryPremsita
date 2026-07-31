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
│ *Ejemplo:*.setbye @name abandono @group
│ *Variables:* @user @name @group %users @action @date
╰─────────────────🐉`);

  chat.byeText = text;
  await global.db.write()
  m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 💀 *DESPEDIDA GUARDADA*
╰─────────────────🐉

╭─「 𝗣𝗥𝗘𝗩𝗜𝗦𝗨𝗔𝗟𝗜𝗭𝗔𝗖𝗜𝗢𝗡 」─🐉─╮
│ ${text}
╰─────────────────🐉

> *"Otro guerrero ha caido"*`);
}

handler.help = ['setbye <texto>'];
handler.tags = ['group'];
handler.command = ['setbye'];
handler.admin = true;
handler.group = true;

export default handler;