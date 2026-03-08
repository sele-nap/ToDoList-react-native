import { BarChart2, Moon, Sun, Wand2 } from '@tamagui/lucide-icons'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'

interface HeaderProps {
  total: number
  completed: number
  isDark: boolean
  onThemeToggle: () => void
  onStatsPress: () => void
}

export default function Header({ total, completed, isDark, onThemeToggle, onStatsPress }: HeaderProps) {
  const progress = total > 0 ? completed / total : 0
  const textColor = isDark ? '#f3e8ff' : '#1e1038'
  const mutedColor = isDark ? '#a78bca' : '#6b4fa0'
  const trackColor = isDark ? '#2d1f45' : '#ddd6fe'
  const fillColor = '#7c3aed'
  const allDone = total > 0 && completed === total

  return (
    <YStack paddingHorizontal={20} paddingTop={40} paddingBottom={12} gap={12}>
      <XStack alignItems="center" justifyContent="space-between">
        <XStack alignItems="center" gap={8}>
          <Wand2 size={20} color={fillColor} />
          <Text
            style={{ fontFamily: 'Cinzel_700Bold' }}
            fontSize={22}
            color={textColor}
            letterSpacing={1}
            accessibilityRole="header"
          >
            My List
          </Text>
        </XStack>

        <XStack gap={4} alignItems="center">
          <TouchableOpacity
            onPress={onStatsPress}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="View statistics"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <BarChart2 size={20} color={mutedColor} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onThemeToggle}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isDark ? <Sun size={20} color={mutedColor} /> : <Moon size={20} color={mutedColor} />}
          </TouchableOpacity>
        </XStack>
      </XStack>

      <XStack alignItems="center" justifyContent="space-between">
        <Text
          style={{ fontFamily: 'Cinzel_400Regular' }}
          fontSize={12}
          color={allDone ? '#7c3aed' : mutedColor}
          letterSpacing={0.5}
          accessibilityLabel={`${completed} of ${total} tasks completed`}
          accessibilityLiveRegion="polite"
        >
          {allDone && total > 0 ? '✨ All done!' : `${completed} / ${total} completed`}
        </Text>
        {total > 0 && (
          <Text fontSize={11} color={allDone ? '#7c3aed' : mutedColor}>
            {Math.round(progress * 100)}%
          </Text>
        )}
      </XStack>

      <View
        style={[styles.track, { backgroundColor: trackColor }]}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
        accessibilityLabel="Task completion progress"
      >
        <View
          style={[
            styles.fill,
            {
              backgroundColor: allDone ? '#16a34a' : fillColor,
              width: `${progress * 100}%` as `${number}%`,
            },
          ]}
        />
      </View>
    </YStack>
  )
}

const styles = StyleSheet.create({
  iconBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
  },
})
