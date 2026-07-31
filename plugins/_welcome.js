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

    const EMOJIS = ['🔥','⚡','💥','🐉','🌟','💫','🌙','☄️','🌈','👑','💀','⚔️','🛡️']
    const e1 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    const e2 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]

    const actionText = {
        [WAMessageStubType.GROUP_PARTICIPANT_ADD]: actor? `*Reclutado por* @${actor.split('@')[0]}` : '*Ingreso al sistema*',
        [WAMessageStubType.GROUP_PARTICIPANT_REMOVE]: actor? `*Eliminado por* @${actor.split('@')[0]}` : '*Expulsado del sistema*',
        [WAMessageStubType.GROUP_PARTICIPANT_LEAVE]: '*Abandono el sistema*'
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

    const defaultWelcome = `*${e1} NUEVO GUERRERO DETECTADO ${e1}*\n*━━━━━━━━*\n\n*ID*: @name\n*GRUPO*: @group\n\n*ESTADO*: @action\n╭─「 ${e2} INFO DEL SISTEMA 」─╮\n│ *📜 Desc*: @desc\n│ *👥 Miembros*: %users\n│ *⚠️ Aviso*: Lee las reglas o ban\n╰───────────────────────╯\n\n> "Bienvenido a la red. No la cagues" ${e1}`;

    const defaultBye = `*${e1} GUERRERO DADO DE BAJA ${e1}*\n*━━━━━━━━*\n\n*ID*: @name\n*GRUPO*: @group\n\n*ESTADO*: @action\n\n╭─「 ${e2} REPORTE 」─╮\n│ *👥 Miembros Actuales*: %users\n│ *🕐 Salida*: @date\n╰────────────────╯\n\n> "Un soldado menos. El sistema sigue" ${e1}`;

    const welcome = format(chat.welcomeText || defaultWelcome);
    const bye = format(chat.byeText || defaultBye);

    const mentions = [target];
    if (actor) mentions.push(actor);
    const context = { contextInfo: { mentionedJid: mentions, isForwarded: true } };

    // FUNCION ARREGLADA - MANDA AUDIO COMO BUFFER
    const sendAudioWelcome = async (audioPath) => {
        if (!fs.existsSync(audioPath)) return console.log('Audio no encontrado:', audioPath)

        let output = audioPath.replace(/\.(mp3|m4a|wav|ogg)$/, '.ogg')
        try {
            // Convierte a ogg opus
            await execAsync(`ffmpeg -y -i "${audioPath}" -vn -ar 44100 -ac 2 -b:a 128k -c:a libopus "${output}"`)

            // Lee como buffer y manda - ESTO HACE QUE SI SUENE
            const audioBuffer = fs.readFileSync(output)

            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: 'audio/ogg; codecs=opus',
                ptt: false, // MANUAL - NO AUTOMATICO
                fileName: 'Sistema_Audio.ogg'
            })

            fs.unlinkSync(output)
        } catch(e) {
            console.log('Error en audio:', e)
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