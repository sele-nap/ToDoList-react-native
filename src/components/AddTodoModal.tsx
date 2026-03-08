import DateTimePicker from '@react-native-community/datetimepicker'
import { AlertCircle, Calendar, Sparkles, X } from '@tamagui/lucide-icons'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native'
import { Sheet, Text, TextArea, XStack, YStack } from 'tamagui'

import { Category, Priority, RecurrenceRule, Todo } from '../types'
import RecurrencePicker from './RecurrencePicker'

interface AddTodoModalProps {
  visible: boolean
  onClose: () => void
  onAdd: (todo: Todo) => void
  isDark: boolean
  categories: Category[]
  onRequestCategoryCreate: () => void
}

const PRIORITIES: { value: Priority; label: string; color: string; emoji: string }[] = [
  { value: 'high', label: 'High', color: '#ef4444', emoji: '🔴' },
  { value: 'medium', label: 'Medium', color: '#d97706', emoji: '🟡' },
  { value: 'low', label: 'Low', color: '#16a34a', emoji: '🟢' },
]

const MAX_LENGTH = 200

export default function AddTodoModal({ visible, onClose, onAdd, isDark, categories, onRequestCategoryCreate }: AddTodoModalProps) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [recurrence, setRecurrence] = useState<RecurrenceRule | undefined>(undefined)

  const sheetBg = isDark ? '#150d1f' : '#faf5ff'
  const inputBg = isDark ? '#1e1530' : '#f3e8ff'
  const borderColor = isDark ? '#2d1f45' : '#ddd6fe'
  const textColor = isDark ? '#f3e8ff' : '#1e1038'
  const mutedColor = isDark ? '#a78bca' : '#6b4fa0'
  const handleColor = isDark ? '#4c2d7a' : '#c4b5fd'

  const canSubmit = text.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    const todo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      priority,
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : undefined,
      createdAt: new Date().toISOString(),
      categoryId,
      recurrence,
    }
    setText('')
    setPriority('medium')
    setDueDate(null)
    setCategoryId(undefined)
    setRecurrence(undefined)
    onAdd(todo)
    onClose()
  }

  const handleClose = () => {
    Keyboard.dismiss()
    onClose()
  }

  return (
    <Sheet
      open={visible}
      onOpenChange={(open: boolean) => !open && handleClose()}
      snapPoints={[88]}
      dismissOnSnapToBottom
      modal
    >
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.5)" />
      <Sheet.Frame
        style={{ backgroundColor: sheetBg, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <YStack padding={24}>
                {/* Handle */}
                <View style={[styles.handle, { backgroundColor: handleColor }]} />

                {/* Header */}
                <XStack justifyContent="space-between" alignItems="center" marginBottom={20}>
                  <XStack alignItems="center" gap={8}>
                    <Sparkles size={18} color="#7c3aed" />
                    <Text
                      style={{ fontFamily: 'Cinzel_700Bold' }}
                      fontSize={18}
                      color={textColor}
                      letterSpacing={0.5}
                    >
                      New task
                    </Text>
                  </XStack>
                  <TouchableOpacity
                    onPress={handleClose}
                    style={styles.closeBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Close modal"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <X size={20} color={mutedColor} />
                  </TouchableOpacity>
                </XStack>

                {/* Text input */}
                <TextArea
                  value={text}
                  onChangeText={(t) => t.length <= MAX_LENGTH && setText(t)}
                  placeholder="Describe your quest..."
                  // @ts-ignore — raw hex not in ColorTokens but valid at runtime
                  placeholderTextColor={mutedColor}
                  style={{
                    fontFamily: 'Cinzel_400Regular',
                    backgroundColor: inputBg,
                    borderColor: text.length === MAX_LENGTH ? '#ef4444' : borderColor,
                    color: textColor,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 14,
                    minHeight: 80,
                    marginBottom: 4,
                  }}
                  multiline
                  numberOfLines={3}
                  autoFocus
                  returnKeyType="done"
                  blurOnSubmit
                  accessibilityLabel="Task description"
                  accessibilityHint="Enter the description of your task"
                />

                {/* Character counter */}
                <XStack justifyContent="flex-end" marginBottom={14}>
                  <Text
                    fontSize={11}
                    color={text.length >= MAX_LENGTH * 0.9 ? '#ef4444' : mutedColor}
                  >
                    {text.length}/{MAX_LENGTH}
                  </Text>
                </XStack>

                {/* Priority selector */}
                <Text
                  style={{ fontFamily: 'Cinzel_400Regular' }}
                  fontSize={12}
                  color={mutedColor}
                  marginBottom={8}
                  letterSpacing={0.5}
                  accessibilityRole="header"
                >
                  PRIORITY
                </Text>
                <XStack gap={8} marginBottom={16}>
                  {PRIORITIES.map((p) => (
                    <TouchableOpacity
                      key={p.value}
                      onPress={() => setPriority(p.value)}
                      style={[
                        styles.priorityBtn,
                        {
                          backgroundColor: priority === p.value ? p.color + '22' : inputBg,
                          borderColor: priority === p.value ? p.color : borderColor,
                        },
                      ]}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: priority === p.value }}
                      accessibilityLabel={`${p.label} priority`}
                    >
                      <Text
                        fontSize={12}
                        color={priority === p.value ? p.color : mutedColor}
                        style={{ fontFamily: 'Cinzel_400Regular' }}
                      >
                        {p.emoji} {p.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </XStack>

                {/* Category picker */}
                {categories.length > 0 && (
                  <>
                    <Text
                      style={{ fontFamily: 'Cinzel_400Regular' }}
                      fontSize={12}
                      color={mutedColor}
                      marginBottom={8}
                      letterSpacing={0.5}
                    >
                      CATEGORY
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                      <XStack gap={8}>
                        <TouchableOpacity
                          onPress={() => setCategoryId(undefined)}
                          style={[
                            styles.catChip,
                            {
                              backgroundColor: !categoryId ? '#7c3aed22' : inputBg,
                              borderColor: !categoryId ? '#7c3aed' : borderColor,
                            },
                          ]}
                          accessibilityRole="radio"
                          accessibilityState={{ checked: !categoryId }}
                          accessibilityLabel="No category"
                        >
                          <Text fontSize={12} color={!categoryId ? '#7c3aed' : mutedColor} style={{ fontFamily: 'Cinzel_400Regular' }}>
                            None
                          </Text>
                        </TouchableOpacity>
                        {categories.map(cat => (
                          <TouchableOpacity
                            key={cat.id}
                            onPress={() => setCategoryId(categoryId === cat.id ? undefined : cat.id)}
                            style={[
                              styles.catChip,
                              {
                                backgroundColor: categoryId === cat.id ? cat.color + '22' : inputBg,
                                borderColor: categoryId === cat.id ? cat.color : borderColor,
                              },
                            ]}
                            accessibilityRole="radio"
                            accessibilityState={{ checked: categoryId === cat.id }}
                            accessibilityLabel={cat.name}
                          >
                            <Text fontSize={12} color={categoryId === cat.id ? cat.color : mutedColor} style={{ fontFamily: 'Cinzel_400Regular' }}>
                              {cat.emoji} {cat.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </XStack>
                    </ScrollView>
                  </>
                )}

                {/* Due date */}
                <XStack justifyContent="space-between" alignItems="center" marginBottom={16}>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={[styles.dateBtn, { backgroundColor: inputBg, borderColor }]}
                    accessibilityRole="button"
                    accessibilityLabel={dueDate ? `Due date: ${dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` : 'Set due date'}
                    accessibilityHint="Opens a date picker"
                  >
                    <Calendar size={14} color={dueDate ? '#7c3aed' : mutedColor} />
                    <Text
                      fontSize={13}
                      color={dueDate ? '#7c3aed' : mutedColor}
                      style={{ fontFamily: 'Cinzel_400Regular' }}
                    >
                      {dueDate
                        ? dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : 'Due date'}
                    </Text>
                  </TouchableOpacity>

                  {dueDate && (
                    <TouchableOpacity
                      onPress={() => setDueDate(null)}
                      style={styles.clearDate}
                      accessibilityRole="button"
                      accessibilityLabel="Clear due date"
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <AlertCircle size={14} color={mutedColor} />
                      <Text fontSize={11} color={mutedColor}>Clear</Text>
                    </TouchableOpacity>
                  )}
                </XStack>

                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate ?? new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minimumDate={new Date()}
                    onChange={(_, date) => {
                      setShowDatePicker(false)
                      if (date) setDueDate(date)
                    }}
                  />
                )}

                {/* Recurrence */}
                <Text style={{ fontFamily: 'Cinzel_400Regular' }} fontSize={12} color={mutedColor} marginBottom={8} letterSpacing={0.5}>RECURRENCE</Text>
                <RecurrencePicker value={recurrence} onChange={setRecurrence} isDark={isDark} />
                <View style={{ height: 20 }} />

                {/* Submit */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={[
                    styles.submitBtn,
                    { backgroundColor: canSubmit ? '#7c3aed' : (isDark ? '#2d1f45' : '#ddd6fe') },
                  ]}
                  disabled={!canSubmit}
                  accessibilityRole="button"
                  accessibilityLabel="Add task"
                  accessibilityState={{ disabled: !canSubmit }}
                  accessibilityHint={canSubmit ? 'Adds the task to your list' : 'Enter a task description first'}
                >
                  <Text
                    style={{ fontFamily: 'Cinzel_700Bold' }}
                    color={canSubmit ? 'white' : mutedColor}
                    fontSize={15}
                    letterSpacing={0.5}
                  >
                    ✨ Add task
                  </Text>
                </TouchableOpacity>
              </YStack>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Sheet.Frame>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  closeBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    marginRight: 8,
    minHeight: 44,
  },
  clearDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  submitBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
})
