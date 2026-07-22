type CalendarSourceType = 'google' | 'calendly' | 'outlook' | 'ics' | 'local'

type CalendarSource = {
  id: string
  type: CalendarSourceType
  name: string
  label: string
  color: string
  connected: boolean
}

type UnifiedCalendarEvent = {
  id: string
  sourceId: string
  externalId: string
  title: string
  start: string
  end: string
  location?: string
  status: 'confirmed' | 'tentative' | 'cancelled'
}

const sources: CalendarSource[] = [
  {
    id: 'google-personal',
    type: 'google',
    name: 'Google Calendar',
    label: 'Personal Gmail',
    color: '#7c3aed',
    connected: true,
  },
  {
    id: 'google-work',
    type: 'google',
    name: 'Google Calendar',
    label: 'Work Gmail',
    color: '#0891b2',
    connected: true,
  },
  {
    id: 'calendly-main',
    type: 'calendly',
    name: 'Calendly',
    label: 'Scheduling page',
    color: '#0ea5e9',
    connected: true,
  },
  {
    id: 'outlook-coming-soon',
    type: 'outlook',
    name: 'Outlook',
    label: 'Microsoft 365',
    color: '#2563eb',
    connected: false,
  },
  {
    id: 'ics-coming-soon',
    type: 'ics',
    name: 'ICS feed',
    label: 'Subscription URL',
    color: '#f97316',
    connected: false,
  },
]

const events: UnifiedCalendarEvent[] = [
  {
    id: '1',
    sourceId: 'google-personal',
    externalId: 'google-personal-1',
    title: 'Morning workout',
    start: '08:00',
    end: '09:00',
    status: 'confirmed',
  },
  {
    id: '2',
    sourceId: 'google-work',
    externalId: 'google-work-1',
    title: 'NOC handoff review',
    start: '10:30',
    end: '11:00',
    location: 'Meet',
    status: 'confirmed',
  },
  {
    id: '3',
    sourceId: 'calendly-main',
    externalId: 'calendly-1',
    title: 'Intro call with recruiter',
    start: '12:00',
    end: '12:30',
    location: 'Calendly Zoom',
    status: 'confirmed',
  },
  {
    id: '4',
    sourceId: 'google-work',
    externalId: 'google-work-2',
    title: 'Data center maintenance window',
    start: '13:00',
    end: '14:30',
    status: 'tentative',
  },
  {
    id: '5',
    sourceId: 'google-personal',
    externalId: 'google-personal-2',
    title: 'Dinner with family',
    start: '18:30',
    end: '20:00',
    location: 'Columbus',
    status: 'confirmed',
  },
]

const weekDays = [
  { day: 'Mon', date: 15 },
  { day: 'Tue', date: 16 },
  { day: 'Wed', date: 17 },
  { day: 'Thu', date: 18 },
  { day: 'Fri', date: 19 },
  { day: 'Sat', date: 20 },
  { day: 'Sun', date: 21 },
]

function sourceForEvent(sourceId: string) {
  return sources.find((source) => source.id === sourceId) ?? sources[0]
}

function App() {
  const connectedSources = sources.filter((source) => source.connected)

  return (
    <main className="app-shell">
      <section className="hero panel">
        <div>
          <p className="eyebrow">Stjorna</p>
          <h1>One desktop calendar for every scheduling source.</h1>
          <p className="hero-copy">
            This first version uses mock data from Google Calendar and Calendly
            so we can shape the aggregator before wiring in live sync.
          </p>
        </div>
        <div className="hero-actions">
          <button type="button" className="primary-action">
            Connect source
          </button>
          <button type="button" className="secondary-action">
            Refresh calendars
          </button>
        </div>
      </section>

      <section className="dashboard-grid">
        <aside className="panel sidebar">
          <div className="section-heading">
            <span>Sources</span>
            <strong>{connectedSources.length}/{sources.length}</strong>
          </div>
          <div className="source-list">
            {sources.map((source) => (
              <article className="source-card" key={source.id}>
                <span
                  className="source-dot"
                  style={{ backgroundColor: source.color }}
                />
                <div>
                  <h2>{source.name}</h2>
                  <p>{source.label}</p>
                </div>
                <span className={source.connected ? 'badge online' : 'badge'}>
                  {source.connected ? 'Synced' : 'Coming soon'}
                </span>
              </article>
            ))}
          </div>

          <div className="sync-card">
            <p className="eyebrow">Next milestone</p>
            <h2>Connector-based sync</h2>
            <p>
              Add read-only connectors for Google Calendar, Calendly, and ICS
              feeds, then normalize everything into one event model.
            </p>
          </div>
        </aside>

        <section className="panel calendar-panel">
          <div className="calendar-header">
            <div>
              <p className="eyebrow">Unified week</p>
              <h2>July 15–21</h2>
            </div>
            <div className="view-switcher" aria-label="Calendar view selector">
              <button type="button" className="active">Week</button>
              <button type="button">Month</button>
              <button type="button">Agenda</button>
            </div>
          </div>

          <div className="week-grid">
            {weekDays.map((day, index) => (
              <div className="day-column" key={day.day}>
                <div className={index === 2 ? 'day-label today' : 'day-label'}>
                  <span>{day.day}</span>
                  <strong>{day.date}</strong>
                </div>
                {index === 2 ? (
                  <div className="day-events">
                    {events.map((event) => {
                      const source = sourceForEvent(event.sourceId)
                      return (
                        <article
                          className="calendar-event"
                          key={event.id}
                          style={{ borderColor: source.color }}
                        >
                          <div className="event-time">
                            {event.start}–{event.end}
                          </div>
                          <h3>{event.title}</h3>
                          <p>
                            {source.name} · {source.label}
                            {event.location ? ` · ${event.location}` : ''}
                          </p>
                        </article>
                      )
                    })}
                  </div>
                ) : (
                  <div className="empty-day">No events</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
