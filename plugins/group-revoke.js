let handler = async (m, { conn }) => {
  try {
    const grupoID = m.chat

    await conn.groupRevokeInvite(grupoID)

    const nuevoEnlace = await conn.groupInviteCode(grupoID)
    const enlaceCompleto = 'https://chat.whatsapp.com/' + nuevoEnlace

    await conn.reply(m.sender, 
`*🍓 STRAWBERRY PREM 🍓*

╭─「 REPORTE DE SEGURIDAD 」─╮
│ *ENLACE ANTERIOR*: Revocado
│ *NUEVO ENLACE*: ${enlaceCompleto}
│ *ESTADO*: Grupo Seguro
╰────────────────────────────╯

> "El enlace anterior fue destruido"` , 
      m, { detectLink: true })

    await conn.reply(m.chat, `*🍓 ENLACE RESTABLECIDO 🍓*

╭─「 ADVERTENCIA 」─╮
│ *El enlace anterior ya no funciona*
│ *Solo el nuevo enlace sirve*
│ *Se bloqueo el acceso viejo*
╰──────────────────╯`, m)

  } catch (error) {
    console.error(error)
    await m.reply(`*🍓 STRAWBERRY PREM 🍓*

*❌ ERROR CRITICO ❌*

╭─「 DETALLE 」─╮
│ ${error.message}
╰──────────────╯

╭─「 SOLUCION 」─╮
│ *Verifica que el bot sea admin*
│ *Necesita permisos para cambiar el enlace*
╰────────────────╯`)
  }
}

handler.help = ['revoke']
handler.tags = ['group']
handler.command = ['revoke', 'restablecer']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler