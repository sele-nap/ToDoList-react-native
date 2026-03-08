import { RecurrenceRule, Todo } from '../types'

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  const day = d.getDate()
  d.setMonth(d.getMonth() + months)
  // Clamp to last day of month
  if (d.getDate() < day) d.setDate(0)
  return d
}

export function computeNextOccurrence(todo: Todo): string | null {
  if (!todo.recurrence) return null
  const rule: RecurrenceRule = todo.recurrence
  const base = todo.dueDate ? new Date(todo.dueDate + 'T00:00:00') : new Date()
  let next: Date

  switch (rule.frequency) {
    case 'daily':
      next = addDays(base, rule.interval)
      break
    case 'weekly':
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        // Find next matching day of week after today
        const today = new Date(); today.setHours(0, 0, 0, 0)
        let candidate = addDays(today, 1)
        let found: Date | undefined
        for (let i = 0; i < 14; i++) {
          if (rule.daysOfWeek.includes(candidate.getDay())) {
            found = candidate
            break
          }
          candidate = addDays(candidate, 1)
        }
        next = found ?? addDays(base, 7 * rule.interval)
      } else {
        next = addDays(base, 7 * rule.interval)
      }
      break
    case 'monthly':
      next = addMonths(base, rule.interval)
      break
    default:
      next = addDays(base, rule.interval)
  }

  if (rule.endDate && next > new Date(rule.endDate + 'T00:00:00')) return null
  return next.toISOString().split('T')[0]
}
