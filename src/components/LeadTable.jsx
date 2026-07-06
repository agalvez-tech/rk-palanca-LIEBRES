import { ESTADOS } from '../data/sources'

function estadoClass(estado) {
  switch (estado) {
    case 'Contactado': return 'contactado'
    case 'Captado': return 'captado'
    case 'Descartado': return 'descartado'
    default: return 'seguimiento'
  }
}

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default function LeadTable({ leads, agents, onUpdate, onDelete }) {
  if (!leads.length) {
    return <div className="card"><div className="empty-state">Todavía no hay captaciones registradas en este bloque. Añade la primera con el botón de arriba.</div></div>
  }

  function handleField(lead, field, value) {
    onUpdate({ ...lead, [field]: value })
  }

  return (
    <div className="card table-wrap">
      <table className="leads-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>Agente asignado</th>
            <th>Asunto</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Registrado por</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td style={{ whiteSpace: 'nowrap', color: 'var(--rk-gray)', fontWeight: 600, fontSize: 12 }}>
                {fmtDate(lead.createdAt)}
              </td>
              <td>
                <input className="editable-input" value={lead.contacto || ''} onChange={e => handleField(lead, 'contacto', e.target.value)} onBlur={e => onUpdate({ ...lead, contacto: e.target.value })} />
              </td>
              <td>
                <input className="editable-input" value={lead.telefono || ''} onChange={e => handleField(lead, 'telefono', e.target.value)} onBlur={e => onUpdate({ ...lead, telefono: e.target.value })} />
              </td>
              <td>
                <select className="editable-input" value={lead.comercial || ''} onChange={e => onUpdate({ ...lead, comercial: e.target.value })}>
                  <option value="">—</option>
                  {agents.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                </select>
              </td>
              <td>
                <input className="editable-input" value={lead.asunto || ''} onChange={e => handleField(lead, 'asunto', e.target.value)} onBlur={e => onUpdate({ ...lead, asunto: e.target.value })} />
              </td>
              <td>
                <input className="editable-input" value={lead.descripcion || ''} onChange={e => handleField(lead, 'descripcion', e.target.value)} onBlur={e => onUpdate({ ...lead, descripcion: e.target.value })} style={{ minWidth: 160 }} />
              </td>
              <td>
                <select className={`editable-input badge ${estadoClass(lead.estado)}`} value={lead.estado || 'En seguimiento'} onChange={e => onUpdate({ ...lead, estado: e.target.value })}>
                  {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td>
                <input className="editable-input who-row" value={lead.altaAgente || ''} onChange={e => handleField(lead, 'altaAgente', e.target.value)} onBlur={e => onUpdate({ ...lead, altaAgente: e.target.value })} />
              </td>
              <td>
                <button className="icon-btn" title="Eliminar" onClick={() => { if (confirm('¿Eliminar esta captación?')) onDelete(lead.id) }}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
