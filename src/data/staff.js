// Personal de staff (no comercial) que puede originar captaciones en el bloque
// "Generación Staff". No confundir con AGENTS (comerciales que reciben la captación).

export const STAFF_MEMBERS = [
  'Almudena Gálvez',
  'Julia Ordoñez',
  'Mireia Sáez',
  'Verónica Fortea',
  'Marivi Gil',
  'Mar Moscardó',
  'Andrea Máñez',
  'Ros Aguilar',
  'Roberto Arroyo',
  'Pedro Marcos',
]

// Normaliza un texto libre (ej. "ALMUDENA", "Mireia Saez") al nombre canónico del staff,
// para que variantes de mayúsculas/tildes/apellido parcial se agrupen correctamente.
export function normalizeStaffName(raw) {
  if (!raw) return null
  const clean = String(raw)
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes

  if (!clean) return null

  for (const name of STAFF_MEMBERS) {
    const canonClean = name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const firstName = canonClean.split(' ')[0]
    if (clean === canonClean || clean.includes(canonClean) || canonClean.includes(clean) || clean.includes(firstName)) {
      return name
    }
  }
  return raw.trim() // sin coincidencia: se muestra tal cual, para no perder el dato
}
