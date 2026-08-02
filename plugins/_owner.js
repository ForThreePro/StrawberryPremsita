let handler = async (m, { conn }) => {
    let vcard = `BEGIN:VCARD
VERSION:3.0
N:;Andreitap;;;
FN:Andreitap
ORG:𝐒𝐓𝐑𝐀𝐖𝐁𝐄𝐑𝐘 𝐁𝐎𝐓
TEL;type=CELL;type=VOICE;waid=573215829404:+57 321 582 9404
END:VCARD`

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: 'Andreitap - STRAWBERRY BOT',
            contacts: [{ vcard }]
        }
    }, { quoted: m })

    await conn.reply(m.chat, `🍓 *𝐁𝐎𝐓 𝐒𝐓𝐑𝐀𝐖𝐁𝐄𝐑𝐑𝐘*

╭─「 👑 𝐂𝐑𝐄𝐀𝐃𝐎𝐑𝐀 」─╮
│
│ *𝐍𝐎𝐌𝐁𝐑𝐄:* 𝐀𝐧𝐝𝐫𝐞𝐢𝐭𝐚𝐩
│ *𝐍𝐔𝐌𝐄𝐑𝐎:* +57 321 582 9404
│ *𝐁𝐎𝐓:* 𝐒𝐓𝐑𝐀𝐖𝐁𝐄𝐑𝐘 𝐁𝐎𝐓
│
╰─────────────────╯

> 𝐃𝐮𝐥𝐜𝐞 𝐜𝐨𝐦𝐨 𝐮𝐧𝐚 𝐟𝐫𝐞𝐬𝐚 🍓💕`, m)
}

handler.help = ['owner']
handler.tags = ['info']
handler.command = ['owner']
export default handler