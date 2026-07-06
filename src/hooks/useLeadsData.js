import { useState, useEffect, useCallback, useRef } from 'react'

const POLL_INTERVAL = 4000

export function useLeadsData() {
  const [data, setData] = useState(null) // { sourceKey: [leads] }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const pollRef = useRef(null)

  const fetchAll = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      setSyncing(true)
      const res = await fetch('/api/leads')
      if (!res.ok) throw new Error('Error cargando datos')
      const json = await res.json()
      setData(json)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
      setSyncing(false)
    }
  }, [])

  useEffect(() => {
    fetchAll(false)
    pollRef.current = setInterval(() => fetchAll(true), POLL_INTERVAL)
    return () => clearInterval(pollRef.current)
  }, [fetchAll])

  const addLead = useCallback(async (source, lead) => {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, lead }),
    })
    const json = await res.json()
    setData(prev => ({ ...prev, ...json }))
  }, [])

  const updateLead = useCallback(async (source, lead) => {
    const res = await fetch('/api/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, lead }),
    })
    const json = await res.json()
    setData(prev => ({ ...prev, ...json }))
  }, [])

  const deleteLead = useCallback(async (source, id) => {
    const res = await fetch('/api/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, id }),
    })
    const json = await res.json()
    setData(prev => ({ ...prev, ...json }))
  }, [])

  return { data, loading, error, syncing, addLead, updateLead, deleteLead, refresh: () => fetchAll(true) }
}
