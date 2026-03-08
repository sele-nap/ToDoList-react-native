import { Check, Plus, Trash2, X } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { Sheet, Text, View, XStack, YStack } from 'tamagui'
import { Category } from '../types'
import ColorPicker from './ColorPicker'

interface CategoryModalProps {
  visible: boolean
  onClose: () => void
  categories: Category[]
  onSave: (categories: Category[]) => void
  isDark: boolean
}

const PRESET_EMOJIS = ['📁','💼','🏠','🎯','💪','🛒','📚','🎮','🎨','✈️','🏥','💰','🌿','🎵','🍳','🐾']

export default function CategoryModal({ visible, onClose, categories, onSave, isDark }: CategoryModalProps) {
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('📁')
  const [newColor, setNewColor] = useState('#7c3aed')
  const [showCreate, setShowCreate] = useState(false)

  const bg = isDark ? '#150d1f' : '#faf5ff'
  const cardBg = isDark ? '#1e1530' : '#ffffff'
  const border = isDark ? '#2d1f45' : '#ddd6fe'
  const textColor = isDark ? '#f3e8ff' : '#1e1038'
  const mutedColor = isDark ? '#a78bca' : '#6b4fa0'
  const handleColor = isDark ? '#4c2d7a' : '#c4b5fd'
  const inputBg = isDark ? '#150d1f' : '#f3e8ff'

  function handleCreate() {
    if (!newName.trim()) return
    const cat: Category = {
      id: Date.now().toString(),
      name: newName.trim(),
      emoji: newEmoji,
      color: newColor,
      createdAt: new Date().toISOString(),
    }
    onSave([...categories, cat])
    setNewName('')
    setNewEmoji('📁')
    setNewColor('#7c3aed')
    setShowCreate(false)
  }

  function handleDelete(id: string) {
    onSave(categories.filter(c => c.id !== id))
  }

  return (
    <Sheet open={visible} onOpenChange={(open: boolean) => !open && onClose()} snapPoints={[88]} dismissOnSnapToBottom modal>
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.5)" />
      <Sheet.Frame style={{ backgroundColor: bg, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
        <View padding={24} flex={1}>
          <View style={[styles.handle, { backgroundColor: handleColor }]} />

          <XStack justifyContent="space-between" alignItems="center" marginBottom={20}>
            <Text style={{ fontFamily: 'Cinzel_700Bold' }} fontSize={18} color={textColor}>Categories</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close">
              <X size={20} color={mutedColor} />
            </TouchableOpacity>
          </XStack>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {categories.length === 0 && !showCreate && (
              <Text style={{ fontFamily: 'Cinzel_400Regular', textAlign: 'center' }} color={mutedColor} fontSize={13} marginTop={20}>
                No categories yet.{'\n'}Create your first one below!
              </Text>
            )}

            {categories.map(cat => (
              <XStack key={cat.id} style={[styles.catRow, { backgroundColor: cardBg, borderColor: border }]} alignItems="center" marginBottom={8}>
                <View style={[styles.catDot, { backgroundColor: cat.color }]}>
                  <Text fontSize={16}>{cat.emoji}</Text>
                </View>
                <Text style={{ fontFamily: 'Cinzel_400Regular' }} color={textColor} fontSize={14} flex={1} marginLeft={10}>
                  {cat.name}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDelete(cat.id)}
                  style={styles.iconBtn}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${cat.name}`}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </XStack>
            ))}

            {showCreate ? (
              <YStack style={[styles.createForm, { backgroundColor: cardBg, borderColor: border }]} gap={14}>
                <Text style={{ fontFamily: 'Cinzel_400Regular' }} fontSize={11} color={mutedColor} letterSpacing={0.5}>NAME</Text>
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Category name..."
                  placeholderTextColor={mutedColor}
                  style={[styles.textInput, { backgroundColor: inputBg, borderColor: border, color: textColor }]}
                  maxLength={30}
                  autoFocus
                />

                <Text style={{ fontFamily: 'Cinzel_400Regular' }} fontSize={11} color={mutedColor} letterSpacing={0.5}>EMOJI</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack gap={8}>
                    {PRESET_EMOJIS.map(em => (
                      <TouchableOpacity
                        key={em}
                        onPress={() => setNewEmoji(em)}
                        style={[styles.emojiBtn, { backgroundColor: newEmoji === em ? '#7c3aed22' : inputBg, borderColor: newEmoji === em ? '#7c3aed' : border }]}
                      >
                        <Text fontSize={20}>{em}</Text>
                      </TouchableOpacity>
                    ))}
                  </XStack>
                </ScrollView>

                <Text style={{ fontFamily: 'Cinzel_400Regular' }} fontSize={11} color={mutedColor} letterSpacing={0.5}>COLOR</Text>
                <ColorPicker value={newColor} onChange={setNewColor} />

                <XStack gap={10} marginTop={4}>
                  <TouchableOpacity
                    onPress={() => setShowCreate(false)}
                    style={[styles.actionBtn, { backgroundColor: inputBg, borderColor: border, flex: 1 }]}
                    accessibilityRole="button"
                    accessibilityLabel="Cancel"
                  >
                    <Text style={{ fontFamily: 'Cinzel_400Regular' }} color={mutedColor} fontSize={14}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCreate}
                    style={[styles.actionBtn, { backgroundColor: newName.trim() ? '#7c3aed' : (isDark ? '#2d1f45' : '#ddd6fe'), flex: 1 }]}
                    disabled={!newName.trim()}
                    accessibilityRole="button"
                    accessibilityLabel="Create category"
                  >
                    <Check size={16} color={newName.trim() ? 'white' : mutedColor} />
                    <Text style={{ fontFamily: 'Cinzel_700Bold' }} color={newName.trim() ? 'white' : mutedColor} fontSize={14} marginLeft={4}>Create</Text>
                  </TouchableOpacity>
                </XStack>
              </YStack>
            ) : (
              <TouchableOpacity
                onPress={() => setShowCreate(true)}
                style={[styles.addBtn, { borderColor: border }]}
                accessibilityRole="button"
                accessibilityLabel="Create new category"
              >
                <Plus size={16} color="#7c3aed" />
                <Text style={{ fontFamily: 'Cinzel_700Bold' }} color="#7c3aed" fontSize={14} marginLeft={6}>New category</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Sheet.Frame>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  closeBtn: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  catRow: { borderRadius: 12, borderWidth: 1, padding: 12 },
  catDot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  iconBtn: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  createForm: { borderRadius: 14, borderWidth: 1, padding: 16, marginTop: 8 },
  textInput: { borderRadius: 10, borderWidth: 1, padding: 12, fontSize: 14, fontFamily: 'Cinzel_400Regular' },
  emojiBtn: { width: 44, height: 44, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  actionBtn: { borderRadius: 10, borderWidth: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', paddingVertical: 14, marginTop: 8 },
})
