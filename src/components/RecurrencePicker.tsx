import { RotateCw } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'
import { RecurrenceFrequency, RecurrenceRule } from '../types'

interface RecurrencePickerProps {
  value: RecurrenceRule | undefined
  onChange: (rule: RecurrenceRule | undefined) => void
  isDark: boolean
}

const FREQUENCIES: { value: RecurrenceFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function RecurrencePicker({ value, onChange, isDark }: RecurrencePickerProps) {
  const [expanded, setExpanded] = useState(!!value)
  const inputBg = isDark ? '#1e1530' : '#f3e8ff'
  const border = isDark ? '#2d1f45' : '#ddd6fe'
  const textColor = isDark ? '#f3e8ff' : '#1e1038'
  const mutedColor = isDark ? '#a78bca' : '#6b4fa0'

  const rule = value ?? { frequency: 'weekly' as RecurrenceFrequency, interval: 1 }

  function toggle() {
    if (expanded) {
      onChange(undefined)
      setExpanded(false)
    } else {
      onChange({ frequency: 'weekly', interval: 1 })
      setExpanded(true)
    }
  }

  function setFrequency(f: RecurrenceFrequency) {
    onChange({ ...rule, frequency: f, daysOfWeek: f === 'weekly' ? rule.daysOfWeek : undefined })
  }

  function setInterval(n: number) {
    if (n < 1 || n > 99) return
    onChange({ ...rule, interval: n })
  }

  function toggleDay(day: number) {
    const days = rule.daysOfWeek ?? []
    const next = days.includes(day) ? days.filter(d => d !== day) : [...days, day].sort()
    onChange({ ...rule, daysOfWeek: next.length > 0 ? next : undefined })
  }

  return (
    <YStack>
      <TouchableOpacity
        onPress={toggle}
        style={[styles.toggleRow, { backgroundColor: inputBg, borderColor: expanded ? '#7c3aed' : border }]}
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Disable recurrence' : 'Enable recurrence'}
      >
        <RotateCw size={14} color={expanded ? '#7c3aed' : mutedColor} />
        <Text style={{ fontFamily: 'Cinzel_400Regular' }} fontSize={13} color={expanded ? '#7c3aed' : mutedColor} marginLeft={6}>
          {expanded ? (rule.interval === 1 ? `Every ${rule.frequency}` : `Every ${rule.interval} ${rule.frequency}s`) : 'Repeat'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <YStack gap={12} marginTop={12} padding={14} style={{ backgroundColor: inputBg, borderRadius: 12, borderWidth: 1, borderColor: '#7c3aed44' }}>
          {/* Frequency */}
          <XStack gap={8}>
            {FREQUENCIES.map(f => (
              <TouchableOpacity
                key={f.value}
                onPress={() => setFrequency(f.value)}
                style={[styles.freqBtn, { backgroundColor: rule.frequency === f.value ? '#7c3aed22' : 'transparent', borderColor: rule.frequency === f.value ? '#7c3aed' : border }]}
                accessibilityRole="radio"
                accessibilityState={{ checked: rule.frequency === f.value }}
              >
                <Text fontSize={12} color={rule.frequency === f.value ? '#7c3aed' : mutedColor} style={{ fontFamily: 'Cinzel_400Regular' }}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </XStack>

          {/* Interval */}
          <XStack alignItems="center" gap={12}>
            <Text fontSize={12} color={mutedColor} style={{ fontFamily: 'Cinzel_400Regular' }}>Every</Text>
            <TouchableOpacity onPress={() => setInterval(rule.interval - 1)} style={[styles.stepBtn, { borderColor: border }]}>
              <Text color={textColor} fontSize={16}>−</Text>
            </TouchableOpacity>
            <Text fontSize={14} color={textColor} style={{ fontFamily: 'Cinzel_700Bold', minWidth: 24, textAlign: 'center' }}>{rule.interval}</Text>
            <TouchableOpacity onPress={() => setInterval(rule.interval + 1)} style={[styles.stepBtn, { borderColor: border }]}>
              <Text color={textColor} fontSize={16}>+</Text>
            </TouchableOpacity>
            <Text fontSize={12} color={mutedColor} style={{ fontFamily: 'Cinzel_400Regular' }}>
              {rule.frequency === 'daily' ? 'day(s)' : rule.frequency === 'weekly' ? 'week(s)' : 'month(s)'}
            </Text>
          </XStack>

          {/* Days of week (weekly only) */}
          {rule.frequency === 'weekly' && (
            <XStack gap={6}>
              {DAYS.map((d, i) => {
                const active = rule.daysOfWeek?.includes(i)
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => toggleDay(i)}
                    style={[styles.dayBtn, { backgroundColor: active ? '#7c3aed' : 'transparent', borderColor: active ? '#7c3aed' : border }]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: !!active }}
                    accessibilityLabel={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
                  >
                    <Text fontSize={11} color={active ? 'white' : mutedColor} style={{ fontFamily: 'Cinzel_400Regular' }}>{d}</Text>
                  </TouchableOpacity>
                )
              })}
            </XStack>
          )}
        </YStack>
      )}
    </YStack>
  )
}

const styles = StyleSheet.create({
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1 },
  freqBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1.5, alignItems: 'center' },
  stepBtn: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  dayBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
})
