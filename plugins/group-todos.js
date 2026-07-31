const handler = async (m, { isOwner, isAdmin, conn, participants, args }) => {
  try {
    if (!(isAdmin || isOwner)) {
      global.dfail('admin', m, conn);
      return;
    }

    const customMessage = args.join(' ') || '⚡ Notificacion del Sistema';
    const groupMetadata = await conn.groupMetadata(m.chat).catch(() => ({ subject: 'Grupo', participants: [] }));
    const groupName = groupMetadata.subject;

    // LISTA COMPLETA DE BANDERAS
    const countryFlags = [
      { prefijo: '93', bandera: '🇦🇫' }, { prefijo: '355', bandera: '🇦🇱' }, { prefijo: '213', bandera: '🇩🇿' }, { prefijo: '376', bandera: '🇦🇩' }, { prefijo: '244', bandera: '🇦🇴' },
      { prefijo: '54', bandera: '🇦🇷' }, { prefijo: '374', bandera: '🇦🇲' }, { prefijo: '61', bandera: '🇦🇺' }, { prefijo: '43', bandera: '🇦🇹' }, { prefijo: '994', bandera: '🇦🇿' },
      { prefijo: '973', bandera: '🇧🇭' }, { prefijo: '880', bandera: '🇧🇩' }, { prefijo: '375', bandera: '🇧🇾' }, { prefijo: '32', bandera: '🇧🇪' }, { prefijo: '501', bandera: '🇧🇿' },
      { prefijo: '229', bandera: '🇧🇯' }, { prefijo: '975', bandera: '🇧🇹' }, { prefijo: '591', bandera: '🇧🇴' }, { prefijo: '387', bandera: '🇧🇦' }, { prefijo: '267', bandera: '🇧🇼' },
      { prefijo: '55', bandera: '🇧🇷' }, { prefijo: '359', bandera: '🇧🇬' }, { prefijo: '226', bandera: '🇧🇫' }, { prefijo: '257', bandera: '🇧🇮' }, { prefijo: '855', bandera: '🇰🇭' },
      { prefijo: '237', bandera: '🇨🇲' }, { prefijo: '1', bandera: '🇨🇦' }, { prefijo: '238', bandera: '🇨🇻' }, { prefijo: '56', bandera: '🇨🇱' }, { prefijo: '86', bandera: '🇨🇳' },
      { prefijo: '57', bandera: '🇨🇴' }, { prefijo: '269', bandera: '🇰🇲' }, { prefijo: '242', bandera: '🇨🇬' }, { prefijo: '506', bandera: '🇨🇷' }, { prefijo: '385', bandera: '🇭🇷' },
      { prefijo: '53', bandera: '🇨🇺' }, { prefijo: '357', bandera: '🇨🇾' }, { prefijo: '420', bandera: '🇨🇿' }, { prefijo: '45', bandera: '🇩🇰' }, { prefijo: '253', bandera: '🇩🇯' },
      { prefijo: '593', bandera: '🇪🇨' }, { prefijo: '20', bandera: '🇪🇬' }, { prefijo: '503', bandera: '🇸🇻' }, { prefijo: '240', bandera: '🇬🇶' }, { prefijo: '291', bandera: '🇪🇷' },
      { prefijo: '372', bandera: '🇪🇪' }, { prefijo: '268', bandera: '🇸🇿' }, { prefijo: '251', bandera: '🇪🇹' }, { prefijo: '679', bandera: '🇫🇯' }, { prefijo: '358', bandera: '🇫🇮' },
      { prefijo: '33', bandera: '🇫🇷' }, { prefijo: '241', bandera: '🇬🇦' }, { prefijo: '220', bandera: '🇬🇲' }, { prefijo: '995', bandera: '🇬🇪' }, { prefijo: '49', bandera: '🇩🇪' },
      { prefijo: '233', bandera: '🇬🇭' }, { prefijo: '30', bandera: '🇬🇷' }, { prefijo: '502', bandera: '🇬🇹' }, { prefijo: '224', bandera: '🇬🇳' }, { prefijo: '245', bandera: '🇬🇼' },
      { prefijo: '592', bandera: '🇬🇾' }, { prefijo: '509', bandera: '🇭🇹' }, { prefijo: '504', bandera: '🇭🇳' }, { prefijo: '36', bandera: '🇭🇺' }, { prefijo: '354', bandera: '🇮🇸' },
      { prefijo: '91', bandera: '🇮🇳' }, { prefijo: '62', bandera: '🇮🇩' }, { prefijo: '98', bandera: '🇮🇷' }, { prefijo: '964', bandera: '🇮🇶' }, { prefijo: '353', bandera: '🇮🇪' },
      { prefijo: '972', bandera: '🇮🇱' }, { prefijo: '39', bandera: '🇮🇹' }, { prefijo: '81', bandera: '🇯🇵' }, { prefijo: '962', bandera: '🇯🇴' }, { prefijo: '7', bandera: '🇰🇿' },
      { prefijo: '254', bandera: '🇰🇪' }, { prefijo: '965', bandera: '🇰🇼' }, { prefijo: '996', bandera: '🇰🇬' }, { prefijo: '856', bandera: '🇱🇦' }, { prefijo: '371', bandera: '🇱🇻' },
      { prefijo: '961', bandera: '🇱🇧' }, { prefijo: '266', bandera: '🇱🇸' }, { prefijo: '231', bandera: '🇱🇷' }, { prefijo: '218', bandera: '🇱🇾' }, { prefijo: '370', bandera: '🇱🇹' },
      { prefijo: '352', bandera: '🇱🇺' }, { prefijo: '261', bandera: '🇲🇬' }, { prefijo: '265', bandera: '🇲🇼' }, { prefijo: '60', bandera: '🇲🇾' }, { prefijo: '960', bandera: '🇲🇻' },
      { prefijo: '223', bandera: '🇲🇱' }, { prefijo: '356', bandera: '🇲🇹' }, { prefijo: '222', bandera: '🇲🇷' }, { prefijo: '230', bandera: '🇲🇺' }, { prefijo: '52', bandera: '🇲🇽' },
      { prefijo: '373', bandera: '🇲🇩' }, { prefijo: '976', bandera: '🇲🇳' }, { prefijo: '382', bandera: '🇲🇪' }, { prefijo: '212', bandera: '🇲🇦' }, { prefijo: '258', bandera: '🇲🇿' },
      { prefijo: '95', bandera: '🇲🇲' }, { prefijo: '264', bandera: '🇳🇦' }, { prefijo: '977', bandera: '🇳🇵' }, { prefijo: '31', bandera: '🇳🇱' }, { prefijo: '64', bandera: '🇳🇿' },
      { prefijo: '505', bandera: '🇳🇮' }, { prefijo: '227', bandera: '🇳🇪' }, { prefijo: '234', bandera: '🇳🇬' }, { prefijo: '850', bandera: '🇰🇵' }, { prefijo: '47', bandera: '🇳🇴' },
      { prefijo: '968', bandera: '🇴🇲' }, { prefijo: '92', bandera: '🇵🇰' }, { prefijo: '507', bandera: '🇵🇦' }, { prefijo: '675', bandera: '🇵🇬' }, { prefijo: '595', bandera: '🇵🇾' },
      { prefijo: '51', bandera: '🇵🇪' }, { prefijo: '63', bandera: '🇵🇭' }, { prefijo: '48', bandera: '🇵🇱' }, { prefijo: '351', bandera: '🇵🇹' }, { prefijo: '974', bandera: '🇶🇦' },
      { prefijo: '40', bandera: '🇷🇴' }, { prefijo: '7', bandera: '🇷🇺' }, { prefijo: '250', bandera: '🇷🇼' }, { prefijo: '966', bandera: '🇸🇦' }, { prefijo: '221', bandera: '🇸🇳' },
      { prefijo: '381', bandera: '🇷🇸' }, { prefijo: '248', bandera: '🇸🇨' }, { prefijo: '232', bandera: '🇸🇱' }, { prefijo: '65', bandera: '🇸🇬' }, { prefijo: '421', bandera: '🇸🇰' },
      { prefijo: '386', bandera: '🇸🇮' }, { prefijo: '677', bandera: '🇸🇧' }, { prefijo: '252', bandera: '🇸🇴' }, { prefijo: '27', bandera: '🇿🇦' }, { prefijo: '82', bandera: '🇰🇷' },
      { prefijo: '211', bandera: '🇸' }, { prefijo: '34', bandera: '🇪🇸' }, { prefijo: '94', bandera: '🇱🇰' }, { prefijo: '249', bandera: '🇸🇩' }, { prefijo: '597', bandera: '🇸🇷' },
      { prefijo: '46', bandera: '🇸🇪' }, { prefijo: '41', bandera: '🇨🇭' }, { prefijo: '963', bandera: '🇸🇾' }, { prefijo: '886', bandera: '🇹🇼' }, { prefijo: '992', bandera: '🇹🇯' },
      { prefijo: '255', bandera: '🇹🇿' }, { prefijo: '66', bandera: '🇹🇭' }, { prefijo: '228', bandera: '🇹🇬' }, { prefijo: '676', bandera: '🇹🇴' }, { prefijo: '216', bandera: '🇹🇳' },
      { prefijo: '90', bandera: '🇹🇷' }, { prefijo: '993', bandera: '🇹🇲' }, { prefijo: '256', bandera: '🇺🇬' }, { prefijo: '380', bandera: '🇺🇦' }, { prefijo: '971', bandera: '🇦🇪' },
      { prefijo: '44', bandera: '🇬🇧' }, { prefijo: '1', bandera: '🇺🇸' }, { prefijo: '598', bandera: '🇺🇾' }, { prefijo: '998', bandera: '🇺🇿' }, { prefijo: '58', bandera: '🇻🇪' },
      { prefijo: '84', bandera: '🇻🇳' }, { prefijo: '967', bandera: '🇾🇪' }, { prefijo: '260', bandera: '🇿🇲' }, { prefijo: '263', bandera: '🇿🇼' }
    ];

    const getCountryFlag = (mem) => {
      const rawJid = mem.jid || mem.id || '';
      const phoneNumber = rawJid.split('@')[0];
      const match3 = countryFlags.find(c => c.prefijo.length === 3 && phoneNumber.startsWith(c.prefijo));
      if (match3) return match3.bandera;
      const match2 = countryFlags.find(c => c.prefijo.length === 2 && phoneNumber.startsWith(c.prefijo));
      if (match2) return match2.bandera;
      const match1 = countryFlags.find(c => c.prefijo.length === 1 && phoneNumber.startsWith(c.prefijo));
      if (match1) return match1.bandera;
      return '🚩';
    };

    const grouped = {};
    for (const mem of participants) {
      const flag = getCountryFlag(mem);
      if (!grouped[flag]) grouped[flag] = [];
      grouped[flag].push(mem);
    }

    const orderedFlags = countryFlags.map(c => c.bandera).concat(['🚩']);

    let messageText = `*🔥 INVOCACION DEL DRAGON 🔥*

*╭─「 🐉 NOTIFICACION GENERAL 」─╮*
│ *GRUPO*: ${groupName}
*╰───────────────────────╯*

*⚡ MENSAJE KI ⚡*
*${customMessage}*

> *"Con el poder del Shunkanido los convoco a todos"*

*──🐉 INTEGRANTES ──*
*👥 Total*: ${participants.length} guerreros

*──🌍 LISTA POR NACION ──*
`

    for (const flag of orderedFlags) {
      if (grouped[flag]) {
        for (const mem of grouped[flag]) {
          const realJid = mem.jid || mem.id || '';
          const displayNumber = realJid.split('@')[0];
          messageText += `│ ${flag} @${displayNumber}\n`;
        }
      }
    }

    messageText += `
*╭─「 🌟 SON GOKU PREM 」─╮*
│ *Creador*: Whois Yallico
│ *Version*: 4.0 Super Saiyajin
*╰─────────────────╯*

> *"El ki de todos esta conectado"* ⚡`

    // TU FOTO
    const img = 'https://files.evogb.win/jgBvm8.jpg'

    await conn.sendMessage(m.chat, {
      image: { url: img },
      caption: messageText,
      mentions: participants.map(a => a.jid || a.id)
    }, { quoted: m });

  } catch (error) {
    console.error("[ERROR EN GOKU PREM]:", error);
    conn.reply(m.chat, `*❌ ERROR CRITICO ❌*
*━━━━━━━━━━━━━━━*

╭─「 💥 DETALLE 」─╮
│ *Ocurrio un error al invocar*
│ *Verifica los permisos*
╰─────────────╯`, m);
  }
};

handler.help = ['todos <texto>'];
handler.tags = ['group'];
handler.command = /^(todos|invocar|tagall)$/i;
handler.admin = true;
handler.group = true;

export default handler