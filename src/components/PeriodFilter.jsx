const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export default function PeriodFilter({ year, month, onYearChange, onMonthChange, availableYears, hideMonth = false }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {!hideMonth && (
        <select
          className="editable-input"
          style={{ border: '1px solid var(--rk-border)', background: 'var(--rk-white)', width: 'auto', fontWeight: 700 }}
          value={month === null ? 'all' : month}
          onChange={e => onMonthChange(e.target.value === 'all' ? null : Number(e.target.value))}
        >
          <option value="all">Todos los meses</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
      )}
      <select
        className="editable-input"
        style={{ border: '1px solid var(--rk-border)', background: 'var(--rk-white)', width: 'auto', fontWeight: 700 }}
        value={year}
        onChange={e => onYearChange(Number(e.target.value))}
      >
        {availableYears.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  )
}

export { MONTHS }
