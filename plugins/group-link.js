import { getBotConfig } from '../lib/botconfig.js'

let linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;

let handler = async (m, { conn, text, isOwner }) => {
  const botname = getBotConfig(conn, 'botname')

    if (!text) return m.reply(`*🍓 STRAWBERRY PREM 🍓*

*⚠️ ERROR DE SISTEMA ⚠️*

╭─「 INSTRUCCION 」─╮
│ *Debes enviar una invitacion para que*
│ *${botname}* *se una al grupo*
╰───────────────────╯`);

    let [_, code] = text.match(linkRegex) || [];

    if (!code) return m.reply(`*🍓 STRAWBERRY PREM 🍓*

*❌ ERROR ❌*

╭─「 VALIDACION 」─╮
│ *Enlace de invitacion no valido*
╰───────────────────╯`);

    if (isOwner) {
        await conn.groupAcceptInvite(code)
            .then(res => m.reply(`*🍓 ACCESO CONCEDIDO 🍓*

╭─「 REPORTE 」─╮
│ *Me he unido exitosamente al grupo*
╰───────────────╯`))
            .catch(err => m.reply(`*🍓 STRAWBERRY PREM 🍓*

*❌ ERROR CRITICO ❌*

╭─「 DETALLE 」─╮
│ *Error al unirme al grupo*
╰───────────────╯`));
    } else {
        let message = `*🍓 SOLICITUD DE INGRESO 🍓*

╭─「 DETALLE 」─╮
│ *ENLACE*: ${text}
│ *POR*: @${m.sender.split('@')[0]}
╰─────────────────╯`;
        await conn.sendMessage(`${global.owner[0][0]}` + '@s.whatsapp.net', { text: message, mentions: [m.sender] }, { quoted: m });
        m.reply(`*🍓 SOLICITUD ENVIADA 🍓*

╭─「 ESTADO 」─╮
│ *El link del grupo ha sido enviado*
╰───────────────╯`, null, { mentions: [m.sender] });
    }
};

handler.help = ['invite'];
handler.tags = ['owner'];
handler.command = ['invite', 'join'];

export default handler;