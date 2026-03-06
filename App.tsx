import { Cinzel_400Regular, Cinzel_700Bold, useFonts } from '@expo-google-fonts/cinzel'
import { Sparkles } from '@tamagui/lucide-icons'
import * as Haptics from 'expo-haptics'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect, useState } from 'react'
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
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { TamaguiProvider, Text, View } from 'tamagui'

import AddTodoModal from './src/components/AddTodoModal'
import Header from './src/components/Header'
import TodoItem from './src/components/TodoItem'
import { Todo } from './src/types'
import { loadTodos, saveTodos } from './src/utils/storage'
import config from './tamagui.config'

export default function App() {
  const [fontsLoaded] = useFonts({ Cinzel_400Regular, Cinzel_700Bold })
  const [todos, setTodos] = useState<Todo[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    loadTodos().then(setTodos)
  }, [])

  const persistTodos = useCallback((updated: Todo[]) => {
    setTodos(updated)
    saveTodos(updated)
  }, [])

  const handleAdd = useCallback(
    (todo: Todo) => {
      const updated = [todo, ...todos]
      persistTodos(updated)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      AccessibilityInfo.announceForAccessibility(`Task "${todo.text}" added`)
    },
    [todos, persistTodos],
  )

  const handleToggle = useCallback(
    (id: string) => {
      const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      persistTodos(updated)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      const task = todos.find((t) => t.id === id)
      if (task) {
        AccessibilityInfo.announceForAccessibility(
          task.completed ? `Task unmarked` : `Task completed`
        )
      }
    },
    [todos, persistTodos],
  )

  const handleDelete = useCallback(
    (id: string) => {
      const task = todos.find((t) => t.id === id)
      const updated = todos.filter((t) => t.id !== id)
      persistTodos(updated)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      if (task) {
        AccessibilityInfo.announceForAccessibility(`Task "${task.text}" deleted`)
      }
    },
    [todos, persistTodos],
  )

  const handleDragEnd = useCallback(
    ({ data }: { data: Todo[] }) => {
      persistTodos(data)
    },
    [persistTodos],
  )

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Todo>) => (
      <ScaleDecorator>
        <TodoItem
          todo={item}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onDrag={drag}
          isActive={isActive}
          isDark={isDark}
        />
      </ScaleDecorator>
    ),
    [handleToggle, handleDelete, isDark],
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
          />

          <DraggableFlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            onDragEnd={handleDragEnd}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.empty} accessible accessibilityLabel="No tasks yet. Tap the button below to add your first task.">
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
                  No tasks yet
                </Text>
                <Text
                  style={{ fontFamily: 'Cinzel_400Regular' }}
                  color={isDark ? '$color11' : '$color11'}
                  fontSize={13}
                  textAlign="center"
                >
                  Tap the{' '}
                  <Text color="$color7" style={{ fontFamily: 'Cinzel_700Bold' }}>
                    ✦
                  </Text>
                  {' '}button below{'\n'}to add your first quest!
                </Text>
              </View>
            }
          />

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

          <AddTodoModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onAdd={handleAdd}
            isDark={isDark}
          />
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
    paddingBottom: 100,
    paddingTop: 8,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
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
})
