import { useState } from 'react'
import { ESTADOS } from '../data/sources'

const emptyForm = {
  contacto: '',
  telefono: '',
  comercial: '',
  asunto: '',
  descripcion: '',
  estado: 'En seguimiento',
  altaAgente: '',
}

export default function AddLeadModal({ open, onClose, onSave, agents, sourceLabel }) {
  const [form, setForm] = useState(emptyForm)

  if (!open) return null

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.contacto.trim() || !form.comercial) return
    onSave(form)
    setForm(emptyForm)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>Nueva captación</h2>
        <p className="modal-sub">{sourceLabel}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Contacto / Nombre *</label>
            <input value={form.contacto} onChange={e => set('contacto', e.target.value)} placeholder="Nombre del cliente" required autoFocus />
          </div>
          <div className="form-row">
            <label>Teléfono</label>
            <input value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="600 000 000" />
          </div>
          <div className="form-row">
            <label>Agente asignado *</label>
            <select value={form.comercial} onChange={e => set('comercial', e.target.value)} required>
              <option value="">Selecciona agente...</option>
              {agents.map(a => (
                <option key={a.name} value={a.name}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Asunto</label>
            <input value={form.asunto} onChange={e => set('asunto', e.target.value)} placeholder="Piso, local, solar, alquiler..." />
          </div>
          <div className="form-row">
            <label>Descripción / notas</label>
            <textarea rows={3} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Detalles adicionales" />
          </div>
          <div className="form-row">
            <label>Estado</label>
            <select value={form.estado} onChange={e => set('estado', e.target.value)}>
              {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>Quién lo registra</label>
            <input value={form.altaAgente} onChange={e => set('altaAgente', e.target.value)} placeholder="Tu nombre" />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Guardar captación</button>
          </div>
        </form>
      </div>
    </div>
  )
}
