import { WAMessageStubType } from '@whiskeysockets/baileys';
import fs from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

export async function before(m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType ||!m.isGroup) return true;
    const chat = global.db.data.chats[m.chat];
    if (!chat ||!chat.welcome) return true;
    const target = m.messageStubParameters?.[0];
    if (!target) return true;

    const userData = global.db.data.users[target] || {};
    const targetName = userData.name || await conn.getName(target) || `@${target.split('@')[0]}`;
    const actor = m.participant || m.key.participant || m.messageStubParameters?.[1] || null;

    let memberCount = participants.length;
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) memberCount++;
    if ([WAMessageStubType.GROUP_PARTICIPANT_REMOVE, WAMessageStubType.GROUP_PARTICIPANT_LEAVE].includes(m.messageStubType)) memberCount--;

    const EMOJIS = ['🍓','🍒','🍰','🧁','🍬','🍭','🍡','🍧','🍨','🍩','🎀','💖','✨']
    const e1 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    const e2 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]

    const actionText = {
        [WAMessageStubType.GROUP_PARTICIPANT_ADD]: actor? `*Reclutado por* @${actor.split('@')[0]}` : '*Ingreso al huerto*',
        [WAMessageStubType.GROUP_PARTICIPANT_REMOVE]: actor? `*Eliminado por* @${actor.split('@')[0]}` : '*Expulsado del huerto*',
        [WAMessageStubType.GROUP_PARTICIPANT_LEAVE]: '*Abandono el huerto*'
    };

    const format = (text) => {
        return text
      .replace(/@user/g, `@${target.split('@')[0]}`)
      .replace(/@name/g, targetName)
      .replace(/@group/g, groupMetadata.subject)
      .replace(/@desc/g, groupMetadata.desc?.toString() || '*Sin descripcion*')
      .replace(/%users/g, memberCount)
      .replace(/@action/g, actionText[m.messageStubType] || '')
      .replace(/@date/g, new Date().toLocaleString('es-PE'));
    };

    let ppUrl;
    try { ppUrl = await conn.profilePictureUrl(target, 'image'); }
    catch { ppUrl = 'https://files.evogb.win/INtgbw.jpg' }

    const defaultWelcome = `*${e1} NUEVA FRESITA LLEGO ${e1}*
*━━━━━━━━*

*ID*: @name
*GRUPO*: @group
*ESTADO*: @action
╭─「 ${e2} INFO 」─╮
│ *📜 Descripcion*: @desc
│ *👥 Miembros*: %users
│ *⚠️ Aviso*: Lee las reglas
╰─────────────────╯

> "Bienvenido al huerto. Comportate" ${e1}`;

    const defaultBye = `*${e1} FRESITA SE FUE ${e1}*
*━━━━━━━━*

*ID*: @name
*GRUPO*: @group

*ESTADO*: @action

╭─「 ${e2} REPORTE 」─╮
│ *👥 Miembros Actuales*: %users
│ *🕐 Salida*: @date
╰─────────────────╯

> "Se nos fue una fresita. Sigue el huerto" ${e1}`;

    const welcome = format(chat.welcomeText || defaultWelcome);
    const bye = format(chat.byeText || defaultBye);
    const mentions = [target];
    if (actor) mentions.push(actor);
    const context = { contextInfo: { mentionedJid: mentions, isForwarded: true } };

    // FUNCION ARREGLADA: MANDA MP3 MANUAL PARA QUE NO LO SILENCIE
    const sendAudioWelcome = async (audioPath) => {
        if (!fs.existsSync(audioPath)) return console.log('Audio no encontrado:', audioPath)
        try {
            const audioBuffer = fs.readFileSync(audioPath)
            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg', // MP3
                ptt: false, // MANUAL - CLAVE PARA QUE NO LO SILENCIE
                fileName: 'StrawBerry_Prem.mp3'
            })
        } catch(e) {
            console.log('Error al enviar audio:', e)
        }
    }

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        await conn.sendMessage(m.chat, { image: { url: ppUrl }, caption: welcome,...context });
        if (chat.welcomeAudio) await sendAudioWelcome(chat.welcomeAudio)
    }
    if ([WAMessageStubType.GROUP_PARTICIPANT_LEAVE, WAMessageStubType.GROUP_PARTICIPANT_REMOVE].includes(m.messageStubType)) {
        await conn.sendMessage(m.chat, { image: { url: ppUrl }, caption: bye,...context });
        if (chat.byeAudio) await sendAudioWelcome(chat.byeAudio)
    }
}