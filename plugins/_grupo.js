let handler = async (m, { conn, isAdmin, command }) => {
    if (!m.isGroup) return m.reply(`*🍓 BOT STRAWBERRY*\n\n❌ Este comando solo funciona en grupos`)
    if (!isAdmin) return m.reply(`*🍓 BOT STRAWBERRY*\n\n❌ Solo admins pueden usar este comando`)

    try {
        if(command === 'abrir' || command === 'open'){
            await conn.groupSettingUpdate(m.chat, 'not_announcement')
            await conn.sendMessage(m.chat, { react: { text: '🍓', key: m.key } })

            let txt = `*🍓 BOT STRAWBERRY*

╭─「 ⚡ GRUPO LIBERADO 」─╮
│
│ *ESTADO:* 🔓 Abierto
│ *SABOR:* Dulce
│ *ADMIN:* @${m.sender.split('@')[0]}
│
│ *Todos pueden hablar ahora*
╰────────────────────────╯

> *"¡A disfrutar la fresa!"*`

            await conn.reply(m.chat, txt, m, { mentions: [m.sender] })

        } else if(command === 'cerrar' || command === 'close'){
            await conn.groupSettingUpdate(m.chat, 'announcement')
            await conn.sendMessage(m.chat, { react: { text: '🔒', key: m.key } })

            let txt = `*🍓 BOT STRAWBERRY*

╭─「 🔒 GRUPO BLOQUEADO 」─╮
│
│ *ESTADO:* 🔒 Cerrado
│ *SABOR:* Solo Admins
│ *ADMIN:* @${m.sender.split('@')[0]}
│
│ *Solo admins pueden hablar*
╰─────────────────────────╯

> *"Fresa en modo privado"*`

            await conn.reply(m.chat, txt, m, { mentions: [m.sender] })
        }
    } catch (e) {
        if(e.message.includes('not-admin')) {
            return m.reply(`*🍓 BOT STRAWBERRY*\n\n❌ Necesito ser admin para hacer eso`)
        }
        await m.reply(`❌ ERROR: ${e.message}`)
    }
}

handler.help = ['abrir', 'cerrar']
handler.tags = ['group']
handler.command = ['abrir', 'cerrar', 'open', 'close']
handler.admin = true
export default handler