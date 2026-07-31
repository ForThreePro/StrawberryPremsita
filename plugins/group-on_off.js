let handler = async (m, { conn, args, command, isOwner }) => {
  const setting = args[0]?.toLowerCase();
  const chatData = global.db.data.chats[m.chat];
  const botSettings = global.db.data.settings[conn.user.jid];

  const on = '✅';
  const off = '❌';

  // AGARRAR FOTO Y NOMBRE DEL GRUPO
  let pp;
  let groupName = await conn.getName(m.chat);
  try {
    pp = await conn.profilePictureUrl(m.chat, 'image');
  } catch {
    pp = 'https://files.evogb.win/We0JaW.jpg'; // default si no hay foto
  }

  const configList = `
*🍓 STRAWBERRY PREM 🍓*

*╭─「 PANEL DE CONTROL 」─╮*
│
│ *${chatData.welcome? on : off} Bienvenida*
│ *${chatData.antiLink? on : off} Anti Enlaces*
│ *${chatData.economy? on : off} Economia*
│ *${chatData.gacha? on : off} Gacha*
│ *${chatData.adminonly? on : off} Modo Admin*
│ *${chatData.reaction? on : off} Reacciones*
│ *${chatData.nsfw? on : off} NSFW*
│ *${chatData.alerts? on : off} Alertas*
│ *${chatData.notprefix? on : off} Sin Prefijo*
│ *${botSettings?.jadibotmd? on : off} SubBots*
│
*├─「 USO 」─*
│ *.${command} welcome on/off*
│ *.${command} antilink on/off*
*╰─────────────╯*`.trim();

  if (!setting) {
    return conn.sendMessage(m.chat, {
      image: { url: pp },
      caption: `*${groupName}*\n${configList}`,
      mentions: [m.sender]
    }, { quoted: m });
  }

  const status = command === 'on';
  const reply = (name) => conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: `
*🍓 SISTEMA ACTUALIZADO 🍓*

╭─「 REPORTE 」─╮
│ *FUNCION*: ${name}
│ *ESTADO*: ${status? '✅ ACTIVADO' : '❌ DESACTIVADO'}
╰──────────────╯`,
    mentions: [m.sender]
  }, { quoted: m });

  switch (setting) {
    case 'antilink': case 'antilinks': case 'antienlaces':
      chatData.antiLink = status; reply('Anti Enlaces'); break;

    case 'rpg': case 'economia':
      chatData.rpg = status; chatData.economy = status; reply('Economia'); break;

    case 'gacha':
      chatData.gacha = status; reply('Gacha'); break;

    case 'modoadmin': case 'adminonly': case 'onlyadmin':
      chatData.adminonly = status; reply('Modo Admin'); break;

    case 'nsfw':
      chatData.nsfw = status; reply('NSFW'); break;

    case 'bienvenida': case 'welcome':
      chatData.welcome = status; reply('Bienvenida'); break;

    case 'reaccion': case 'reaction':
      chatData.reaction = status; reply('Reacciones'); break;

    case 'alerts': case 'alertas':
      chatData.alerts = status; reply('Alertas'); break;

    case 'notprefix': case 'noprefix': case 'sinprefijo':
      chatData.notprefix = status; reply('Sin Prefijo'); break;

    case 'serbot': case 'jadibot': case 'subbots':
      if (!isOwner) return m.reply(`*🍓 STRAWBERRY PREM 🍓*

*⛔ ACCESO DENEGADO ⛔*

╭─「 SEGURIDAD 」─╮
│ *Solo el owner puede usar esto*
╰────────────────╯`);
      if (botSettings) { botSettings.jadibotmd = status; reply('SubBots'); }
      break;

    default:
      return conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: `*🍓 STRAWBERRY PREM 🍓*

*⚠️ ERROR ⚠️*

╭─「 DETALLE 」─╮
│ *Opcion no valida*
│ *Revisa el Panel de Control*
╰──────────────╯

${configList}`,
        mentions: [m.sender]
      }, { quoted: m });
  }
};

handler.help = ['on', 'off'];
handler.tags = ['group'];
handler.command = ['on', 'off'];
handler.admin = true;
handler.botAdmin = false;
export default handler