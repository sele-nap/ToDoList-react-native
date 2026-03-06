import {
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  GripVertical,
  Leaf,
  Timer,
  Trash2,
} from '@tamagui/lucide-icons'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Card, Text, XStack, YStack } from 'tamagui'

import { Priority, Todo } from '../types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onDrag: () => void
  isActive: boolean
  isDark: boolean
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
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateStr) < today
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onDrag,
  isActive,
  isDark,
}: TodoItemProps) {
  const priority = PRIORITY[todo.priority]
  const PriorityIcon = priority.icon
  const overdue = todo.dueDate && !todo.completed && isOverdue(todo.dueDate)

  const cardBg = isDark
    ? isActive ? '#2d1f45' : '#1e1530'
    : isActive ? '#ede9fe' : '#ffffff'
  const borderColor = overdue ? '#ef4444' : isDark ? '#2d1f45' : '#ddd6fe'
  const textColor = isDark ? '#f3e8ff' : '#1e1038'
  const mutedColor = isDark ? '#a78bca' : '#6b4fa0'

  return (
    <Card
      marginBottom={10}
      padding={14}
      borderRadius={14}
      borderWidth={1}
      style={{
        backgroundColor: cardBg,
        borderColor,
        shadowColor: '#7c3aed',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isActive ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: isActive ? 6 : 2,
      }}
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
          {todo.completed ? (
            <CheckCircle2 size={24} color="#7c3aed" />
          ) : (
            <Circle size={24} color={mutedColor} />
          )}
        </TouchableOpacity>

        {/* Content */}
        <YStack flex={1} gap={4}>
          <Text
            style={{ fontFamily: 'Cinzel_400Regular' }}
            fontSize={14}
            color={todo.completed ? mutedColor : textColor}
            textDecorationLine={todo.completed ? 'line-through' : 'none'}
            numberOfLines={2}
            accessibilityLabel={todo.text}
          >
            {todo.text}
          </Text>

          <XStack gap={10} alignItems="center">
            {/* Priority badge */}
            <XStack alignItems="center" gap={3} accessibilityLabel={`Priority: ${priority.label}`}>
              <PriorityIcon size={11} color={priority.color} />
              <Text fontSize={10} color={priority.color} style={styles.badge}>
                {priority.label}
              </Text>
            </XStack>

            {/* Due date */}
            {todo.dueDate && (
              <XStack
                alignItems="center"
                gap={3}
                accessibilityLabel={
                  overdue
                    ? `Overdue since ${formatDate(todo.dueDate)}`
                    : `Due on ${formatDate(todo.dueDate)}`
                }
              >
                <Calendar size={11} color={overdue ? '#ef4444' : mutedColor} />
                <Text
                  fontSize={10}
                  color={overdue ? '#ef4444' : mutedColor}
                  style={styles.badge}
                >
                  {overdue ? '⚠ ' : ''}{formatDate(todo.dueDate)}
                </Text>
              </XStack>
            )}
          </XStack>
        </YStack>

        {/* Delete */}
        <TouchableOpacity
          onPress={() => onDelete(todo.id)}
          style={styles.touchTarget}
          accessibilityRole="button"
          accessibilityLabel={`Delete task: ${todo.text}`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Trash2 size={16} color={mutedColor} />
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
  )
}

const styles = StyleSheet.create({
  badge: {
    fontFamily: 'Cinzel_400Regular',
  },
  touchTarget: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
