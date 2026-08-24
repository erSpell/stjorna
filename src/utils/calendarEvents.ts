import type { CalendarSource, UnifiedCalendarEvent } from '../domain/calendar'

export function sourceForEvent(
  sources: CalendarSource[],
  sourceId: UnifiedCalendarEvent['sourceId'],
) {
  return sources.find((source) => source.id === sourceId) ?? sources[0]
}

export function eventsForDay(events: UnifiedCalendarEvent[], day?: number) {
  return events.filter((event) => event.day === day)
}

export function getConnectedSources(sources: CalendarSource[]) {
  return sources.filter((source) => source.connected)
}
