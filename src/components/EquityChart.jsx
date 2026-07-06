import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts'

function isSameMonth(dateStr, ref) {
  const d = new Date(dateStr)
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
}

export default function EquityChart({ leads, agents, color }) {
  const now = new Date()
  const monthLeads = leads.filter(l => l.createdAt && isSameMonth(l.createdAt, now))

  const counts = agents.map(a => ({
    name: a.name,
    total: monthLeads.filter(l => l.comercial === a.name).length,
  }))

  const max = Math.max(...counts.map(c => c.total), 0)
  const min = Math.min(...counts.map(c => c.total), 0)

  const top = counts.filter(c => c.total === max && max > 0).map(c => c.name)
  const bottom = counts.filter(c => c.total === min).map(c => c.name)

  const monthLabel = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  return (
    <div className="card equity-card">
      <div className="equity-head">
        <h3>Reparto de leads · {monthLabel}</h3>
        <div className="equity-flags">
          {max > 0 && (
            <span className="flag high">🔥 Recibe más: {top.join(', ')} ({max})</span>
          )}
          <span className="flag low">
            ⚖️ Recibe menos: {bottom.join(', ')} ({min})
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={Math.max(120, agents.length * 30)}>
        <BarChart data={counts} layout="vertical" margin={{ top: 4, right: 24, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4DFD8" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#8A8478' }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={130}
            tick={{ fontSize: 12, fill: '#171513', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v) => [`${v} leads`, 'Este mes']}
            contentStyle={{ borderRadius: 8, border: '1px solid #E4DFD8', fontSize: 12 }}
          />
          <Bar dataKey="total" radius={[0, 6, 6, 0]} maxBarSize={18}>
            {counts.map((c, i) => (
              <Cell
                key={i}
                fill={c.total === max && max > 0 ? '#CF731B' : c.total === min ? '#8A8478' : color}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
