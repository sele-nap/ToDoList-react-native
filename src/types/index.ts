export type Priority = 'high' | 'medium' | 'low'
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'custom'
export type FilterStatus = 'all' | 'active' | 'completed' | 'overdue'
export type SortField = 'createdAt' | 'dueDate' | 'priority' | 'alpha'

export interface Category {
  id: string
  name: string
  emoji: string
  color: string
  createdAt: string
}

export interface SubTask {
  id: string
  text: string
  completed: boolean
}

export interface RecurrenceRule {
  frequency: RecurrenceFrequency
  interval: number
  daysOfWeek?: number[]
  endDate?: string
}

export interface FilterState {
  status: FilterStatus
  priorityFilter: Priority | 'all'
  categoryFilter: string | 'all'
  sortField: SortField
  sortDirection: 'asc' | 'desc'
  searchQuery: string
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: Priority
  dueDate?: string
  createdAt: string
  completedAt?: string
  categoryId?: string
  subTasks?: SubTask[]
  recurrence?: RecurrenceRule
  notes?: string
  notificationId?: string
}

export interface AppPreferences {
  isDark: boolean
  notificationsEnabled: boolean
}
