import { useMemo, useState, type CSSProperties } from 'react'
import { mockCalendarEvents, mockCalendarSources } from './data/mockCalendar'
import { getConnectedSources, eventsForDay, sourceForEvent } from './utils/calendarEvents'

type MiniMonth = {
  name: string
  activeDay?: number
  days: number
  startsOn: number
}

const miniMonths: MiniMonth[] = [
  { name: 'January 2026', days: 31, startsOn: 4, activeDay: 17 },
  { name: 'February 2026', days: 28, startsOn: 0, activeDay: 14 },
  { name: 'March 2026', days: 31, startsOn: 0, activeDay: 13 },
  { name: 'April 2026', days: 30, startsOn: 3, activeDay: 25 },
  { name: 'May 2026', days: 31, startsOn: 5, activeDay: 2 },
]

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const miniWeekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const calendarCells = Array.from({ length: 35 }, (_, index) => {
  const day = index - 1

  if (index === 0) return { label: 'Feb 28', day: undefined, muted: true }
  if (day > 31) return { label: String(day - 31), day: undefined, muted: true }

  return { label: String(day), day, muted: false }
})

function App() {
  const [glassOpacity, setGlassOpacity] = useState(72)
  const [accentColor, setAccentColor] = useState('#4aa8ff')
  const [tintColor, setTintColor] = useState('#10233f')

  const sources = mockCalendarSources
  const events = mockCalendarEvents
  const connectedSourceList = getConnectedSources(sources)
  const shellStyle = useMemo(
    () =>
      ({
        '--glass-opacity': glassOpacity / 100,
        '--accent-color': accentColor,
        '--tint-color': tintColor,
      }) as CSSProperties,
    [accentColor, glassOpacity, tintColor],
  )

  return (
    <main className="desktop-stage" style={shellStyle}>
      <section className="calendar-shell" aria-label="Stjorna desktop calendar">
        <header className="window-bar">
          <div className="brand-cluster">
            <span className="app-icon">✦</span>
            <div>
              <p>Stjorna</p>
              <span>Unified desktop calendar</span>
            </div>
          </div>
          <nav className="view-tabs" aria-label="Calendar views">
            <button type="button">Day</button>
            <button type="button">Week</button>
            <button type="button" className="active">Month</button>
          </nav>
          <div className="window-actions" aria-label="Window controls">
            <button type="button">─</button>
            <button type="button">□</button>
            <button type="button">×</button>
          </div>
        </header>

        <div className="calendar-layout">
          <aside className="left-rail">
            <p className="rail-title">Navigation Pane</p>
            {miniMonths.map((month) => (
              <section className="mini-month" key={month.name}>
                <h2>{month.name}</h2>
                <div className="mini-grid weekdays">
                  {miniWeekdays.map((day) => <span key={day}>{day}</span>)}
                </div>
                <div className="mini-grid">
                  {Array.from({ length: month.startsOn }).map((_, index) => (
                    <span aria-hidden="true" key={`blank-${month.name}-${index}`} />
                  ))}
                  {Array.from({ length: month.days }, (_, index) => index + 1).map((day) => (
                    <span className={day === month.activeDay ? 'picked' : ''} key={day}>
                      {day}
                    </span>
                  ))}
                </div>
              </section>
            ))}
          </aside>

          <section className="month-panel">
            <div className="month-toolbar">
              <div className="month-nav">
                <button type="button">‹</button>
                <button type="button">›</button>
                <h1>March 2026</h1>
              </div>
              <div className="toolbar-actions">
                <button type="button">🔍</button>
                <button type="button">Today</button>
                <button type="button">⚙ Settings</button>
              </div>
            </div>

            <div className="month-grid" aria-label="March 2026 month view">
              {weekdays.map((day) => <div className="weekday-heading" key={day}>{day}</div>)}
              {calendarCells.map((cell, index) => {
                const dayEvents = eventsForDay(events, cell.day)
                return (
                  <article className={cell.muted ? 'day-cell muted' : 'day-cell'} key={`${cell.label}-${index}`}>
                    <span className="date-number">{cell.label}</span>
                    <div className="event-stack">
                      {dayEvents.map((event) => {
                        const source = sourceForEvent(sources, event.sourceId)
                        return (
                          <div
                            className="event-pill"
                            key={event.id}
                            style={{ '--event-color': source.color } as CSSProperties}
                          >
                            <strong>{event.start}</strong>
                            <span>{event.title}</span>
                          </div>
                        )
                      })}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <aside className="right-rail">
            <section className="side-card">
              <div className="section-heading">
                <h2>Upcoming Events</h2>
                <span>{events.length}</span>
              </div>
              <div className="agenda-list">
                {events.slice(1, 6).map((event) => {
                  const source = sourceForEvent(sources, event.sourceId)
                  return (
                    <article className="agenda-item" key={event.id}>
                      <span style={{ backgroundColor: source.color }} />
                      <div>
                        <strong>{event.start || 'All day'} {event.title}</strong>
                        <p>{source.name} · {source.label}</p>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>

            <section className="side-card sources-card">
              <div className="section-heading">
                <h2>Sources</h2>
                <span>{connectedSourceList.length}/{sources.length}</span>
              </div>
              {sources.map((source) => (
                <div className="source-row" key={source.id}>
                  <span style={{ backgroundColor: source.color }} />
                  <p>{source.name}</p>
                  <em>{source.connected ? 'on' : 'soon'}</em>
                </div>
              ))}
            </section>

            <section className="side-card appearance-card">
              <div className="section-heading">
                <h2>Appearance</h2>
              </div>
              <label>
                <span>Window opacity</span>
                <input
                  max="92"
                  min="35"
                  onChange={(event) => setGlassOpacity(Number(event.target.value))}
                  type="range"
                  value={glassOpacity}
                />
                <strong>{glassOpacity}%</strong>
              </label>
              <label>
                <span>Accent color</span>
                <input
                  onChange={(event) => setAccentColor(event.target.value)}
                  type="color"
                  value={accentColor}
                />
              </label>
              <label>
                <span>Glass tint</span>
                <input
                  onChange={(event) => setTintColor(event.target.value)}
                  type="color"
                  value={tintColor}
                />
              </label>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default App
