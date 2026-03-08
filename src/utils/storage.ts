import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppPreferences, Category, Todo } from '../types'

const TODOS_KEY = '@todos'
const CATEGORIES_KEY = '@categories'
const PREFERENCES_KEY = '@preferences'

const DEFAULT_PREFERENCES: AppPreferences = { isDark: true, notificationsEnabled: false }

export async function loadTodos(): Promise<Todo[]> {
  try {
    const json = await AsyncStorage.getItem(TODOS_KEY)
    return json ? JSON.parse(json) : []
  } catch { return [] }
}
export async function saveTodos(todos: Todo[]): Promise<void> {
  try { await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(todos)) } catch {}
}
export async function loadCategories(): Promise<Category[]> {
  try {
    const json = await AsyncStorage.getItem(CATEGORIES_KEY)
    return json ? JSON.parse(json) : []
  } catch { return [] }
}
export async function saveCategories(cats: Category[]): Promise<void> {
  try { await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats)) } catch {}
}
export async function loadPreferences(): Promise<AppPreferences> {
  try {
    const json = await AsyncStorage.getItem(PREFERENCES_KEY)
    return json ? { ...DEFAULT_PREFERENCES, ...JSON.parse(json) } : DEFAULT_PREFERENCES
  } catch { return DEFAULT_PREFERENCES }
}
export async function savePreferences(prefs: AppPreferences): Promise<void> {
  try { await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs)) } catch {}
}
