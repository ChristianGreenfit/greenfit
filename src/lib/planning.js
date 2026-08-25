/** Normalise le planning : chaque jour = liste de cours [{ id, type, start, end }, ...] */

function newSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function normalizeSession(s) {
  if (!s || !s.type) return null
  return {
    id: s.id || newSessionId(),
    type: s.type,
    start: s.start || '09:30',
    end: s.end || '10:30',
  }
}

export function sortSessions(sessions) {
  return [...sessions].sort((a, b) =>
    String(a.start || '').localeCompare(String(b.start || '')),
  )
}

/**
 * Normalise le format sans re-trier (évite de perdre le focus pendant la saisie des heures).
 * Le tri pour l’affichage public se fait côté composant Planning.
 */
export function normalizePlanning(planning) {
  if (!planning || !Array.isArray(planning.schedule)) return planning

  const slots = planning.slots || [
    { key: 'morning' },
    { key: 'midday' },
    { key: 'evening' },
  ]

  const schedule = planning.schedule.map((day) => {
    if (Array.isArray(day)) {
      return day.map(normalizeSession).filter(Boolean)
    }

    // Ancien format { morning, midday, evening }
    const sessions = []
    for (const slot of slots) {
      const s = normalizeSession(day?.[slot.key])
      if (s) sessions.push(s)
    }
    return sessions
  })

  // Garantir 7 jours
  while (schedule.length < 7) schedule.push([])
  if (schedule.length > 7) schedule.length = 7

  return { ...planning, schedule }
}
