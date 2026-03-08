import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, XStack } from 'tamagui'
import { Category, FilterState, FilterStatus, Priority, SortField } from '../types'

interface FilterBarProps {
  filterState: FilterState
  categories: Category[]
  onFilterChange: (f: FilterState) => void
  isDark: boolean
}

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Done' },
  { value: 'overdue', label: 'Overdue' },
]

const PRIORITY_OPTIONS: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'Any priority' },
  { value: 'high', label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low', label: '🟢 Low' },
]

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'createdAt', label: 'Date created' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'alpha', label: 'A → Z' },
]

export default function FilterBar({ filterState, categories, onFilterChange, isDark }: FilterBarProps) {
  const activeBg = '#7c3aed'
  const activeText = 'white'
  const inactiveBg = isDark ? '#1e1530' : '#f3e8ff'
  const inactiveText = isDark ? '#a78bca' : '#6b4fa0'
  const inactiveBorder = isDark ? '#2d1f45' : '#ddd6fe'

  function chip(
    label: string,
    isActive: boolean,
    onPress: () => void,
    key: string
  ) {
    return (
      <TouchableOpacity
        key={key}
        onPress={onPress}
        style={[
          styles.chip,
          {
            backgroundColor: isActive ? activeBg : inactiveBg,
            borderColor: isActive ? activeBg : inactiveBorder,
          },
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={label}
      >
        <Text
          fontSize={12}
          color={isActive ? activeText : inactiveText}
          style={{ fontFamily: 'Cinzel_400Regular' }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scroll}
    >
      {/* Status chips */}
      {STATUS_OPTIONS.map(opt =>
        chip(opt.label, filterState.status === opt.value, () =>
          onFilterChange({ ...filterState, status: opt.value }), `status-${opt.value}`)
      )}

      {/* Divider */}
      <XStack width={1} height={20} backgroundColor={inactiveBorder} marginHorizontal={4} alignSelf="center" />

      {/* Priority */}
      {PRIORITY_OPTIONS.filter(p => p.value !== 'all').map(opt =>
        chip(opt.label, filterState.priorityFilter === opt.value, () =>
          onFilterChange({
            ...filterState,
            priorityFilter: filterState.priorityFilter === opt.value ? 'all' : opt.value as Priority,
          }), `priority-${opt.value}`)
      )}

      {/* Divider */}
      <XStack width={1} height={20} backgroundColor={inactiveBorder} marginHorizontal={4} alignSelf="center" />

      {/* Categories */}
      {categories.map(cat =>
        chip(`${cat.emoji} ${cat.name}`, filterState.categoryFilter === cat.id, () =>
          onFilterChange({
            ...filterState,
            categoryFilter: filterState.categoryFilter === cat.id ? 'all' : cat.id,
          }), `cat-${cat.id}`)
      )}

      {/* Divider if categories exist */}
      {categories.length > 0 && (
        <XStack width={1} height={20} backgroundColor={inactiveBorder} marginHorizontal={4} alignSelf="center" />
      )}

      {/* Sort */}
      {SORT_OPTIONS.map(opt =>
        chip(
          opt.label + (filterState.sortField === opt.value ? (filterState.sortDirection === 'asc' ? ' ↑' : ' ↓') : ''),
          filterState.sortField === opt.value,
          () => onFilterChange({
            ...filterState,
            sortField: opt.value,
            sortDirection: filterState.sortField === opt.value && filterState.sortDirection === 'desc' ? 'asc' : 'desc',
          }),
          `sort-${opt.value}`
        )
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { marginBottom: 6, flexGrow: 0, flexShrink: 0 },
  container: { paddingHorizontal: 16, paddingVertical: 6, gap: 6, flexDirection: 'row', alignItems: 'center', flexGrow: 0 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
})
