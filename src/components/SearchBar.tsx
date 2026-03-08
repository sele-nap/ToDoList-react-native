import { Search, X } from '@tamagui/lucide-icons'
import { useRef } from 'react'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { XStack } from 'tamagui'

interface SearchBarProps {
  value: string
  onChangeText: (t: string) => void
  isDark: boolean
}

export default function SearchBar({ value, onChangeText, isDark }: SearchBarProps) {
  const bg = isDark ? '#1e1530' : '#f3e8ff'
  const border = isDark ? '#2d1f45' : '#ddd6fe'
  const textColor = isDark ? '#f3e8ff' : '#1e1038'
  const mutedColor = isDark ? '#a78bca' : '#6b4fa0'

  return (
    <XStack
      marginHorizontal={16}
      marginBottom={8}
      paddingHorizontal={12}
      paddingVertical={10}
      borderRadius={12}
      borderWidth={1}
      alignItems="center"
      gap={8}
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <Search size={16} color={mutedColor} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search tasks..."
        placeholderTextColor={mutedColor}
        style={[styles.input, { color: textColor, fontFamily: 'Cinzel_400Regular' }]}
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel="Search tasks"
        accessibilityRole="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <X size={16} color={mutedColor} />
        </TouchableOpacity>
      )}
    </XStack>
  )
}

const styles = StyleSheet.create({
  input: { flex: 1, fontSize: 14, padding: 0 },
})
