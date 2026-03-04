import React, { useState, useEffect, useCallback } from 'react'
import { StatusBar, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist'
import * as Haptics from 'expo-haptics'
import { useFonts, Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel'
import { TamaguiProvider, YStack, Text } from 'tamagui'
import { Sparkles } from '@tamagui/lucide-icons'

import tamaguiConfig from './tamagui.config'
import Header from './src/components/Header'
import TodoItem from './src/components/TodoItem'
import AddTodoModal from './src/components/AddTodoModal'
import { Todo, Priority } from './src/types'
import { loadTodos, saveTodos } from './src/utils/storage'

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isDark, setIsDark] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)

  const [fontsLoaded] = useFonts({ Cinzel_400Regular, Cinzel_700Bold })

  useEffect(() => {
    loadTodos().then(setTodos)
  }, [])

  const persistAndSet = useCallback((updated: Todo[]) => {
    setTodos(updated)
    saveTodos(updated)
  }, [])

  const handleAdd = (text: string, priority: Priority, dueDate?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    persistAndSet([newTodo, ...todos])
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }

  const handleToggleComplete = (id: string) => {
    const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    persistAndSet(updated)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const handleDelete = (id: string) => {
    const updated = todos.filter((t) => t.id !== id)
    persistAndSet(updated)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  const completedCount = todos.filter((t) => t.completed).length
  const bgColor = isDark ? '#0d0814' : '#faf5ff'

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Todo>) => (
    <ScaleDecorator>
      <TodoItem
        todo={item}
        fontsLoaded={fontsLoaded}
        onToggleComplete={() => handleToggleComplete(item.id)}
        onDelete={() => handleDelete(item.id)}
        drag={drag}
        isActive={isActive}
      />
    </ScaleDecorator>
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={isDark ? 'dark' : 'light'}>
        <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bgColor} />

          <Header
            isDark={isDark}
            fontsLoaded={fontsLoaded}
            onToggleTheme={() => setIsDark((prev) => !prev)}
            completedCount={completedCount}
            totalCount={todos.length}
          />

          <DraggableFlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            onDragEnd={({ data }) => persistAndSet(data)}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <YStack alignItems="center" paddingTop="$10" gap="$3">
                <Text fontSize={52}>🔮</Text>
                <Text
                  color="$color10"
                  fontSize="$4"
                  fontFamily={fontsLoaded ? 'Cinzel_400Regular' : undefined}
                  textAlign="center"
                >
                  Your grimoire is empty…{'\n'}Add your first spell below.
                </Text>
              </YStack>
            }
          />

          <TouchableOpacity
            style={[styles.fab, { backgroundColor: isDark ? '#7c3aed' : '#6d28d9', shadowColor: '#7c3aed' }]}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Sparkles color="white" size={26} />
          </TouchableOpacity>

          <AddTodoModal
            visible={modalVisible}
            fontsLoaded={fontsLoaded}
            onClose={() => setModalVisible(false)}
            onAdd={handleAdd}
          />
        </SafeAreaView>
      </TamaguiProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingTop: 12, paddingBottom: 120 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 32,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
})

export default App
