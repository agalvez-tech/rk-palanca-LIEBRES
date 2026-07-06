import { useState } from 'react'
import { SOURCES } from './data/sources'
import { agentsForSource } from './data/agents'
import { useLeadsData } from './hooks/useLeadsData'
import EquityChart from './components/EquityChart'
import LeadTable from './components/LeadTable'
import AddLeadModal from './components/AddLeadModal'

export default function App() {
  const [activeTab, setActiveTab] = useState(SOURCES[0].key)
  const [modalOpen, setModalOpen] = useState(false)
  const { data, loading, error, syncing, addLead, updateLead, deleteLead } = useLeadsData()

  const activeSource = SOURCES.find(s => s.key === activeTab)
  const agents = agentsForSource(activeTab)
  const leads = (data && data[activeTab]) || []

  if (loading) {
    return <div className="loading-screen">Cargando captaciones...</div>
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title">
          <h1>RK <span>Liebres</span></h1>
          <p>Reparto de leads por fuente · RK Palanca Fontestad</p>
        </div>
        <div className="sync-pill">
          <span className={`sync-dot ${syncing ? 'syncing' : ''}`} />
          {syncing ? 'Sincronizando...' : 'Al día · todos ven los mismos datos'}
        </div>
      </header>

      {error && (
        <div className="card" style={{ padding: 14, marginBottom: 16, color: '#9B3C33', fontWeight: 600, fontSize: 13 }}>
          Error de conexión: {error}. Reintentando automáticamente...
        </div>
      )}

      <nav className="tabs">
        {SOURCES.map(s => {
          const count = (data && data[s.key] && data[s.key].length) || 0
          return (
            <button
              key={s.key}
              className={`tab-btn ${activeTab === s.key ? 'active' : ''}`}
              style={{ '--tab-color': s.color }}
              onClick={() => setActiveTab(s.key)}
            >
              {s.short}
              <span className="tab-count">{count}</span>
            </button>
          )
        })}
      </nav>

      <p className="panel-desc">{activeSource.description}</p>

      <EquityChart leads={leads} agents={agents} color={activeSource.color} />

      <div className="add-bar">
        <button className="btn-primary" onClick={() => setModalOpen(true)}>+ Nueva captación</button>
      </div>

      <LeadTable
        leads={leads}
        agents={agents}
        onUpdate={(lead) => updateLead(activeTab, lead)}
        onDelete={(id) => deleteLead(activeTab, id)}
      />

      <AddLeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(form) => { addLead(activeTab, form); setModalOpen(false) }}
        agents={agents}
        sourceLabel={activeSource.label}
      />
    </div>
  )
}
