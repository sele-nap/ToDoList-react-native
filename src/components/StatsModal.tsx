import { BarChart2, X } from '@tamagui/lucide-icons'
import { useMemo } from 'react'
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Sheet, Text, XStack, YStack } from 'tamagui'
import { Category, Todo } from '../types'
import { computeCategoryStats, computePriorityStats, computeWeeklyStats } from '../utils/stats'

interface StatsModalProps {
  visible: boolean
  onClose: () => void
  todos: Todo[]
  categories: Category[]
  isDark: boolean
}

const BAR_MAX_HEIGHT = 80

export default function StatsModal({ visible, onClose, todos, categories, isDark }: StatsModalProps) {
  const sheetBg = isDark ? '#150d1f' : '#faf5ff'
  const textColor = isDark ? '#f3e8ff' : '#1e1038'
  const mutedColor = isDark ? '#a78bca' : '#6b4fa0'
  const handleColor = isDark ? '#4c2d7a' : '#c4b5fd'
  const barBg = isDark ? '#2d1f45' : '#ede9fe'

  const weekly = useMemo(() => computeWeeklyStats(todos), [todos])
  const priority = useMemo(() => computePriorityStats(todos), [todos])
  const categoryStats = useMemo(() => computeCategoryStats(todos, categories), [todos, categories])

  const weeklyMax = Math.max(...weekly.map(d => d.count), 1)
  const priorityMax = Math.max(...priority.map(p => p.count), 1)

  const completed = todos.filter(t => t.completed).length
  const total = todos.length
  const overdue = todos.filter(t => t.dueDate && !t.completed && new Date(t.dueDate) < new Date()).length

  return (
    <Sheet open={visible} onOpenChange={(open: boolean) => !open && onClose()} snapPoints={[88]} dismissOnSnapToBottom modal>
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.5)" />
      <Sheet.Frame style={{ backgroundColor: sheetBg, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding={24} gap={24}>
            <View style={[styles.handle, { backgroundColor: handleColor }]} />

            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" gap={8}>
                <BarChart2 size={18} color="#7c3aed" />
                <Text style={{ fontFamily: 'Cinzel_700Bold' }} fontSize={18} color={textColor} letterSpacing={0.5}>Stats</Text>
              </XStack>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close">
                <X size={20} color={mutedColor} />
              </TouchableOpacity>
            </XStack>

            {/* Summary cards */}
            <XStack gap={10}>
              {[
                { label: 'Total', value: total, color: '#7c3aed' },
                { label: 'Done', value: completed, color: '#16a34a' },
                { label: 'Overdue', value: overdue, color: '#ef4444' },
              ].map(card => (
                <YStack key={card.label} flex={1} style={{ backgroundColor: card.color + '18', borderRadius: 12, borderWidth: 1, borderColor: card.color + '44' }} padding={12} alignItems="center">
                  <Text style={{ fontFamily: 'Cinzel_700Bold' }} fontSize={24} color={card.color}>{card.value}</Text>
                  <Text style={{ fontFamily: 'Cinzel_400Regular' }} fontSize={11} color={mutedColor} marginTop={2}>{card.label}</Text>
                </YStack>
              ))}
            </XStack>

            {/* Weekly completions */}
            <YStack gap={8}>
              <Text style={{ fontFamily: 'Cinzel_400Regular' }} fontSize={12} color={mutedColor} letterSpacing={0.5}>LAST 7 DAYS</Text>
              <XStack gap={6} alignItems="flex-end" height={BAR_MAX_HEIGHT + 28}>
                {weekly.map((day) => {
                  const h = weeklyMax > 0 ? Math.max((day.count / weeklyMax) * BAR_MAX_HEIGHT, day.count > 0 ? 8 : 0) : 0
                  const isToday = day.date === new Date().toISOString().split('T')[0]
                  return (
                    <YStack key={day.date} flex={1} alignItems="center" justifyContent="flex-end">
                      {day.count > 0 && (
                        <Text fontSize={9} color={mutedColor} marginBottom={2}>{day.count}</Text>
                      )}
                      <View style={{ width: '100%', height: h || 4, backgroundColor: day.count > 0 ? '#7c3aed' : barBg, borderRadius: 4, opacity: isToday ? 1 : 0.7 }} />
                      <Text fontSize={10} color={isToday ? '#7c3aed' : mutedColor} marginTop={4} style={{ fontFamily: 'Cinzel_400Regular' }}>{day.label}</Text>
                    </YStack>
                  )
                })}
              </XStack>
            </YStack>

            {/* Priority breakdown */}
            <YStack gap={8}>
              <Text style={{ fontFamily: 'Cinzel_400Regular' }} fontSize={12} color={mutedColor} letterSpacing={0.5}>BY PRIORITY</Text>
              {priority.map(p => (
                <XStack key={p.priority} alignItems="center" gap={10}>
                  <Text style={{ fontFamily: 'Cinzel_400Regular' }} fontSize={12} color={p.color} width={56}>{p.priority}</Text>
                  <View style={{ flex: 1, height: 8, backgroundColor: barBg, borderRadius: 4, overflow: 'hidden' }}>
                    <View style={{ height: 8, width: `${(p.count / priorityMax) * 100}%` as `${number}%`, backgroundColor: p.color, borderRadius: 4 }} />
                  </View>
                  <Text fontSize={12} color={mutedColor} width={20} style={{ fontFamily: 'Cinzel_400Regular' }}>{p.count}</Text>
                </XStack>
              ))}
            </YStack>

            {/* Category breakdown */}
            {categoryStats.length > 0 && (
              <YStack gap={8}>
                <Text style={{ fontFamily: 'Cinzel_400Regular' }} fontSize={12} color={mutedColor} letterSpacing={0.5}>BY CATEGORY</Text>
                {categoryStats.map(cat => {
                  const catMax = Math.max(...categoryStats.map(c => c.count), 1)
                  return (
                    <XStack key={cat.name} alignItems="center" gap={10}>
                      <Text fontSize={12} width={56} numberOfLines={1} style={{ fontFamily: 'Cinzel_400Regular', color: cat.color }}>{cat.emoji} {cat.name}</Text>
                      <View style={{ flex: 1, height: 8, backgroundColor: barBg, borderRadius: 4, overflow: 'hidden' }}>
                        <View style={{ height: 8, width: `${(cat.count / catMax) * 100}%` as `${number}%`, backgroundColor: cat.color, borderRadius: 4 }} />
                      </View>
                      <Text fontSize={12} color={mutedColor} width={20} style={{ fontFamily: 'Cinzel_400Regular' }}>{cat.count}</Text>
                    </XStack>
                  )
                })}
              </YStack>
            )}

            {total === 0 && (
              <YStack alignItems="center" paddingVertical={24}>
                <Text fontSize={32} marginBottom={8}>📊</Text>
                <Text style={{ fontFamily: 'Cinzel_400Regular' }} fontSize={14} color={mutedColor} textAlign="center">Add tasks to see your stats!</Text>
              </YStack>
            )}
          </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 4 },
  closeBtn: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
})
