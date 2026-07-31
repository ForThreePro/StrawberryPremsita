import { getBotConfig } from '../lib/botconfig.js'

const handler = async (m, { conn, command }) => {
  try {
    const jid = (id) => id?.includes('@')? id : `${id}@s.whatsapp.net`
    let who =
      m.mentionedJid?.[0] ||
      m.msg?.contextInfo?.mentionedJid?.[0] ||
      m.quoted?.sender ||
      null

    if (!who) {
      return conn.reply(m.chat, `*🍓 STRAWBERRY PREM 🍓*

*⚠️ ERROR DE SISTEMA ⚠️*

╭─「 INSTRUCCION 」─╮
│ *Menciona o cita al usuario*
╰───────────────────╯`, m)
    }

    who = jid(who)

    const groupMetadata = await conn.groupMetadata(m.chat)
    const participant = groupMetadata.participants.find(
      p => jid(p.id || p.jid) === who
    )

    const isPromote = command === 'promote'
    const protectedOwners = global.owner.map(
      o => o[0] + '@s.whatsapp.net'
    )
    const targetName = await conn.getName(who)

    if (isPromote) {
      if (participant?.admin) {
        return conn.reply(m.chat, `*🍓 STRAWBERRY PREM 🍓*

*⚠️ AVISO ⚠️*

╭─「 ESTADO 」─╮
│ *@${who.split('@')[0]} ya es administrador*
╰───────────────╯`, m, { mentions: [who] })
      }

      await conn.groupParticipantsUpdate(m.chat, [who], 'promote')

      return conn.reply(m.chat, `*🍓 ASCENSO EJECUTADO 🍓*

╭─「 REPORTE 」─╮
│ *USUARIO*: @${who.split('@')[0]}
│ *NUEVO RANGO*: ADMINISTRADOR
│ *POR*: @${m.sender.split('@')[0]}
╰───────────────╯`, m, { mentions: [who, m.sender] })
    }

    // DEMOTE
    if (protectedOwners.includes(who)) {
      return conn.reply(m.chat, `*🍓 STRAWBERRY PREM 🍓*

*⛔ ACCESO DENEGADO ⛔*

╭─「 SEGURIDAD 」─╮
│ *No se puede degradar al owner*
╰──────────────────╯`, m)
    }

    if (!participant?.admin) {
      return conn.reply(m.chat, `*🍓 STRAWBERRY PREM 🍓*

*⚠️ AVISO ⚠️*

╭─「 ESTADO 」─╮
│ *@${who.split('@')[0]} no es administrador*
╰───────────────╯`, m, { mentions: [who] })
    }

    if (who === groupMetadata.owner) {
      return conn.reply(m.chat, `*🍓 STRAWBERRY PREM 🍓*

*⛔ ACCESO DENEGADO ⛔*

╭─「 SEGURIDAD 」─╮
│ *No se puede degradar al creador*
╰──────────────────╯`, m)
    }

    if (who === conn.user.jid) {
      return conn.reply(m.chat, `*🍓 STRAWBERRY PREM 🍓*

*⛔ ACCESO DENEGADO ⛔*

╭─「 SEGURIDAD 」─╮
│ *No puedo degradarme a mi mismo*
╰──────────────────╯`, m)
    }

    await conn.groupParticipantsUpdate(m.chat, [who], 'demote')

    return conn.reply(m.chat, `*🍓 DEGRADACION EJECUTADA 🍓*

╭─「 REPORTE 」─╮
│ *USUARIO*: @${who.split('@')[0]}
│ *NUEVO RANGO*: MIEMBRO
│ *POR*: @${m.sender.split('@')[0]}
╰───────────────╯`, m, { mentions: [who, m.sender] })

  } catch (e) {
    conn.reply(m.chat, `*🍓 STRAWBERRY PREM 🍓*

*❌ ERROR CRITICO ❌*

╭─「 DETALLE 」─╮
│ ${e.message}
╰───────────────╯`, m)
  }
}

handler.help = ['promote', 'demote']
handler.tags = ['group']
handler.command = ['promote', 'demote']
handler.admin = true
handler.botAdmin = true

export default handler