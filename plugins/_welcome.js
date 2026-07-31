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

    const EMOJIS = ['🐉','💥','⚡','🔥','🌟','💪','🥋','☁️','🍡','💫']
    const e1 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    const e2 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]

    const actionText = {
        [WAMessageStubType.GROUP_PARTICIPANT_ADD]: actor? `*Teletransportado por* @${actor.split('@')[0]}` : '*Llegó con Genkidama*',
        [WAMessageStubType.GROUP_PARTICIPANT_REMOVE]: actor? `*Expulsado por* @${actor.split('@')[0]}` : '*Se fue volando*',
        [WAMessageStubType.GROUP_PARTICIPANT_LEAVE]: '*Usó la técnica de la retirada*'
    };

    const format = (text) => text
.replace(/@user/g, `@${target.split('@')[0]}`)
.replace(/@name/g, targetName)
.replace(/@group/g, groupMetadata.subject)
.replace(/@desc/g, groupMetadata.desc?.toString() || '*No hay descripción de Kami-sama*')
.replace(/%users/gu, memberCount)
.replace(/@action/g, actionText[m.messageStubType] || '')
.replace(/@date/g, new Date().toLocaleString('es-PE'));

    let ppUrl;
    try { ppUrl = await conn.profilePictureUrl(target, 'image'); }
    catch { ppUrl = 'https://i.imgur.com/8QZ9mXa.jpg' } // img goku default

    const defaultWelcome = `*${e1} NUEVO GUERRERO Z LLEGÓ ${e1}*\n*━━━━━━━━━━━━━━━━━━*\n\n*Nombre*: @name\n*Nivel de Poder*: +9000\n*Grupo*: @group\n*Estado*: @action\n*╭─「 ${e2} RADAR DEL DRAGÓN 」─╮*\n*│* *🐉 Miembros*: %users\n*│* *⚡ Regla*: Entrena o muere\n*╰────────────────────╯*\n\n> "¡Bienvenido a la Tierra! ¡Necesitamos tu poder!" ${e1}`;

    const defaultBye = `*${e1} UN GUERRERO CAYÓ ${e1}*\n*━━━━━━━━━━━━━━━━━━*\n\n*Nombre*: @name\n*Grupo*: @group\n*Estado*: @action\n\n*╭─「 ${e2} REPORTE 」─╮*\n*│* *🐉 Miembros*: %users\n*╰────────────────────╯*\n\n> "¡Vuelve más fuerte! ¡Te esperamos para la batalla!" ${e1}`;

    const welcome = format(chat.welcomeText || defaultWelcome);
    const bye = format(chat.byeText || defaultBye);
    const mentions = [target];
    if (actor) mentions.push(actor);
    const context = { contextInfo: { mentionedJid: mentions, isForwarded: true } };

    // FUNCION AUDIO SIN LIMITE - PODER KAIOKEN
    const sendAudioWelcome = async (audioPath) => {
        if (!fs.existsSync(audioPath)) return console.log('Audio no encontrado:', audioPath)
        let output = audioPath.replace('.mp3', '.ogg')
        try {
            await execAsync(`ffmpeg -i "${audioPath}" -vn -ar 44100 -ac 2 -b:a 128k "${output}"`)

            await conn.sendMessage(m.chat, {
                audio: { url: output },
                mimetype: 'audio/ogg; codecs=opus',
                ptt: false, // SIN LIMITE PARA GRITAR KAMEHAMEHA
                fileName: 'Son_Goku_Bot.ogg'
            })
            fs.unlinkSync(output)
        } catch(e) {
            console.log('Error al convertir audio:', e)
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