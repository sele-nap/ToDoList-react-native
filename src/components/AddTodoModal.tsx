import React, { useState } from 'react'
import { Platform, TouchableOpacity, StyleSheet } from 'react-native'
import { Sheet, YStack, XStack, Text, TextArea, View } from 'tamagui'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Sparkles, X, Calendar, AlertCircle } from '@tamagui/lucide-icons'
import { Priority } from '../types'

interface Props {
  visible: boolean
  fontsLoaded: boolean
  onClose: () => void
  onAdd: (text: string, priority: Priority, dueDate?: string) => void
}

type PriorityOption = {
  value: Priority
  label: string
  sublabel: string
  color: string
  bg: string
}

const PRIORITIES: PriorityOption[] = [
  { value: 'high', label: '🔥 Urgent', sublabel: 'Must do', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  { value: 'medium', label: '🌙 Normal', sublabel: 'Should do', color: '#d97706', bg: 'rgba(217,119,6,0.12)' },
  { value: 'low', label: '🌿 Gentle', sublabel: 'Nice to do', color: '#16a34a', bg: 'rgba(22,163,74,0.12)' },
]

const AddTodoModal: React.FC<Props> = ({ visible, fontsLoaded, onClose, onAdd }) => {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = () => {
    if (!text.trim()) {
      setError('Whisper your spell into existence…')
      return
    }
    onAdd(text.trim(), priority, selectedDate?.toISOString())
    reset()
    onClose()
  }

  const reset = () => {
    setText('')
    setPriority('medium')
    setSelectedDate(null)
    setError('')
    setShowDatePicker(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleDateChange = (_: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios')
    if (date) setSelectedDate(date)
  }

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <Sheet
      modal
      open={visible}
      onOpenChange={(open: boolean) => !open && handleClose()}
      snapPoints={[88]}
      dismissOnSnapToBottom
      zIndex={100_000}
    >
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.7)" />

      <Sheet.Frame
        backgroundColor="$color2"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
        borderTopWidth={1}
        borderColor="$color5"
        padding="$5"
        gap="$4"
      >
        <Sheet.Handle backgroundColor="$color6" />

        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$2" alignItems="center">
            <Sparkles color="#c084fc" size={20} />
            <Text
              color="$color12"
              fontSize={20}
              fontWeight="700"
              fontFamily={fontsLoaded ? 'Cinzel_700Bold' : undefined}
              letterSpacing={1}
            >
              New Spell
            </Text>
          </XStack>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <X color="#a78bfa" size={18} />
          </TouchableOpacity>
        </XStack>

        <YStack gap="$1">
          <TextArea
            value={text}
            onChangeText={(t) => { setText(t); setError('') }}
            placeholder="What do you want to brew today?"
            placeholderTextColor="$placeholderColor"
            color="$color12"
            backgroundColor="$color3"
            borderColor={error ? '#ef4444' : '$color5'}
            borderWidth={1}
            borderRadius="$4"
            padding="$3"
            fontSize={15}
            minHeight={80}
            maxLength={200}
            autoFocus
            fontFamily={fontsLoaded ? 'Cinzel_400Regular' : undefined}
          />
          {error ? (
            <XStack gap="$1" alignItems="center">
              <AlertCircle color="#ef4444" size={13} />
              <Text color="#ef4444" fontSize={12}>{error}</Text>
            </XStack>
          ) : null}
        </YStack>

        <YStack gap="$2">
          <Text color="$color10" fontSize={11} fontWeight="700" letterSpacing={1.2} textTransform="uppercase"
            fontFamily={fontsLoaded ? 'Cinzel_400Regular' : undefined}>
            Intensity
          </Text>
          <XStack gap="$2">
            {PRIORITIES.map((opt) => {
              const isSelected = priority === opt.value
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setPriority(opt.value)}
                  style={[
                    styles.priorityBtn,
                    {
                      borderColor: isSelected ? opt.color : '#3b1a6e',
                      backgroundColor: isSelected ? opt.bg : 'rgba(30,16,56,0.6)',
                    },
                  ]}
                >
                  <Text fontSize={13} color={isSelected ? opt.color : '#a78bfa'} fontWeight="700">
                    {opt.label}
                  </Text>
                  <Text fontSize={10} color={isSelected ? opt.color : '#6d28d9'}>
                    {opt.sublabel}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </XStack>
        </YStack>

        <YStack gap="$2">
          <Text color="$color10" fontSize={11} fontWeight="700" letterSpacing={1.2} textTransform="uppercase"
            fontFamily={fontsLoaded ? 'Cinzel_400Regular' : undefined}>
            Moon Date (optional)
          </Text>
          <XStack gap="$2">
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateBtn}
            >
              <Calendar color={selectedDate ? '#c084fc' : '#6d28d9'} size={16} />
              <Text color={selectedDate ? '#c084fc' : '#6d28d9'} fontSize={14} style={styles.dateBtnText}>
                {selectedDate ? formatDate(selectedDate) : 'Pick a date…'}
              </Text>
            </TouchableOpacity>
            {selectedDate && (
              <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.clearDateBtn}>
                <X color="#a78bfa" size={16} />
              </TouchableOpacity>
            )}
          </XStack>
        </YStack>

        {showDatePicker && (
          <View backgroundColor="$color3" borderRadius="$4" overflow="hidden">
            <DateTimePicker
              value={selectedDate ?? new Date()}
              mode="date"
              minimumDate={new Date()}
              onChange={handleDateChange}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />
          </View>
        )}

        <XStack gap="$3" paddingTop="$1">
          <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
            <Text color="#a78bfa" fontWeight="600" fontSize={15}>Dismiss</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAdd} style={styles.castBtn}>
            <Sparkles color="white" size={16} />
            <Text color="white" fontWeight="700" fontSize={15} style={{ marginLeft: 8 }}
              fontFamily={fontsLoaded ? 'Cinzel_400Regular' : undefined}>
              Cast Spell
            </Text>
          </TouchableOpacity>
        </XStack>
      </Sheet.Frame>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(124,58,237,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityBtn: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dateBtn: {
    flex: 1,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3b1a6e',
    backgroundColor: 'rgba(30,16,56,0.6)',
  },
  dateBtnText: { flex: 1 },
  clearDateBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3b1a6e',
    backgroundColor: 'rgba(30,16,56,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3b1a6e',
    backgroundColor: 'rgba(30,16,56,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  castBtn: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
})

export default AddTodoModal
