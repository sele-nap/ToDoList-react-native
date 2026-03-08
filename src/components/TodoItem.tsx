import {
  Calendar,
  CheckCircle2,
  Circle,
  FileText,
  Flame,
  GripVertical,
  Leaf,
  RotateCw,
  Timer,
} from '@tamagui/lucide-icons'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Card, Text, XStack, YStack } from 'tamagui'
import { Category, Priority, Todo } from '../types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onEdit: (id: string) => void
  onDrag: () => void
  isActive: boolean
  isDark: boolean
  category?: Category
}

const PRIORITY: Record<Priority, { icon: typeof Flame; color: string; label: string }> = {
  high: { icon: Flame, color: '#ef4444', label: 'High' },
  medium: { icon: Timer, color: '#d97706', label: 'Medium' },
  low: { icon: Leaf, color: '#16a34a', label: 'Low' },
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isOverdue(dateStr: string): boolean {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return new Date(dateStr) < today
}

export default function TodoItem({ todo, onToggle, onEdit, onDrag, isActive, isDark, category }: TodoItemProps) {
  const priority = PRIORITY[todo.priority]
  const PriorityIcon = priority.icon
  const overdue = todo.dueDate && !todo.completed && isOverdue(todo.dueDate)
  const completedSubTasks = todo.subTasks?.filter(s => s.completed).length ?? 0
  const totalSubTasks = todo.subTasks?.length ?? 0

  const cardBg = isDark ? (isActive ? '#2d1f45' : '#1e1530') : (isActive ? '#ede9fe' : '#ffffff')
  const borderColor = overdue ? '#ef4444' : isDark ? '#2d1f45' : '#ddd6fe'
  const textColor = isDark ? '#f3e8ff' : '#1e1038'
  const mutedColor = isDark ? '#a78bca' : '#6b4fa0'

  return (
    <View style={{ marginBottom: 10 }}>
      <Card
        padding={14}
        borderRadius={14}
        borderWidth={1}
        style={{ backgroundColor: cardBg, borderColor, shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 2 }, shadowOpacity: isActive ? 0.3 : 0.1, shadowRadius: 4, elevation: isActive ? 6 : 2 }}
        accessible={false}
      >
        <XStack alignItems="center" gap={10}>
          {/* Checkbox */}
          <TouchableOpacity
            onPress={() => onToggle(todo.id)}
            style={styles.touchTarget}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: todo.completed }}
            accessibilityLabel={todo.completed ? `Mark "${todo.text}" as incomplete` : `Mark "${todo.text}" as complete`}
          >
            {todo.completed
              ? <CheckCircle2 size={24} color="#7c3aed" />
              : <Circle size={24} color={mutedColor} />}
          </TouchableOpacity>

          {/* Content — tappable to edit */}
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => onEdit(todo.id)}
            accessibilityRole="button"
            accessibilityLabel={`Edit task: ${todo.text}`}
            activeOpacity={0.7}
          >
            <YStack gap={4}>
              <Text
                style={{ fontFamily: 'Cinzel_400Regular' }}
                fontSize={14}
                color={todo.completed ? mutedColor : textColor}
                textDecorationLine={todo.completed ? 'line-through' : 'none'}
                numberOfLines={2}
              >
                {todo.text}
              </Text>

              <XStack gap={8} alignItems="center" flexWrap="wrap">
                {/* Priority badge */}
                <XStack alignItems="center" gap={3}>
                  <PriorityIcon size={11} color={priority.color} />
                  <Text fontSize={10} color={priority.color} style={{ fontFamily: 'Cinzel_400Regular' }}>{priority.label}</Text>
                </XStack>

                {/* Due date */}
                {todo.dueDate && (
                  <XStack alignItems="center" gap={3}>
                    <Calendar size={11} color={overdue ? '#ef4444' : mutedColor} />
                    <Text fontSize={10} color={overdue ? '#ef4444' : mutedColor} style={{ fontFamily: 'Cinzel_400Regular' }}>
                      {overdue ? '⚠ ' : ''}{formatDate(todo.dueDate)}
                    </Text>
                  </XStack>
                )}

                {/* Category chip */}
                {category && (
                  <XStack alignItems="center" gap={3} style={{ backgroundColor: category.color + '22', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
                    <Text fontSize={10}>{category.emoji}</Text>
                    <Text fontSize={10} color={category.color} style={{ fontFamily: 'Cinzel_400Regular' }}>{category.name}</Text>
                  </XStack>
                )}

                {/* Subtasks count */}
                {totalSubTasks > 0 && (
                  <Text fontSize={10} color={mutedColor} style={{ fontFamily: 'Cinzel_400Regular' }}>
                    ☑ {completedSubTasks}/{totalSubTasks}
                  </Text>
                )}

                {/* Notes indicator */}
                {todo.notes && <FileText size={11} color={mutedColor} />}

                {/* Recurrence indicator */}
                {todo.recurrence && <RotateCw size={11} color={mutedColor} />}
              </XStack>
            </YStack>
          </TouchableOpacity>

          {/* Drag handle */}
          <TouchableOpacity
            onLongPress={onDrag}
            style={styles.touchTarget}
            delayLongPress={100}
            accessibilityRole="button"
            accessibilityLabel="Hold to reorder task"
            accessibilityHint="Long press and drag to change the position of this task"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <GripVertical size={18} color={mutedColor} />
          </TouchableOpacity>
        </XStack>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  touchTarget: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
})
