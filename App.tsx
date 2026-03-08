import { Cinzel_400Regular, Cinzel_700Bold, useFonts } from '@expo-google-fonts/cinzel'
import { FolderOpen, Sparkles } from '@tamagui/lucide-icons'
import * as Haptics from 'expo-haptics'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AccessibilityInfo,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist'
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler'
import { TamaguiProvider, Text, View, XStack } from 'tamagui'

import AddTodoModal from './src/components/AddTodoModal'
import CategoryModal from './src/components/CategoryModal'
import ConfettiOverlay from './src/components/ConfettiOverlay'
import EditTodoModal from './src/components/EditTodoModal'
import FilterBar from './src/components/FilterBar'
import Header from './src/components/Header'
import SearchBar from './src/components/SearchBar'
import StatsModal from './src/components/StatsModal'
import SwipeDeleteAction from './src/components/SwipeDeleteAction'
import TodoItem from './src/components/TodoItem'
import { Category, FilterState, Todo } from './src/types'
import { applyFilters } from './src/utils/filters'
import { cancelNotification, requestNotificationPermission, scheduleNotification } from './src/utils/notifications'
import { computeNextOccurrence } from './src/utils/recurrence'
import { loadCategories, loadTodos, saveCategories, saveTodos } from './src/utils/storage'
import config from './tamagui.config'
import { useConfetti } from './src/hooks/useConfetti'

const DEFAULT_FILTER: FilterState = {
  status: 'all',
  priorityFilter: 'all',
  categoryFilter: 'all',
  sortField: 'createdAt',
  sortDirection: 'desc',
  searchQuery: '',
}

export default function App() {
  const [fontsLoaded] = useFonts({ Cinzel_400Regular, Cinzel_700Bold })
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [isDark, setIsDark] = useState(true)
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER)
  const { shouldFire, fire: fireConfetti, reset: resetConfetti } = useConfetti()
  const prevAllDoneRef = useRef(false)

  useEffect(() => {
    loadTodos().then(setTodos)
    loadCategories().then(setCategories)
    requestNotificationPermission()
  }, [])

  // Confetti when all tasks are completed
  useEffect(() => {
    const allDone = todos.length > 0 && todos.every(t => t.completed)
    if (allDone && !prevAllDoneRef.current) fireConfetti()
    prevAllDoneRef.current = allDone
  }, [todos, fireConfetti])

  const persistTodos = useCallback((updated: Todo[]) => {
    setTodos(updated)
    saveTodos(updated)
  }, [])

  const persistCategories = useCallback((updated: Category[]) => {
    setCategories(updated)
    saveCategories(updated)
  }, [])

  const handleAdd = useCallback(
    async (todo: Todo) => {
      let notifTodo = todo
      if (todo.dueDate) {
        const notificationId = await scheduleNotification(todo) ?? undefined
        notifTodo = { ...todo, notificationId }
      }
      const updated = [notifTodo, ...todos]
      persistTodos(updated)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      AccessibilityInfo.announceForAccessibility(`Task "${todo.text}" added`)
    },
    [todos, persistTodos],
  )

  const handleToggle = useCallback(
    async (id: string) => {
      const task = todos.find((t) => t.id === id)
      if (!task) return

      const nowCompleted = !task.completed
      let updated = todos.map((t) =>
        t.id === id
          ? { ...t, completed: nowCompleted, completedAt: nowCompleted ? new Date().toISOString() : undefined }
          : t
      )

      // Recurrence spawn: when completing a recurring task
      if (nowCompleted && task.recurrence) {
        const nextDate = computeNextOccurrence(task)
        if (nextDate) {
          const newTodo: Todo = {
            id: Date.now().toString(),
            text: task.text,
            completed: false,
            priority: task.priority,
            dueDate: nextDate,
            createdAt: new Date().toISOString(),
            categoryId: task.categoryId,
            notes: task.notes,
            recurrence: task.recurrence,
            subTasks: (task.subTasks ?? []).map(s => ({ ...s, completed: false })),
          }
          // Schedule notification for the new occurrence
          const notificationId = await scheduleNotification(newTodo) ?? undefined
          updated = [{ ...newTodo, notificationId }, ...updated]
        }
      }

      persistTodos(updated)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      AccessibilityInfo.announceForAccessibility(
        nowCompleted ? `Task completed` : `Task unmarked`
      )
    },
    [todos, persistTodos],
  )

  const handleDelete = useCallback(
    (id: string) => {
      const task = todos.find((t) => t.id === id)
      if (task?.notificationId) cancelNotification(task.notificationId)
      const updated = todos.filter((t) => t.id !== id)
      persistTodos(updated)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      if (task) {
        AccessibilityInfo.announceForAccessibility(`Task "${task.text}" deleted`)
      }
    },
    [todos, persistTodos],
  )

  const handleEdit = useCallback(
    (id: string) => {
      const task = todos.find((t) => t.id === id)
      if (task) setEditingTodo(task)
    },
    [todos],
  )

  const handleSaveEdit = useCallback(
    async (updated: Todo) => {
      // Cancel old notification, schedule new one if due date changed
      const old = todos.find(t => t.id === updated.id)
      if (old?.notificationId) cancelNotification(old.notificationId)
      let savedTodo = updated
      if (updated.dueDate) {
        const notificationId = await scheduleNotification(updated) ?? undefined
        savedTodo = { ...updated, notificationId }
      } else {
        savedTodo = { ...updated, notificationId: undefined }
      }
      const updatedList = todos.map((t) => (t.id === savedTodo.id ? savedTodo : t))
      persistTodos(updatedList)
      setEditingTodo(null)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      AccessibilityInfo.announceForAccessibility(`Task "${savedTodo.text}" updated`)
    },
    [todos, persistTodos],
  )

  const handleDragEnd = useCallback(
    ({ data }: { data: Todo[] }) => {
      persistTodos(data)
    },
    [persistTodos],
  )

  const displayedTodos = applyFilters(todos, filterState)

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Todo>) => {
      const category = categories.find(c => c.id === item.categoryId)
      return (
        <ScaleDecorator>
          <Swipeable
            renderRightActions={() => (
              <SwipeDeleteAction onDelete={() => handleDelete(item.id)} />
            )}
            friction={2}
            rightThreshold={60}
            overshootRight={false}
          >
            <TodoItem
              todo={item}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDrag={drag}
              isActive={isActive}
              isDark={isDark}
              category={category}
            />
          </Swipeable>
        </ScaleDecorator>
      )
    },
    [handleToggle, handleEdit, handleDelete, isDark, categories],
  )

  if (!fontsLoaded) return null

  const completed = todos.filter((t) => t.completed).length
  const bgColor = isDark ? '#0d0814' : '#faf5ff'

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config} defaultTheme={isDark ? 'dark' : 'light'}>
        <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
          <StatusBar style={isDark ? 'light' : 'dark'} />

          <Header
            total={todos.length}
            completed={completed}
            isDark={isDark}
            onThemeToggle={() => setIsDark((d) => !d)}
            onStatsPress={() => setStatsVisible(true)}
          />

          <SearchBar
            value={filterState.searchQuery}
            onChangeText={q => setFilterState(f => ({ ...f, searchQuery: q }))}
            isDark={isDark}
          />

          <FilterBar
            filterState={filterState}
            categories={categories}
            onFilterChange={setFilterState}
            isDark={isDark}
          />

          <DraggableFlatList
            data={displayedTodos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            onDragEnd={handleDragEnd}
            containerStyle={{ flex: 1 }}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.empty} accessible accessibilityLabel="No tasks match your filters.">
                <Text
                  style={{ fontFamily: 'Cinzel_400Regular' }}
                  color={isDark ? '$color11' : '$color11'}
                  fontSize={32}
                  textAlign="center"
                  marginBottom={12}
                >
                  ✨
                </Text>
                <Text
                  style={{ fontFamily: 'Cinzel_700Bold' }}
                  color={isDark ? '$color9' : '$color9'}
                  fontSize={16}
                  textAlign="center"
                  marginBottom={8}
                >
                  {todos.length === 0 ? 'No tasks yet' : 'No tasks match'}
                </Text>
                <Text
                  style={{ fontFamily: 'Cinzel_400Regular' }}
                  color={isDark ? '$color11' : '$color11'}
                  fontSize={13}
                  textAlign="center"
                >
                  {todos.length === 0
                    ? `Tap the ✦ button below\nto add your first quest!`
                    : 'Try adjusting your filters'}
                </Text>
              </View>
            }
          />

          {/* FAB row: categories + add */}
          <XStack style={styles.fabRow} gap={12} alignItems="center">
            <TouchableOpacity
              style={[styles.fabSecondary, { backgroundColor: isDark ? '#1e1530' : '#ede9fe', borderColor: isDark ? '#2d1f45' : '#ddd6fe' }]}
              onPress={() => setCategoryModalVisible(true)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Manage categories"
            >
              <FolderOpen size={22} color="#7c3aed" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.fab, { backgroundColor: '#7c3aed' }]}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Add new task"
              accessibilityHint="Opens the form to create a new task"
            >
              <Sparkles color="white" size={24} />
            </TouchableOpacity>
          </XStack>

          <AddTodoModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onAdd={handleAdd}
            isDark={isDark}
            categories={categories}
            onRequestCategoryCreate={() => {
              setModalVisible(false)
              setCategoryModalVisible(true)
            }}
          />

          <EditTodoModal
            todo={editingTodo}
            categories={categories}
            visible={editingTodo !== null}
            onClose={() => setEditingTodo(null)}
            onSave={handleSaveEdit}
            onDelete={handleDelete}
            isDark={isDark}
          />

          <CategoryModal
            visible={categoryModalVisible}
            onClose={() => setCategoryModalVisible(false)}
            categories={categories}
            onSave={persistCategories}
            isDark={isDark}
          />

          <StatsModal
            visible={statsVisible}
            onClose={() => setStatsVisible(false)}
            todos={todos}
            categories={categories}
            isDark={isDark}
          />

          <ConfettiOverlay shouldFire={shouldFire} onDone={resetConfetti} />
        </SafeAreaView>
      </TamaguiProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    paddingTop: 8,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  fabRow: {
    position: 'absolute',
    bottom: 32,
    right: 24,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabSecondary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
})
