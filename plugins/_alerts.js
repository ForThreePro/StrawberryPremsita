let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import fs from 'fs'
import path from 'path'
import { getBotConfig } from '../lib/botconfig.js'

const lidCache = new Map()
let handler = m => m

handler.before = async function (m, { conn }) {
    if (!m.messageStubType ||!m.isGroup) return

    let chat = global.db.data.chats[m.chat]
    let userss = m.messageStubParameters?.[0]
    if (!userss) return

    const realSenderRaw = await resolveLidToRealJid(m?.sender, conn, m?.chat)
    const realSender = realSenderRaw?.includes('@')? realSenderRaw : null

    const userTag = `@${userss.split('@')[0]}`
    const adminTag = realSender? `@${realSender.split('@')[0]}` : 'SYSTEM'

    const mentions = [userss]
    if (realSender) mentions.push(realSender)

    const context = {
        contextInfo: {
            mentionedJid: mentions,
            isForwarded: true,
            forwardingScore: 999
        }
    }

    // IMAGEN DBZ FIJA
    let banner = 'https://files.evogb.win/INtgbw.jpg'

    // DISEÑO DBZ PROMOTE
    const admingp = `
╔═══「 🔥 𝐓𝐑𝐀𝐍𝐒𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎𝐍 」═══╗
║
║ 𝗚𝗨𝗘𝗥𝗥𝗘𝗥𝗢 : ${userTag}
║ 𝗘𝗦𝗧𝗔𝗗𝗢 : ⚡ SUPER SAIYAJIN
║ 𝗢𝗧𝗢𝗥𝗚𝗔𝗗𝗢 𝗣𝗢𝗥 : ${adminTag}
║
╠═══「 𝗣𝗢𝗗𝗘𝗥𝗘𝗦 𝗗𝗘𝗦𝗕𝗟𝗢𝗤𝗨𝗘𝗔𝗗𝗢𝗦 」═══╣
║ [✓] Expulsar / Promover
║ [✓] Editar Info Grupo
║ [✓] Cambiar Config
║ [✓] Modo Anuncios
╚══════════════════════╝

> 𝙲𝚘𝚗 𝚐𝚛𝚊𝚗 𝚙𝚘𝚍𝚎𝚛 𝚟𝚒𝚎𝚗𝚎 𝚐𝚛𝚊𝚗 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚊𝚋𝚒𝚕𝚒𝚍𝚊𝚍 💥
`.trim()

    // DISEÑO DBZ DEMOTE
    const noadmingp = `
╔═══「 ❄️ 𝐏𝐎𝐃𝐄𝐑 𝐑𝐄𝐕𝐎𝐂𝐀𝐃𝐎 」═══╗
║
║ 𝗚𝗨𝗘𝗥𝗥𝗘𝗥𝗢 : ${userTag}
║ 𝗘𝗦𝗧𝗔𝗗𝗢 : 🔒 RANGO REVOCADO
║ 𝗣𝗢𝗥 : ${adminTag}
║
╠═══「 𝗔𝗖𝗘𝗦𝗢 𝗕𝗟𝗢𝗤𝗨𝗘𝗔𝗗𝗢 」═══╣
║ [✗] Sin permisos de admin
║ [✗] Comandos bloqueados
║ [✗] Nivel: Guerrero Z
╚══════════════╝

> 𝚂𝚒𝚗 𝚊𝚞𝚛𝚊, 𝚜𝚒𝚗 𝚙𝚘𝚍𝚎𝚛 ⚡
`.trim()

    // LIMPIAR SESSION SI KICKEAN BOT
    if (chat.detect && m.messageStubType == 2) {
        const uniqid = (m.isGroup? m.chat : m.sender).split('@')[0]
        const sessionPath = `./sessions/`
        try {
            for (const file of await fs.readdir(sessionPath)) {
                if (file.includes(uniqid)) {
                    await fs.unlink(path.join(sessionPath, file))
                }
            }
        } catch {}
    }

    // PROMOTE
    if (chat.alerts && m.messageStubType == 29) {
        await conn.sendMessage(m.chat, {
            image: { url: banner },
            caption: admingp,
      ...context
        }, { quoted: null })
        return
    }

    // DEMOTE
    if (chat.alerts && m.messageStubType == 30) {
        await conn.sendMessage(m.chat, {
            image: { url: banner },
            caption: noadmingp,
      ...context
        }, { quoted: null })
        return
    }

    if (m.messageStubType == 2) return
}

export default handler

async function resolveLidToRealJid(lid, conn, groupChatId, maxRetries = 3, retryDelay = 60000) {
    const inputJid = lid?.toString?.() || ''
    if (!inputJid.endsWith("@lid") ||!groupChatId?.endsWith("@g.us")) {
        return inputJid.includes("@")? inputJid : `${inputJid}@s.whatsapp.net`
    }

    if (lidCache.has(inputJid)) {
        return lidCache.get(inputJid)
    }

    const lidToFind = inputJid.split("@")[0]
    let attempts = 0

    while (attempts < maxRetries) {
        try {
            const metadata = await conn?.groupMetadata(groupChatId)
            if (!metadata?.participants) throw new Error()

            for (const participant of metadata.participants) {
                try {
                    if (!participant?.jid) continue
                    const contactDetails = await conn?.onWhatsApp(participant.jid)
                    if (!contactDetails?.[0]?.lid) continue

                    const possibleLid = contactDetails[0].lid.split("@")[0]
                    if (possibleLid === lidToFind) {
                        lidCache.set(inputJid, participant.jid)
                        return participant.jid
                    }
                } catch {}
            }
            lidCache.set(inputJid, inputJid)
            return inputJid
        } catch {
            if (++attempts >= maxRetries) {
                lidCache.set(inputJid, inputJid)
                return inputJid
            }
            await new Promise(r => setTimeout(r, retryDelay))
        }
    }
    return inputJid
}