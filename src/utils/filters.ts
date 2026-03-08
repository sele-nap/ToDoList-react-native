import { FilterState, Priority, Todo } from '../types'

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

function isOverdue(todo: Todo): boolean {
  if (!todo.dueDate || todo.completed) return false
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return new Date(todo.dueDate) < today
}

function matchesStatus(todo: Todo, status: FilterState['status']): boolean {
  switch (status) {
    case 'active': return !todo.completed
    case 'completed': return todo.completed
    case 'overdue': return isOverdue(todo)
    default: return true
  }
}

function matchesPriority(todo: Todo, pf: FilterState['priorityFilter']): boolean {
  return pf === 'all' || todo.priority === pf
}

function matchesCategory(todo: Todo, cf: FilterState['categoryFilter']): boolean {
  if (cf === 'all') return true
  if (cf === 'none') return !todo.categoryId
  return todo.categoryId === cf
}

function matchesSearch(todo: Todo, query: string): boolean {
  if (!query.trim()) return true
  const q = query.toLowerCase()
  return (
    todo.text.toLowerCase().includes(q) ||
    (todo.notes?.toLowerCase().includes(q) ?? false)
  )
}

function sortTodos(todos: Todo[], field: FilterState['sortField'], dir: FilterState['sortDirection']): Todo[] {
  const sorted = [...todos].sort((a, b) => {
    let cmp = 0
    switch (field) {
      case 'createdAt': cmp = a.createdAt.localeCompare(b.createdAt); break
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) cmp = 0
        else if (!a.dueDate) cmp = 1
        else if (!b.dueDate) cmp = -1
        else cmp = a.dueDate.localeCompare(b.dueDate)
        break
      case 'priority': cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]; break
      case 'alpha': cmp = a.text.localeCompare(b.text); break
    }
    return dir === 'asc' ? cmp : -cmp
  })
  return sorted
}

export function applyFilters(todos: Todo[], filter: FilterState): Todo[] {
  const filtered = todos.filter(t =>
    matchesStatus(t, filter.status) &&
    matchesPriority(t, filter.priorityFilter) &&
    matchesCategory(t, filter.categoryFilter) &&
    matchesSearch(t, filter.searchQuery)
  )
  return sortTodos(filtered, filter.sortField, filter.sortDirection)
}
