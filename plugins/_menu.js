
import moment from 'moment-timezone'
import os from 'os'
moment.locale('es') // fecha en español

const CATEGORY_META = {
config: 'CONFIG',
main: 'MAIN',
tools: 'TOOLS',
owner: 'OWNER',
sorteos: 'SORTEOS',
fun: 'FUN',
joda: 'JODA',
ff: 'FF',
buscadores: 'SEARCH',
descargas: 'DOWNLOADER',
grupo: 'GRUPOS',
grupos: 'GRUPO',
gacha: 'GROUP',
ia: 'IA',
info: 'INFO',
sticker: 'STICKER',
}

// Emojis random para que cambien cada.menu
const EMOJIS_RANDOM = ['🔥','⚡','💥','🐉','🌟','💫','🌙','☄️','🌈','🍓','👑','💀','⚔️','🛡️','🌌']

let handler = async (m, { conn }) => {
try {
await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } })

// Agarrar emojis random para las secciones
const e1 = EMOJIS_RANDOM[Math.floor(Math.random() * EMOJIS_RANDOM.length)]
const e2 = EMOJIS_RANDOM[Math.floor(Math.random() * EMOJIS_RANDOM.length)]
const e3 = EMOJIS_RANDOM[Math.floor(Math.random() * EMOJIS_RANDOM.length)]
const e4 = EMOJIS_RANDOM[Math.floor(Math.random() * EMOJIS_RANDOM.length)]
const e5 = EMOJIS_RANDOM[Math.floor(Math.random() * EMOJIS_RANDOM.length)]

const fecha = moment.tz('America/Lima').format('dddd')
const fecha2 = moment.tz('America/Lima').format('DD [de] MMMM [de] YYYY')
const hora = moment.tz('America/Lima').format('hh:mm:ss a')
const uptime = process.uptime()
const horas = Math.floor(uptime / 3600)
const minutos = Math.floor((uptime % 3600) / 60)
const segundos = Math.floor(uptime % 60)
const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
const totalram = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
const pluginsCount = Object.values(global.plugins || {}).filter(p =>!p?.disabled).length
const totalUsers = Object.keys(global.db.data.users || {}).length

const byTag = {}
for (const plugin of Object.values(global.plugins || {})) {
  if (plugin.disabled) continue
  const tags = Array.isArray(plugin.tags)? plugin.tags : (plugin.tags? [plugin.tags] : [])
  const helps = Array.isArray(plugin.help)? plugin.help : (plugin.help? [plugin.help] : [])
  for (const tag of tags) {
    if (!CATEGORY_META[tag]) continue
    if (!byTag[tag]) byTag[tag] = new Set()
    for (const h of helps) if (typeof h === 'string' && h.trim()) byTag[tag].add(h.trim())
  }
}

const userName = m.pushName || 'Usuario'
const IMG_MENU = 'https://files.evogb.win/INtgbw.jpg'

let menuTexto = `*${e1} SON GOKU PREM ${e1}*

⤷ *SYSTEM*: v3.0 DBZ
*ONLINE*: ${horas}h ${minutos}m ${segundos}s

*${e2} USUARIO ${e2}*
*Nombre*: @${userName}
*Estado*: "Conectado. Listo para dominar"

*${e3} ESTADISTICAS ${e3}*
*👥 Usuarios*: ${totalUsers}
*📜 Comandos*: ${pluginsCount}
*💾 RAM*: ${ram}mb
*🌐 Servidor*: ${totalram}gb

*${e4} SISTEMA ${e4}*
*📅 Dia*: ${fecha}
*📆 Fecha*: ${fecha2}
*🕐 Hora*: ${hora}
*📡 Ping*: ${Math.round(performance.now())}ms

`

for (const tag of Object.keys(CATEGORY_META)) {
  const set = byTag[tag]
  if (!set || set.size === 0) continue
  const cmds = [...set].sort()

  let icono = e5 // emoji random para cada categoria
  if(tag === 'config') icono = '⚙️'
  if(tag === 'owner') icono = '👑'
  if(tag === 'fun') icono = '😈'
  if(tag === 'ff') icono = '🔫'
  if(tag === 'buscadores') icono = '🔍'
  if(tag === 'descargas') icono = '📥'
  if(tag === 'grupo') icono = '⚔️'
  if(tag === 'grupos') icono = '🛡️'
  if(tag === 'gacha') icono = '👥'
  if(tag === 'ia') icono = '🤖'
  if(tag === 'info') icono = 'ℹ️'
  if(tag === 'sticker') icono = '🎨'

  menuTexto += `\n*${icono} ${CATEGORY_META[tag]} ${icono}*\n`
  menuTexto += cmds.map(c => `*${icono}.${c}*`).join('\n') + '\n'
}

menuTexto += `
*━━━━━━━━*
*BOT*: SON GOKU PREM
*CREADOR*: Whois Yalli co
*VERSION*: 3.0 DBZ Masculino
*WEB*: github.com

> "Conectado al sistema. Domina o muere" ${e1}
*━━━━━━━━*`

await conn.sendMessage(m.chat, {
  image: { url: IMG_MENU },
  caption: menuTexto.trim(),
  mentions: [m.sender]
}, { quoted: m })

} catch (e) {
await conn.sendMessage(m.chat, { text: `*❌ SYSTEM ERROR*: ${e.message}` }, { quoted: m })
}
}

handler.help = ['menu']
handler.tags = ['info']
handler.command = ['menu', 'help', 'menudbz']

export default handler