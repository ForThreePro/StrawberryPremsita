let handler = async (m, { conn, text, isAdmin }) => {
  if (!isAdmin) return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 😡 *SIN PERMISOS*
│
│ *Solo admins pueden cambiar el mensaje*
╰─────────────────🐉`);

  let chat = global.db.data.chats[m.chat];

  if (!text) {
    chat.byeText = null;
    return m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ ✅ *DESPEDIDA RESTAURADA*
│
│ *Volvio al mensaje DBZ por defecto*
│ *Usa.setbye <texto> para personalizar*
╰─────────────────🐉`);
  }

  chat.byeText = text;
  m.reply(`╭─🐉 *『 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗣𝗥𝗘𝗠 』* 🐉─╮
│ 💀 *MENSAJE DE DESPEDIDA GUARDADO*
╰─────────────────🐉

╭─「 𝗣𝗥𝗘𝗩𝗜𝗦𝗨𝗔𝗟𝗜𝗭𝗔𝗖𝗜𝗢𝗡 」─🐉─╮
│ ${text}
╰─────────────────🐉

*Variables:* @user @name @group %users @action @date
> *"Otro guerrero ha caido"*`);
}

handler.help = ['setbye <texto>'];
handler.tags = ['group'];
handler.command = ['setbye'];
handler.admin = true;
handler.group = true;

export default handler;