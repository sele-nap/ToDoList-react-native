import DateTimePicker from '@react-native-community/datetimepicker'
import { AlertCircle, Calendar, FileText, Sparkles, Trash2, X } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Sheet, Text, XStack, YStack } from 'tamagui'
import { Category, Priority, RecurrenceRule, SubTask, Todo } from '../types'
import RecurrencePicker from './RecurrencePicker'
import SubTaskList from './SubTaskList'

interface EditTodoModalProps {
  todo: Todo | null
  categories: Category[]
  visible: boolean
  onClose: () => void
  onSave: (todo: Todo) => void
  onDelete: (id: string) => void
  isDark: boolean
}

const PRIORITIES: { value: Priority; label: string; color: string; emoji: string }[] = [
  { value: 'high', label: 'High', color: '#ef4444', emoji: '🔴' },
  { value: 'medium', label: 'Medium', color: '#d97706', emoji: '🟡' },
  { value: 'low', label: 'Low', color: '#16a34a', emoji: '🟢' },
]

const MAX_LENGTH = 200

export default function EditTodoModal({ todo, categories, visible, onClose, onSave, onDelete, isDark }: EditTodoModalProps) {
  const [text, setText] = useState('')
  const [notes, setNotes] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [subTasks, setSubTasks] = useState<SubTask[]>([])
  const [recurrence, setRecurrence] = useState<RecurrenceRule | undefined>(undefined)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  useEffect(() => {
    if (todo) {
      setText(todo.text)
      setNotes(todo.notes ?? '')
      setPriority(todo.priority)
      setDueDate(todo.dueDate ? new Date(todo.dueDate + 'T00:00:00') : null)
      setCategoryId(todo.categoryId)
      setSubTasks(todo.subTasks ?? [])
      setRecurrence(todo.recurrence)
      setShowNotes(!!todo.notes)
    }
  }, [todo])

  const sheetBg = isDark ? '#150d1f' : '#faf5ff'
  const inputBg = isDark ? '#1e1530' : '#f3e8ff'
  const border = isDark ? '#2d1f45' : '#ddd6fe'
  const textColor = isDark ? '#f3e8ff' : '#1e1038'
  const mutedColor = isDark ? '#a78bca' : '#6b4fa0'
  const handleColor = isDark ? '#4c2d7a' : '#c4b5fd'
  const sectionLabel = { fontFamily: 'Cinzel_400Regular', fontSize: 11, color: mutedColor, letterSpacing: 0.5 } as const

  function handleSave() {
    if (!text.trim() || !todo) return
    onSave({
      ...todo,
      text: text.trim(),
      notes: notes.trim() || undefined,
      priority,
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : undefined,
      categoryId,
      subTasks,
      recurrence,
    })
  }

  function handleClose() { Keyboard.dismiss(); onClose() }

  if (!todo) return null

  return (
    <Sheet open={visible} onOpenChange={(open: boolean) => !open && handleClose()} snapPoints={[94]} dismissOnSnapToBottom modal>
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.5)" />
      <Sheet.Frame style={{ backgroundColor: sheetBg, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <YStack padding={24}>
                <View style={[styles.handle, { backgroundColor: handleColor }]} />

                <XStack justifyContent="space-between" alignItems="center" marginBottom={20}>
                  <XStack alignItems="center" gap={8}>
                    <Sparkles size={18} color="#7c3aed" />
                    <Text style={{ fontFamily: 'Cinzel_700Bold' }} fontSize={18} color={textColor} letterSpacing={0.5}>Edit task</Text>
                  </XStack>
                  <TouchableOpacity onPress={handleClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close">
                    <X size={20} color={mutedColor} />
                  </TouchableOpacity>
                </XStack>

                {/* Task text */}
                <TextInput
                  value={text}
                  onChangeText={t => t.length <= MAX_LENGTH && setText(t)}
                  placeholder="Task description..."
                  placeholderTextColor={mutedColor}
                  style={[styles.textInput, { backgroundColor: inputBg, borderColor: border, color: textColor }]}
                  multiline
                  numberOfLines={3}
                  maxLength={MAX_LENGTH}
                  accessibilityLabel="Task description"
                />
                <XStack justifyContent="flex-end" marginBottom={16}>
                  <Text fontSize={11} color={text.length >= MAX_LENGTH * 0.9 ? '#ef4444' : mutedColor}>{text.length}/{MAX_LENGTH}</Text>
                </XStack>

                {/* Priority */}
                <Text style={sectionLabel} marginBottom={8}>PRIORITY</Text>
                <XStack gap={8} marginBottom={16}>
                  {PRIORITIES.map(p => (
                    <TouchableOpacity
                      key={p.value}
                      onPress={() => setPriority(p.value)}
                      style={[styles.priorityBtn, { backgroundColor: priority === p.value ? p.color + '22' : inputBg, borderColor: priority === p.value ? p.color : border }]}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: priority === p.value }}
                      accessibilityLabel={`${p.label} priority`}
                    >
                      <Text fontSize={12} color={priority === p.value ? p.color : mutedColor} style={{ fontFamily: 'Cinzel_400Regular' }}>{p.emoji} {p.label}</Text>
                    </TouchableOpacity>
                  ))}
                </XStack>

                {/* Due date */}
                <Text style={sectionLabel} marginBottom={8}>DUE DATE</Text>
                <XStack gap={8} marginBottom={16} alignItems="center">
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={[styles.dateBtn, { backgroundColor: inputBg, borderColor: border }]}
                    accessibilityRole="button"
                    accessibilityLabel={dueDate ? `Due date: ${dueDate.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}` : 'Set due date'}
                  >
                    <Calendar size={14} color={dueDate ? '#7c3aed' : mutedColor} />
                    <Text fontSize={13} color={dueDate ? '#7c3aed' : mutedColor} style={{ fontFamily: 'Cinzel_400Regular' }}>
                      {dueDate ? dueDate.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : 'No due date'}
                    </Text>
                  </TouchableOpacity>
                  {dueDate && (
                    <TouchableOpacity onPress={() => setDueDate(null)} style={styles.clearBtn} accessibilityRole="button" accessibilityLabel="Clear due date">
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
                    onChange={(_, date) => { setShowDatePicker(false); if (date) setDueDate(date) }}
                  />
                )}

                {/* Category */}
                {categories.length > 0 && (
                  <>
                    <Text style={sectionLabel} marginBottom={8}>CATEGORY</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                      <XStack gap={8}>
                        <TouchableOpacity
                          onPress={() => setCategoryId(undefined)}
                          style={[styles.catChip, { backgroundColor: !categoryId ? '#7c3aed22' : inputBg, borderColor: !categoryId ? '#7c3aed' : border }]}
                          accessibilityRole="radio" accessibilityState={{ checked: !categoryId }}
                        >
                          <Text fontSize={12} color={!categoryId ? '#7c3aed' : mutedColor} style={{ fontFamily: 'Cinzel_400Regular' }}>None</Text>
                        </TouchableOpacity>
                        {categories.map(cat => (
                          <TouchableOpacity
                            key={cat.id}
                            onPress={() => setCategoryId(categoryId === cat.id ? undefined : cat.id)}
                            style={[styles.catChip, { backgroundColor: categoryId === cat.id ? cat.color + '22' : inputBg, borderColor: categoryId === cat.id ? cat.color : border }]}
                            accessibilityRole="radio" accessibilityState={{ checked: categoryId === cat.id }}
                            accessibilityLabel={cat.name}
                          >
                            <Text fontSize={12} color={categoryId === cat.id ? cat.color : mutedColor} style={{ fontFamily: 'Cinzel_400Regular' }}>{cat.emoji} {cat.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </XStack>
                    </ScrollView>
                  </>
                )}

                {/* Notes */}
                <TouchableOpacity onPress={() => setShowNotes(v => !v)} style={styles.sectionToggle} accessibilityRole="button" accessibilityLabel={showNotes ? 'Hide notes' : 'Add notes'}>
                  <FileText size={14} color={showNotes ? '#7c3aed' : mutedColor} />
                  <Text style={{ fontFamily: 'Cinzel_400Regular' }} fontSize={13} color={showNotes ? '#7c3aed' : mutedColor} marginLeft={6}>
                    {showNotes ? 'Notes' : 'Add notes'}
                  </Text>
                </TouchableOpacity>
                {showNotes && (
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Add details, links, context..."
                    placeholderTextColor={mutedColor}
                    style={[styles.notesInput, { backgroundColor: inputBg, borderColor: border, color: textColor, marginTop: 10, marginBottom: 16 }]}
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                    accessibilityLabel="Task notes"
                  />
                )}

                {/* Recurrence */}
                <Text style={[sectionLabel, { marginBottom: 8, marginTop: 8 }]}>RECURRENCE</Text>
                <RecurrencePicker value={recurrence} onChange={setRecurrence} isDark={isDark} />
                <View style={{ height: 16 }} />

                {/* Sub-tasks */}
                <Text style={[sectionLabel, { marginBottom: 10, marginTop: 4 }]}>SUBTASKS</Text>
                <SubTaskList subTasks={subTasks} onChange={setSubTasks} isDark={isDark} />

                {/* Actions */}
                <XStack gap={10} marginTop={24}>
                  <TouchableOpacity
                    onPress={() => { onDelete(todo.id); onClose() }}
                    style={[styles.actionBtn, { backgroundColor: '#ef444422', borderColor: '#ef4444', flex: 1 }]}
                    accessibilityRole="button"
                    accessibilityLabel="Delete task"
                  >
                    <Trash2 size={16} color="#ef4444" />
                    <Text style={{ fontFamily: 'Cinzel_700Bold' }} color="#ef4444" fontSize={14} marginLeft={4}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSave}
                    style={[styles.actionBtn, { backgroundColor: text.trim() ? '#7c3aed' : (isDark ? '#2d1f45' : '#ddd6fe'), flex: 2 }]}
                    disabled={!text.trim()}
                    accessibilityRole="button"
                    accessibilityLabel="Save changes"
                    accessibilityState={{ disabled: !text.trim() }}
                  >
                    <Text style={{ fontFamily: 'Cinzel_700Bold' }} color={text.trim() ? 'white' : mutedColor} fontSize={14}>✨ Save changes</Text>
                  </TouchableOpacity>
                </XStack>
              </YStack>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Sheet.Frame>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  closeBtn: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  textInput: { borderRadius: 12, borderWidth: 1, padding: 14, fontSize: 14, fontFamily: 'Cinzel_400Regular', minHeight: 80, marginBottom: 4 },
  notesInput: { borderRadius: 12, borderWidth: 1, padding: 14, fontSize: 13, fontFamily: 'Cinzel_400Regular', minHeight: 100 },
  priorityBtn: { flex: 1, paddingVertical: 10, paddingHorizontal: 6, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', minHeight: 44, justifyContent: 'center' },
  dateBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, flex: 1, minHeight: 44 },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 44, justifyContent: 'center' },
  catChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  sectionToggle: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, marginBottom: 4 },
  actionBtn: { flexDirection: 'row', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
})
