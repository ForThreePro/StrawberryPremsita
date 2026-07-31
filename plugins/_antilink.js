let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
    if (!m.isGroup) return 
    if (isAdmin || isOwner || m.fromMe || isROwner) return

    let chat = global.db.data.chats[m.chat];
    const user = `@${m.sender.split`@`[0]}`;
    const groupAdmins = participants.filter(p => p.admin);

    const isGroupLink = linkRegex.exec(m.text) || linkRegex1.exec(m.text);

    if (chat.antiLink && isGroupLink && !isAdmin) {
        // SI EL LINK ES DEL MISMO GRUPO NO HACE NADA
        if (isBotAdmin) {
            const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat).catch(() => "")}`;
            if (m.text.includes(linkThisGroup)) return !0;
        }

        // AVISO STRAWBERRY
        await conn.sendMessage(m.chat, { 
            text: `
*🍓 STRAWBERRY PREM 🍓*

*🚨 RADAR DE SEGURIDAD 🚨*

*DETECTADO*: Enlace externo
*GUERRERO*: ${user}
*ESTADO*: *Eliminando amenaza*

*── REGLAS ──*
*Los enlaces externos estan prohibidos*
*Protegemos este grupo*

> *"Aqui se respeta el huerto de fresas"* 🍓
`.trim(), 
            mentions: [m.sender] 
        }, { quoted: m });

        // SI NO ES ADMIN EL BOT
        if (!isBotAdmin) {
            return conn.sendMessage(m.chat, { 
                text: `
*🍓 STRAWBERRY PREM 🍓*

*⚠️ SISTEMA BLOQUEADO ⚠️*

*No tengo permisos para eliminar*
*Dame admin para activar mi poder*

*MENCION A ADMINS*
`.trim(), 
                mentions: groupAdmins.map(v => v.id) 
            }, { quoted: m });
        }

        // ELIMINAR Y KICK
        if (isBotAdmin) {
            await conn.sendMessage(m.chat, { delete: m.key });
            await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
            await conn.sendMessage(m.chat, {
                text: `*🍓 AMENAZA ELIMINADA 🍓*\n> ${user} fue expulsado del grupo`
            }, { mentions: [m.sender] })
        }
    }
    return !0;
}