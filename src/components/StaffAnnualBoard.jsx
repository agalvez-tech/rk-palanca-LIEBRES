import { MONTHS } from './PeriodFilter'
import { STAFF_MEMBERS, normalizeStaffName } from '../data/staff'

const MONTH_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MEDALS = ['🥇', '🥈', '🥉']

export default function StaffAnnualBoard({ leads, year }) {
  const yearLeads = leads.filter(l => l.createdAt && new Date(l.createdAt).getFullYear() === year)

  // Nombres que aparecen en los datos pero no están en la lista fija de staff (por si se registra alguien nuevo)
  const extraNames = new Set()
  yearLeads.forEach(l => {
    const n = normalizeStaffName(l.altaAgente)
    if (n && !STAFF_MEMBERS.includes(n)) extraNames.add(n)
  })
  const allNames = [...STAFF_MEMBERS, ...extraNames]

  const rows = allNames.map(name => {
    const months = new Array(12).fill(0)
    yearLeads.forEach(l => {
      if (normalizeStaffName(l.altaAgente) === name) {
        const m = new Date(l.createdAt).getMonth()
        months[m] += 1
      }
    })
    const total = months.reduce((a, b) => a + b, 0)
    return { name, months, total }
  }).sort((a, b) => b.total - a.total)

  const maxTotal = Math.max(...rows.map(r => r.total), 0)

  return (
    <div className="card equity-card">
      <div className="equity-head">
        <h3>Cuadrante anual de captaciones · Staff {year}</h3>
        {maxTotal > 0 && (
          <span className="flag high">🏆 Líder: {rows[0].name} ({rows[0].total})</span>
        )}
      </div>
      <div className="table-wrap">
        <table className="leads-table" style={{ fontSize: 12.5 }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Staff</th>
              {MONTH_SHORT.map(m => <th key={m} style={{ textAlign: 'center' }}>{m}</th>)}
              <th style={{ textAlign: 'center' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name}>
                <td style={{ fontWeight: 700, color: 'var(--rk-gray)' }}>{MEDALS[i] || i + 1}</td>
                <td style={{ fontWeight: 700 }}>{r.name}</td>
                {r.months.map((c, mi) => (
                  <td key={mi} style={{ textAlign: 'center', color: c > 0 ? 'var(--rk-black)' : 'var(--rk-border)', fontWeight: c > 0 ? 700 : 400 }}>
                    {c > 0 ? c : '—'}
                  </td>
                ))}
                <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--rk-orange)' }}>{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
