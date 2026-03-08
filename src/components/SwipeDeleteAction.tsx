import { Trash2 } from '@tamagui/lucide-icons'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'tamagui'

interface SwipeDeleteActionProps {
  onDelete: () => void
}

export default function SwipeDeleteAction({ onDelete }: SwipeDeleteActionProps) {
  return (
    <TouchableOpacity
      onPress={onDelete}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel="Delete task"
    >
      <Trash2 size={22} color="white" />
      <Text style={{ color: 'white', fontSize: 11, marginTop: 2, fontFamily: 'Cinzel_400Regular' }}>Delete</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ef4444',
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 10,
    marginLeft: 8,
  },
})
