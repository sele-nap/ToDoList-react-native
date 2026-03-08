import { Category, Todo } from '../types'

export interface DayStat { date: string; label: string; count: number }
export interface PriorityStat { priority: string; color: string; count: number }
export interface CategoryStat { name: string; emoji: string; color: string; count: number }

export function computeWeeklyStats(todos: Todo[]): DayStat[] {
  const days: DayStat[] = []
  const today = new Date(); today.setHours(0, 0, 0, 0)
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-GB', { weekday: 'short' }).slice(0, 2)
    const count = todos.filter(t => t.completed && t.completedAt?.startsWith(dateStr)).length
    days.push({ date: dateStr, label, count })
  }
  return days
}

export function computePriorityStats(todos: Todo[]): PriorityStat[] {
  return [
    { priority: 'High', color: '#ef4444', count: todos.filter(t => t.priority === 'high').length },
    { priority: 'Medium', color: '#d97706', count: todos.filter(t => t.priority === 'medium').length },
    { priority: 'Low', color: '#16a34a', count: todos.filter(t => t.priority === 'low').length },
  ]
}

export function computeCategoryStats(todos: Todo[], categories: Category[]): CategoryStat[] {
  const result: CategoryStat[] = categories.map(cat => ({
    name: cat.name,
    emoji: cat.emoji,
    color: cat.color,
    count: todos.filter(t => t.categoryId === cat.id).length,
  })).filter(s => s.count > 0)

  const uncategorized = todos.filter(t => !t.categoryId).length
  if (uncategorized > 0) {
    result.push({ name: 'Other', emoji: '📌', color: '#a78bca', count: uncategorized })
  }
  return result
}
