import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { YStack, XStack, Text } from 'tamagui'
import { Moon, Sun, Wand2 } from '@tamagui/lucide-icons'

interface Props {
  isDark: boolean
  fontsLoaded: boolean
  onToggleTheme: () => void
  completedCount: number
  totalCount: number
}

const Header: React.FC<Props> = ({ isDark, fontsLoaded, onToggleTheme, completedCount, totalCount }) => {
  const progress = totalCount > 0 ? completedCount / totalCount : 0
  const accent = isDark ? '#c084fc' : '#7c3aed'
  const surface = isDark ? '#160b2a' : '#f3e8ff'
  const border = isDark ? '#3b1a6e' : '#c084fc'
  const textPrimary = isDark ? '#f5f3ff' : '#1e1038'
  const textSecondary = isDark ? '#a78bfa' : '#5b21b6'
  const progressBg = isDark ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.1)'
  const progressFill = isDark ? '#c084fc' : '#7c3aed'
  const toggleBg = isDark ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.12)'

  return (
    <YStack
      backgroundColor={surface}
      paddingHorizontal="$5"
      paddingTop="$5"
      paddingBottom="$5"
      borderBottomWidth={1}
      borderBottomColor={border}
      gap="$2"
    >
      <XStack justifyContent="space-between" alignItems="center">
        <XStack alignItems="center" gap="$2">
          <Wand2 color={accent} size={22} />
          <Text
            color={textPrimary}
            fontSize={26}
            fontWeight="700"
            letterSpacing={1.5}
            fontFamily={fontsLoaded ? 'Cinzel_700Bold' : undefined}
          >
            Grimoire
          </Text>
        </XStack>

        <TouchableOpacity
          onPress={onToggleTheme}
          style={[styles.toggleBtn, { backgroundColor: toggleBg, borderColor: border }]}
          activeOpacity={0.7}
        >
          {isDark ? <Sun color="#f5d76e" size={18} /> : <Moon color="#7c3aed" size={18} />}
        </TouchableOpacity>
      </XStack>

      <Text
        color={textSecondary}
        fontSize={13}
        fontFamily={fontsLoaded ? 'Cinzel_400Regular' : undefined}
        letterSpacing={0.8}
      >
        {completedCount} / {totalCount} {completedCount === 1 ? 'spell' : 'spells'} cast
      </Text>

      <View style={[styles.progressTrack, { backgroundColor: progressBg }]}>
        <View style={[styles.progressFill, { backgroundColor: progressFill, width: `${progress * 100}%` }]} />
      </View>
    </YStack>
  )
}

const styles = StyleSheet.create({
  toggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
})

export default Header
