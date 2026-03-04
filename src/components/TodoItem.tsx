import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { XStack, YStack, Text, Card } from 'tamagui'
import { Trash2, GripVertical, Flame, Clock, Leaf, Calendar, AlertTriangle } from '@tamagui/lucide-icons'
import { Todo, Priority } from '../types'

interface Props {
  todo: Todo
  fontsLoaded: boolean
  onToggleComplete: () => void
  onDelete: () => void
  drag: () => void
  isActive: boolean
}

type PriorityConfig = {
  color: string
  bg: string
  label: string
  Icon: React.ElementType
}

const PRIORITY: Record<Priority, PriorityConfig> = {
  high: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: 'Urgent', Icon: Flame },
  medium: { color: '#d97706', bg: 'rgba(217,119,6,0.12)', label: 'Normal', Icon: Clock },
  low: { color: '#16a34a', bg: 'rgba(22,163,74,0.12)', label: 'Gentle', Icon: Leaf },
}

const formatDate = (iso: string): string => {
  const target = new Date(iso)
  target.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const isOverdue = (iso?: string, completed?: boolean) => {
  if (!iso || completed) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(iso) < today
}

const TodoItem: React.FC<Props> = ({ todo, fontsLoaded, onToggleComplete, onDelete, drag, isActive }) => {
  const p = PRIORITY[todo.priority]
  const PriorityIcon = p.Icon
  const overdue = isOverdue(todo.dueDate, todo.completed)

  return (
    <Card
      marginHorizontal="$3"
      marginVertical="$1.5"
      borderRadius="$5"
      borderWidth={1}
      borderColor={isActive ? '$color6' : '$color4'}
      backgroundColor={isActive ? '$color3' : '$color2'}
      overflow="hidden"
    >
      <XStack alignItems="center">
        <XStack width={4} backgroundColor={p.color} alignSelf="stretch" />

        <TouchableOpacity onPress={onToggleComplete} style={styles.checkBtn}>
          <XStack
            width={24}
            height={24}
            borderRadius={12}
            borderWidth={2}
            borderColor={todo.completed ? p.color : '$color5'}
            backgroundColor={todo.completed ? p.color : 'transparent'}
            alignItems="center"
            justifyContent="center"
          >
            {todo.completed && (
              <Text color="white" fontSize={13} fontWeight="bold" lineHeight={16}>✓</Text>
            )}
          </XStack>
        </TouchableOpacity>

        <YStack flex={1} paddingVertical="$3" paddingRight="$2" gap="$1.5">
          <Text
            color={todo.completed ? '$color9' : '$color12'}
            fontSize={15}
            fontWeight="500"
            textDecorationLine={todo.completed ? 'line-through' : 'none'}
            numberOfLines={2}
            fontFamily={fontsLoaded ? 'Cinzel_400Regular' : undefined}
            letterSpacing={0.3}
          >
            {todo.text}
          </Text>

          <XStack gap="$2" alignItems="center" flexWrap="wrap">
            <XStack paddingHorizontal="$2" paddingVertical={3} borderRadius="$10" backgroundColor={p.bg} alignItems="center" gap={4}>
              <PriorityIcon color={p.color} size={11} />
              <Text color={p.color} fontSize={11} fontWeight="700">{p.label}</Text>
            </XStack>

            {todo.dueDate && (
              <XStack alignItems="center" gap={4}>
                {overdue ? <AlertTriangle color="#ef4444" size={12} /> : <Calendar color="$color10" size={12} />}
                <Text color={overdue ? '#ef4444' : '$color10'} fontSize={12}>
                  {formatDate(todo.dueDate)}
                </Text>
              </XStack>
            )}
          </XStack>
        </YStack>

        <YStack gap="$2" paddingHorizontal="$2" alignItems="center">
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
            <Trash2 color="#ef4444" size={16} />
          </TouchableOpacity>
          <TouchableOpacity onLongPress={drag} style={styles.dragBtn}>
            <GripVertical color="#8b5cf6" size={18} />
          </TouchableOpacity>
        </YStack>
      </XStack>
    </Card>
  )
}

const styles = StyleSheet.create({
  checkBtn: { padding: 14, paddingRight: 10 },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(239,68,68,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default TodoItem
