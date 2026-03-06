import AsyncStorage from '@react-native-async-storage/async-storage'
import { Todo } from '../types'

const STORAGE_KEY = '@todos'

export async function loadTodos(): Promise<Todo[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY)
    return json ? JSON.parse(json) : []
  } catch {
    return []
  }
}

export async function saveTodos(todos: Todo[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // silently fail
  }
}
