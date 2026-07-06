import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

const VALID_SOURCES = [
  'generacionPropia',
  'veronica',
  'ofFoios',
  'ofMeliana',
  'ofTavernes',
  'ofMassamagrell',
  'gerencia',
]

function keyFor(source) {
  return `rk-captaciones:leads:${source}`
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    // GET /api/leads              -> devuelve TODAS las fuentes { source: [leads] }
    // GET /api/leads?source=xxx   -> devuelve solo esa fuente
    if (req.method === 'GET') {
      const { source } = req.query
      if (source) {
        if (!VALID_SOURCES.includes(source)) return res.status(400).json({ error: 'source inválido' })
        const data = (await redis.get(keyFor(source))) || []
        return res.status(200).json({ [source]: data })
      }
      const all = {}
      const results = await Promise.all(VALID_SOURCES.map(s => redis.get(keyFor(s))))
      VALID_SOURCES.forEach((s, i) => { all[s] = results[i] || [] })
      return res.status(200).json(all)
    }

    // POST /api/leads  { source, lead }  -> añade un lead nuevo
    if (req.method === 'POST') {
      const { source, lead } = req.body || {}
      if (!VALID_SOURCES.includes(source)) return res.status(400).json({ error: 'source inválido' })
      if (!lead) return res.status(400).json({ error: 'lead requerido' })
      const current = (await redis.get(keyFor(source))) || []
      const newLead = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        ...lead,
      }
      const updated = [newLead, ...current]
      await redis.set(keyFor(source), updated)
      return res.status(200).json({ [source]: updated })
    }

    // PUT /api/leads  { source, lead: { id, ...fields } }  -> edita un lead existente
    if (req.method === 'PUT') {
      const { source, lead } = req.body || {}
      if (!VALID_SOURCES.includes(source)) return res.status(400).json({ error: 'source inválido' })
      if (!lead || !lead.id) return res.status(400).json({ error: 'lead.id requerido' })
      const current = (await redis.get(keyFor(source))) || []
      const updated = current.map(l => (l.id === lead.id ? { ...l, ...lead, updatedAt: new Date().toISOString() } : l))
      await redis.set(keyFor(source), updated)
      return res.status(200).json({ [source]: updated })
    }

    // DELETE /api/leads  { source, id }  -> elimina un lead
    if (req.method === 'DELETE') {
      const { source, id } = req.body || {}
      if (!VALID_SOURCES.includes(source)) return res.status(400).json({ error: 'source inválido' })
      if (!id) return res.status(400).json({ error: 'id requerido' })
      const current = (await redis.get(keyFor(source))) || []
      const updated = current.filter(l => l.id !== id)
      await redis.set(keyFor(source), updated)
      return res.status(200).json({ [source]: updated })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (err) {
    console.error('Error en /api/leads:', err)
    return res.status(500).json({ error: 'Error interno', details: String(err) })
  }
}
