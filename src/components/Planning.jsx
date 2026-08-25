import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import Icon from './Icon'
import './Planning.css'

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function getCurrentMonday() {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(now)
  mon.setDate(now.getDate() + diff)
  mon.setHours(0, 0, 0, 0)
  return mon
}

function getWeekDates(offset) {
  const monday = getCurrentMonday()
  return DAY_NAMES.map((name, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + offset * 7 + i)
    return { name, num: d.getDate() }
  })
}

function sessionMatches(session, category) {
  return session && (category === 'all' || session.type === category)
}

export default function Planning() {
  const { content } = useContent()
  const { planning } = content
  const { types: TYPES, categories: CATEGORIES, schedule: SCHEDULE } = planning

  const [category, setCategory] = useState('all')
  const [selectedDay, setSelectedDay] = useState(0)
  const [week, setWeek] = useState(0)

  const dates = getWeekDates(week)

  const sessionsForDay = (dayIndex) =>
    (SCHEDULE[dayIndex] || [])
      .filter((s) => sessionMatches(s, category) && TYPES[s.type])
      .slice()
      .sort((a, b) => String(a.start).localeCompare(String(b.start)))

  const mobileSessions = sessionsForDay(selectedDay)

  return (
    <section className="section planning" id="planning">
      <span className="planning__plus planning__plus--tl" aria-hidden="true">+</span>
      <span className="planning__plus planning__plus--tr" aria-hidden="true">+</span>

      <div className="container">
        <div className="planning__head reveal">
          <span className="planning__eyebrow">{planning.eyebrow}</span>
          <h2>{planning.title}</h2>
          <p className="planning__sub">{planning.subtitle}</p>
          <div className="planning__filters" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`planning__filter ${category === cat.key ? 'is-active' : ''}`}
                onClick={() => setCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="planning__calendar planning__calendar--desktop reveal">
          <button
            className="planning__nav"
            onClick={() => setWeek((w) => w - 1)}
            aria-label="Semaine précédente"
          >
            <Icon name="arrow" size={18} className="flip" />
          </button>

          <div className="planning__scroll">
            <div className="planning__grid planning__grid--days">
              {dates.map((d, di) => (
                <button
                  key={`h-${di}`}
                  className={`planning__day ${selectedDay === di ? 'is-selected' : ''}`}
                  onClick={() => setSelectedDay(di)}
                >
                  <span className="planning__day-name">{d.name}</span>
                  <span className="planning__day-num">{d.num}</span>
                </button>
              ))}

              {dates.map((_, di) => {
                const sessions = sessionsForDay(di)
                const selCol = selectedDay === di ? 'is-selcol' : ''
                return (
                  <div
                    key={`c-${di}`}
                    className={`planning__daycol ${selCol} ${sessions.length === 0 ? 'is-empty' : ''}`}
                  >
                    {sessions.length === 0 ? (
                      <div className="planning__cell is-empty">
                        <span className="planning__cell-name" style={{ color: 'var(--muted)', fontWeight: 500 }}>
                          —
                        </span>
                      </div>
                    ) : (
                      sessions.map((session, si) => {
                        const t = TYPES[session.type]
                        return (
                          <div
                            className={`planning__cell tone-${t.tone}`}
                            key={`${session.type}-${session.start}-${si}`}
                          >
                            <span className="planning__cell-icon">
                              <Icon name={t.icon} size={16} />
                            </span>
                            <span className="planning__cell-name">{t.label}</span>
                            <span className="planning__cell-spots">
                              <Icon name="clock" size={13} />
                              {session.start} – {session.end}
                            </span>
                          </div>
                        )
                      })
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <button
            className="planning__nav"
            onClick={() => setWeek((w) => w + 1)}
            aria-label="Semaine suivante"
          >
            <Icon name="arrow" size={18} />
          </button>
        </div>

        <div className="planning__mobile reveal">
          <div className="planning__mobile-week">
            <button
              type="button"
              className="planning__mobile-nav"
              onClick={() => setWeek((w) => w - 1)}
              aria-label="Semaine précédente"
            >
              <Icon name="arrow" size={16} className="flip" />
            </button>
            <span className="planning__mobile-label">
              Semaine du {dates[0].num} au {dates[6].num}
            </span>
            <button
              type="button"
              className="planning__mobile-nav"
              onClick={() => setWeek((w) => w + 1)}
              aria-label="Semaine suivante"
            >
              <Icon name="arrow" size={16} />
            </button>
          </div>

          <div className="planning__mobile-days">
            {dates.map((d, di) => (
              <button
                key={di}
                type="button"
                className={`planning__mobile-day ${selectedDay === di ? 'is-selected' : ''}`}
                onClick={() => setSelectedDay(di)}
              >
                <span>{d.name}</span>
                <strong>{d.num}</strong>
              </button>
            ))}
          </div>

          <ul className="planning__mobile-list">
            {mobileSessions.length === 0 ? (
              <li className="planning__mobile-empty">{planning.emptyMessage}</li>
            ) : (
              mobileSessions.map((session, i) => {
                const t = TYPES[session.type]
                return (
                  <li
                    key={`${session.type}-${session.start}-${i}`}
                    className={`planning__mobile-item tone-${t.tone}`}
                  >
                    <span className="planning__mobile-time">{session.start}</span>
                    <div className="planning__mobile-body">
                      <div>
                        <strong>{t.label}</strong>
                        <span>
                          <Icon name="clock" size={12} />
                          {session.start} – {session.end}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })
            )}
          </ul>
        </div>

        <p className="planning__note reveal">{planning.note}</p>
      </div>
    </section>
  )
}
