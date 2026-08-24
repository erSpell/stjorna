export type CalendarSourceType = 'google' | 'calendly' | 'outlook' | 'ics' | 'local'

export type CalendarSyncStatus = 'connected' | 'disconnected' | 'syncing' | 'error' | 'needs-auth'

export type CalendarSource = {
  id: string
  type: CalendarSourceType
  name: string
  label: string
  color: string
  connected: boolean
  syncStatus: CalendarSyncStatus
  lastSyncedAt?: string
}

export type UnifiedCalendarEventStatus = 'confirmed' | 'tentative' | 'cancelled'

export type UnifiedCalendarEvent = {
  id: string
  sourceId: string
  externalId: string
  title: string
  day: number
  start: string
  end: string
  location?: string
  status: UnifiedCalendarEventStatus
}
