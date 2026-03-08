import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { XStack } from 'tamagui'

const PRESET_COLORS = [
  '#ef4444','#d97706','#16a34a','#0ea5e9','#7c3aed','#ec4899',
  '#f97316','#84cc16','#06b6d4','#8b5cf6','#14b8a6','#f59e0b',
  '#64748b','#1d4ed8','#be185d','#065f46',
]

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <XStack gap={10} paddingVertical={4}>
        {PRESET_COLORS.map(color => (
          <TouchableOpacity
            key={color}
            onPress={() => onChange(color)}
            style={[styles.swatch, { backgroundColor: color, borderWidth: value === color ? 3 : 0, borderColor: 'white' }]}
            accessibilityRole="radio"
            accessibilityState={{ checked: value === color }}
            accessibilityLabel={`Color ${color}`}
          >
            {value === color && <View style={styles.selectedRing} />}
          </TouchableOpacity>
        ))}
      </XStack>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  swatch: { width: 32, height: 32, borderRadius: 16 },
  selectedRing: { position: 'absolute', top: -3, left: -3, right: -3, bottom: -3, borderRadius: 19, borderWidth: 2, borderColor: 'white' },
})
