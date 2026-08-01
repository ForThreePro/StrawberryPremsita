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
group: 'GRUPO',
gacha: 'GROUP',
ia: 'IA',
info: 'INFO',
sticker: 'STICKER',
}

// Emojis fresita random
const EMOJIS_RANDOM = ['🍓','🍒','🍰','🧁','🍬','🍭','🍡','🍧','🍨','🍩','🍪','🎀','💖','✨','🌸']

const ICONOS_CATEGORIA = {
config: '⚙️', owner: '👑', fun: '😈', joda: '🍓', ff: '🔫', buscadores: '🔍',
descargas: '📥', grupo: '⚔️', grupos: '🛡️', gacha: '👥', ia: '🤖',
info: 'ℹ️', sticker: '🎨', main: '🔧', tools: '🛠️', sorteos: '🎯'
}

let handler = async (m, { conn }) => {
try {
await conn.sendMessage(m.chat, { react: { text: '🍓', key: m.key } })

// Emojis random
const eTop = EMOJIS_RANDOM[Math.floor(Math.random() * EMOJIS_RANDOM.length)]
const eUser = EMOJIS_RANDOM[Math.floor(Math.random() * EMOJIS_RANDOM.length)]
const eStats = EMOJIS_RANDOM[Math.floor(Math.random() * EMOJIS_RANDOM.length)]
const eSys = EMOJIS_RANDOM[Math.floor(Math.random() * EMOJIS_RANDOM.length)]

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

// AHORA DETECTA TODAS LAS CATEGORIAS
const byTag = {}
for (const plugin of Object.values(global.plugins || {})) {
  if (plugin.disabled) continue
  const tags = Array.isArray(plugin.tags)? plugin.tags : (plugin.tags? [plugin.tags] : [])
  const helps = Array.isArray(plugin.help)? plugin.help : (plugin.help? [plugin.help] : [])
  for (const tag of tags) {
    const t = tag.toLowerCase()
    if (!byTag[t]) byTag[t] = new Set() // sin filtro
    for (const h of helps) if (typeof h === 'string' && h.trim()) byTag[t].add(h.trim())
  }
}

const userName = m.pushName || 'Usuario'
const IMG_MENU = 'https://files.evogb.win/We0JaW.jpg'

let menuTexto = `*${eTop} STRAWBERRY PREM ${eTop}*

⤷ *SYSTEM*: v3.0 FRESITA
╰─ *ONLINE* • ${horas}h ${minutos}m ${segundos}s

╭─「 ${eUser} USUARIO 」─╮
│ 🍓 ${userName}
│ 💬 "Bienvenido al huerto de fresas"
╰────────────────╯

──${eStats} *ESTADISTICAS* ${eStats}──
*👥 Usuarios*: ${totalUsers}
*📜 Comandos*: ${pluginsCount}
*💾 RAM*: ${ram}mb
*🌐 Servidor*: ${totalram}gb

──${eSys} *SISTEMA* ${eSys}──
*📅 Dia*: ${fecha}
*📆 Fecha*: ${fecha2}
*🕐 Hora*: ${hora}
*📡 Ping*: ${Math.round(performance.now())}ms

`

// Ordena: primero las de CATEGORY_META, luego las nuevas
const tagsOrdenados = Object.keys(byTag).sort((a, b) => {
  const aIn = CATEGORY_META[a]? 0 : 1
  const bIn = CATEGORY_META[b]? 0 : 1
  return aIn - bIn
})

for (const tag of tagsOrdenados) {
  const set = byTag[tag]
  if (!set || set.size === 0) continue
  const cmds = [...set].sort()

  // Si no existe en CATEGORY_META, lo crea bonito
  const nombreCat = CATEGORY_META[tag] || `HUERTO DE ${tag.toUpperCase()}`
  const icono = ICONOS_CATEGORIA[tag] || EMOJIS_RANDOM[Math.floor(Math.random() * EMOJIS_RANDOM.length)]

  menuTexto += `\n╭─「 ${icono} ${nombreCat} 」─╮\n`
  menuTexto += cmds.map(c => `│ *${icono}.${c}*`).join('\n') + '\n'
  menuTexto += `╰─────────────────╯\n`
}

menuTexto += `
*━━━━━━━━━━━━━━*
*BOT*: STRAWBERRY PREM
*CREADOR*: Whois Yalli co
*VERSION*: 3.0 FRESITA
*WEB*: github.com

> "Dulce pero peligroso" ${eTop}
*━━━━━━━━━━━━━━*`

await conn.sendMessage(m.chat, {
  image: { url: IMG_MENU },
  caption: menuTexto.trim(),
  mentions: [m.sender]
}, { quoted: m })

} catch (e) {
await conn.sendMessage(m.chat, { text: `*🍓 ERROR DE SISTEMA 🍓*\n*Detalle*: ${e.message}` }, { quoted: m })
}
}

handler.help = ['menu']
handler.tags = ['info']
handler.command = ['menu', 'help', 'menufresa']

export default handler