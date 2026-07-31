import { WAMessageStubType } from '@whiskeysockets/baileys';

export async function before(m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType ||!m.isGroup) return true;

    const chat = global.db.data.chats[m.chat];
    if (!chat.welcome) return true;

    const target = m.messageStubParameters?.[0];
    if (!target) return true;

    const userData = global.db.data.users[target] || {};
    const targetName = userData.name || await conn.getName(target) || `@${target.split('@')[0]}`;

    const actor = m.participant || m.key.participant || m.messageStubParameters?.[1] || null;

    let memberCount = participants.length;
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) memberCount++;
    if ([WAMessageStubType.GROUP_PARTICIPANT_REMOVE, WAMessageStubType.GROUP_PARTICIPANT_LEAVE].includes(m.messageStubType)) memberCount--;

    // Emojis random para que cambien
    const EMOJIS = ['🔥','⚡','💥','🐉','🌟','💫','🌙','☄️','🌈','👑','💀','⚔️','🛡️']
    const e1 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    const e2 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]

    const actionText = {
        [WAMessageStubType.GROUP_PARTICIPANT_ADD]:
            actor? `*Reclutado por* @${actor.split('@')[0]}` : '*Ingreso al sistema*',

        [WAMessageStubType.GROUP_PARTICIPANT_REMOVE]:
            actor? `*Eliminado por* @${actor.split('@')[0]}` : '*Expulsado del sistema*',

        [WAMessageStubType.GROUP_PARTICIPANT_LEAVE]:
            '*Abandono el sistema*'
    };

    const format = (text) => {
        return text
       .replace('@user', `@${target.split('@')[0]}`)
       .replace('@name', targetName)
       .replace('@group', groupMetadata.subject)
       .replace('@desc', groupMetadata.desc?.toString() || '*Sin descripcion*')
       .replace('%users', memberCount)
       .replace('@action', actionText[m.messageStubType] || '')
       .replace('@date', new Date().toLocaleString('es-PE'));
    };

    // DETECTAR SI TIENE FOTO O NO
    let ppUrl;
    try {
        ppUrl = await conn.profilePictureUrl(target, 'image');
    } catch {
        // Si no tiene foto, usa banner de Goku
        ppUrl = 'https://files.evogb.win/INtgbw.jpg'
    }

    const welcome = format(`
*${e1} NUEVO GUERRERO DETECTADO ${e1}*
*━━━━━━━━*

*ID*: @name
*GRUPO*: @group

*ESTADO*: @action

╭─「 ${e2} INFO DEL SISTEMA 」─╮
│ *📜 Desc*: @desc
│ *👥 Miembros*: %users
│ *⚠️ Aviso*: Lee las reglas o ban
╰───────────────────────╯

> "Bienvenido a la red. No la cagues" ${e1}
`.trim());

    const bye = format(`
*${e1} GUERRERO DADO DE BAJA ${e1}*
*━━━━━━━━━━━━━━━━*

*ID*: @name
*GRUPO*: @group

*ESTADO*: @action

╭─「 ${e2} REPORTE 」─╮
│ *👥 Miembros Actuales*: %users
│ *🕐 Salida*: @date
╰────────────────╯

> "Un soldado menos. El sistema sigue" ${e1}
`.trim());

    const mentions = [target];
    if (actor) mentions.push(actor);

    const context = {
        contextInfo: {
            mentionedJid: mentions,
            isForwarded: true
        }
    };

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        await conn.sendMessage(m.chat, {
            image: { url: ppUrl },
            caption: welcome,
       ...context
        });
    }

    if ([WAMessageStubType.GROUP_PARTICIPANT_LEAVE, WAMessageStubType.GROUP_PARTICIPANT_REMOVE].includes(m.messageStubType)) {
        await conn.sendMessage(m.chat, {
            image: { url: ppUrl },
            caption: bye,
       ...context
        });
    }
}