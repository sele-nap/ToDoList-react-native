/**
 * expo-notifications was removed from Expo Go since SDK 53.
 * We lazy-load it via require() inside a try/catch so the app
 * doesn't crash in Expo Go. All functions silently no-op there.
 */
import { Todo } from '../types'

type NotificationsModule = typeof import('expo-notifications')

let N: NotificationsModule | null = null

try {
  N = require('expo-notifications') as NotificationsModule
  N.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  })
} catch {
  // Expo Go SDK 53+ — notifications not available, silently skip
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!N) return false
  try {
    const { status } = await N.requestPermissionsAsync()
    return status === 'granted'
  } catch {
    return false
  }
}

export async function scheduleNotification(todo: Todo): Promise<string | null> {
  if (!N || !todo.dueDate) return null
  const trigger = new Date(todo.dueDate + 'T09:00:00')
  if (trigger <= new Date()) return null
  try {
    const id = await N.scheduleNotificationAsync({
      content: {
        title: '📋 Task due today',
        body: todo.text,
        data: { todoId: todo.id },
      },
      trigger: { type: N.SchedulableTriggerInputTypes.DATE, date: trigger },
    })
    return id
  } catch {
    return null
  }
}

export async function cancelNotification(notificationId: string): Promise<void> {
  if (!N) return
  try {
    await N.cancelScheduledNotificationAsync(notificationId)
  } catch {}
}
