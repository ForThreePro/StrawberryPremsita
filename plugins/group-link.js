import { getBotConfig } from '../lib/botconfig.js'

let linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;

let handler = async (m, { conn, text, isOwner }) => {
  const botname = getBotConfig(conn, 'botname')

    if (!text) return m.reply(`⚡━━━━━━━━━━━━━━━⚡
❌ 𝗘𝗥𝗢𝗥 𝗗𝗘 𝗦𝗜𝗦𝗧𝗘𝗠𝗔 ❌
⚡━━━━━━━━━━━━━━━⚡

╭─「 𝗜𝗡𝗦𝗧𝗥𝗨𝗖𝗜𝗢𝗡 」─╮
│ 𝗗𝗲𝗯𝗲𝘀 𝗲𝗻𝘃𝗶𝗮𝗿 𝘂𝗻𝗮 𝗶𝗻𝘃𝗶𝘁𝗮𝗰𝗶𝗼𝗻 𝗽𝗮𝗿𝗮 𝗾𝘂𝗲
│ *${botname}* 𝘀𝗲 𝘂𝗻𝗮 𝗮𝗹 𝗴𝗿𝘂𝗽𝗼
╰───────────────────╯`);

    let [_, code] = text.match(linkRegex) || [];

    if (!code) return m.reply(`⚡━━━━━━━━━━━━━━━⚡
❌ 𝗘𝗥𝗢𝗥 𝗗𝗘 𝗦𝗜𝗦𝗧𝗘𝗠𝗔 ❌
⚡━━━━━━━━━━━━━━━⚡

╭─「 𝗩𝗔𝗟𝗜𝗗𝗔𝗖𝗜𝗢𝗡 」─╮
│ 𝗘𝗻𝗹𝗮𝗰𝗲 𝗱𝗲 𝗶𝗻𝘃𝗶𝘁𝗮𝗰𝗶𝗼𝗻 𝗻𝗼 𝘃𝗮𝗹𝗶𝗱𝗼
╰───────────────────╯`);

    if (isOwner) {
        await conn.groupAcceptInvite(code)
            .then(res => m.reply(`⚡━━━━━━━━━━━━━━━⚡
✅ 𝗔𝗖𝗘𝗦𝗢 𝗖𝗢𝗡𝗖𝗘𝗗𝗜𝗗𝗢 ✅
⚡━━━━━━━━━━━━━━━⚡

╭─「 𝗥𝗘𝗣𝗢𝗥𝗧𝗘 」─╮
│ 𝗠𝗲 𝗵𝗲 𝘂𝗻𝗶𝗱𝗼 𝗲𝘅𝗶𝘁𝗼𝘀𝗮𝗺𝗲𝗻𝘁𝗲 𝗮𝗹 𝗴𝗿𝘂𝗽𝗼
╰───────────────╯`))
            .catch(err => m.reply(`⚡━━━━━━━━━━━━━━━⚡
❌ 𝗘𝗥𝗢𝗥 𝗖𝗥𝗜𝗧𝗜𝗖𝗢 ❌
⚡━━━━━━━━━━━━━━━⚡

╭─「 𝗗𝗘𝗧𝗔𝗟𝗘 」─╮
│ 𝗘𝗿𝗼𝗿 𝗮𝗹 𝘂𝗻𝗶𝗿𝗺𝗲 𝗮𝗹 𝗴𝗿𝘂𝗽𝗼
╰───────────────╯`));
    } else {
        let message = `⚡━━━━━━━━━━━━━━━⚡
📨 𝗦𝗢𝗟𝗜𝗖𝗜𝗧𝗨𝗗 𝗗𝗘 𝗜𝗡𝗚𝗥𝗘𝗦𝗢 📨
⚡━━━━━━━━━━━━━━━⚡

╭─「 𝗗𝗘𝗧𝗔𝗟𝗘 」─╮
│ 𝗘𝗡𝗟𝗔𝗖𝗘: ${text}
│ 𝗣𝗢𝗥: @${m.sender.split('@')[0]}
╰─────────────────╯`;
        await conn.sendMessage(`${suittag}` + '@s.whatsapp.net', { text: message, mentions: [m.sender] }, { quoted: m });
        m.reply(`⚡━━━━━━━━━━━━━━━⚡
📤 𝗦𝗢𝗟𝗜𝗖𝗜𝗧𝗨𝗗 𝗘𝗡𝗩𝗜𝗔𝗗𝗔 📤
⚡━━━━━━━━━━━━━━━⚡

╭─「 𝗘𝗦𝗧𝗔𝗗𝗢 」─╮
│ 𝗘𝗹 𝗹𝗶𝗻𝗸 𝗱𝗲𝗹 𝗴𝗿𝘂𝗽𝗼 𝗵𝗮 𝘀𝗶𝗱𝗼 𝗲𝗻𝘃𝗶𝗮𝗱𝗼
╰───────────────╯`, null, { mentions: [m.sender] });
    }
};

handler.help = ['invite'];
handler.tags = ['owner'];
handler.command = ['invite', 'join'];

export default handler;