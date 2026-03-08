import { CheckCircle2, Circle, Plus, Trash2 } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'
import { SubTask } from '../types'

interface SubTaskListProps {
  subTasks: SubTask[]
  onChange: (subTasks: SubTask[]) => void
  isDark: boolean
}

export default function SubTaskList({ subTasks, onChange, isDark }: SubTaskListProps) {
  const [newText, setNewText] = useState('')
  const border = isDark ? '#2d1f45' : '#ddd6fe'
  const textColor = isDark ? '#f3e8ff' : '#1e1038'
  const mutedColor = isDark ? '#a78bca' : '#6b4fa0'
  const inputBg = isDark ? '#150d1f' : '#f3e8ff'

  function addSubTask() {
    if (!newText.trim()) return
    const st: SubTask = { id: Date.now().toString(), text: newText.trim(), completed: false }
    onChange([...subTasks, st])
    setNewText('')
  }

  function toggleSubTask(id: string) {
    onChange(subTasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s))
  }

  function deleteSubTask(id: string) {
    onChange(subTasks.filter(s => s.id !== id))
  }

  return (
    <YStack gap={6}>
      {subTasks.map(st => (
        <XStack key={st.id} alignItems="center" gap={8}>
          <TouchableOpacity
            onPress={() => toggleSubTask(st.id)}
            style={styles.iconBtn}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: st.completed }}
            accessibilityLabel={st.completed ? `Uncheck: ${st.text}` : `Check: ${st.text}`}
          >
            {st.completed
              ? <CheckCircle2 size={18} color="#7c3aed" />
              : <Circle size={18} color={mutedColor} />}
          </TouchableOpacity>
          <Text
            style={{ fontFamily: 'Cinzel_400Regular' }}
            flex={1}
            fontSize={13}
            color={st.completed ? mutedColor : textColor}
            textDecorationLine={st.completed ? 'line-through' : 'none'}
          >
            {st.text}
          </Text>
          <TouchableOpacity
            onPress={() => deleteSubTask(st.id)}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel={`Delete subtask: ${st.text}`}
          >
            <Trash2 size={14} color={mutedColor} />
          </TouchableOpacity>
        </XStack>
      ))}

      <XStack gap={8} alignItems="center" marginTop={4}>
        <TextInput
          value={newText}
          onChangeText={setNewText}
          onSubmitEditing={addSubTask}
          placeholder="Add a step..."
          placeholderTextColor={mutedColor}
          style={[styles.input, { backgroundColor: inputBg, borderColor: border, color: textColor }]}
          returnKeyType="done"
          blurOnSubmit={false}
        />
        <TouchableOpacity
          onPress={addSubTask}
          style={[styles.addBtn, { backgroundColor: newText.trim() ? '#7c3aed' : (isDark ? '#2d1f45' : '#ddd6fe') }]}
          disabled={!newText.trim()}
          accessibilityRole="button"
          accessibilityLabel="Add subtask"
        >
          <Plus size={16} color={newText.trim() ? 'white' : mutedColor} />
        </TouchableOpacity>
      </XStack>
    </YStack>
  )
}

const styles = StyleSheet.create({
  iconBtn: { minWidth: 36, minHeight: 36, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8, fontSize: 13, fontFamily: 'Cinzel_400Regular' },
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
})
