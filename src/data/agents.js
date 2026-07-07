// Roster oficial · RANKING 05/2026 · Acceso a leads por nivel
// Niveles: top (Top Producer), senior (Consultor Senior), junior (Consultor Junior), agente (Agente)
// Permisos por nivel:
//   generacionPropia -> TODOS los agentes (siempre pueden captar por su cuenta)
//   veronica         -> top, senior, junior
//   oficina          -> top, senior
//   gerencia         -> top

export const AGENTS = [
  { name: 'Alejandro Garcia',  level: 'agente' },
  { name: 'Amparo Orts',       level: 'top' },
  { name: 'Asun Marco',        level: 'top' },
  { name: 'Clara Ordoñez',     level: 'senior' },
  { name: 'Claudia Stelling',  level: 'agente' },
  { name: 'Desireé López',     level: 'senior' },
  { name: 'Eva Vallés',        level: 'agente' },
  { name: 'Fede Carbonell',    level: 'junior' },
  { name: 'Fran Estellés',     level: 'agente' },
  { name: 'Javier Palanca',    level: 'top' },
  { name: 'José Giménez',      level: 'senior' },
  { name: 'José Miguel Palanca', level: 'top' },
  { name: 'Lorena Lull',       level: 'agente' },
  { name: 'Mariano del Prado', level: 'agente' },
  { name: 'Mavi Castillo',     level: 'senior' },
  { name: 'Mª José Ordoñez',   level: 'agente' },
  { name: 'Mª Luisa Bellver',  level: 'top' },
  { name: 'Natalia Sanfélix',  level: 'agente' },
  { name: 'Nuria Núñez',       level: 'agente' },
  { name: 'Rosa Domenech',     level: 'senior' },
  { name: 'Sefa Gallent',      level: 'junior' },
  { name: 'Virginia Corral',   level: 'top' },
  { name: 'Yvonne Vidal',      level: 'agente' },
]

export const LEVEL_LABEL = {
  top: 'Top Producer ★★★',
  senior: 'Consultor Senior ★★',
  junior: 'Consultor Junior ★',
  agente: 'Agente',
}

export const LEVEL_ORDER = ['top', 'senior', 'junior', 'agente']

// Qué niveles tienen acceso a cada bloque/fuente de leads
export const SOURCE_LEVEL_ACCESS = {
  generacionPropia: ['top', 'senior', 'junior', 'agente'],
  veronica: ['top', 'senior', 'junior'],
  ofFoios: ['top', 'senior'],
  ofMeliana: ['top', 'senior'],
  ofTavernes: ['top', 'senior'],
  ofMassamagrell: ['top', 'senior'],
}

export function agentsForSource(sourceKey) {
  const allowedLevels = SOURCE_LEVEL_ACCESS[sourceKey] || []
  return AGENTS.filter(a => allowedLevels.includes(a.level))
}
