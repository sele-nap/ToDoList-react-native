export type Priority = 'high' | 'medium' | 'low'

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: Priority
  dueDate?: string
  createdAt: string
}
