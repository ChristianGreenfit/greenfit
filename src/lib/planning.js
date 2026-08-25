/** Normalise le planning : chaque jour = liste de cours [{ type, start, end }, ...] */
export function normalizePlanning(planning) {
  if (!planning || !Array.isArray(planning.schedule)) return planning

  const slots = planning.slots || [
    { key: 'morning' },
    { key: 'midday' },
    { key: 'evening' },
  ]

  const schedule = planning.schedule.map((day) => {
    if (Array.isArray(day)) {
      return day
        .filter((s) => s && s.type)
        .map((s) => ({
          type: s.type,
          start: s.start || '09:30',
          end: s.end || '10:30',
        }))
        .sort((a, b) => String(a.start).localeCompare(String(b.start)))
    }

    // Ancien format { morning, midday, evening }
    const sessions = []
    for (const slot of slots) {
      const s = day?.[slot.key]
      if (s && s.type) {
        sessions.push({
          type: s.type,
          start: s.start || '09:30',
          end: s.end || '10:30',
        })
      }
    }
    return sessions.sort((a, b) => String(a.start).localeCompare(String(b.start)))
  })

  // Garantir 7 jours
  while (schedule.length < 7) schedule.push([])
  if (schedule.length > 7) schedule.length = 7

  return { ...planning, schedule }
}
