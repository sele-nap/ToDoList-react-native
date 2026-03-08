import { useEffect, useRef } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
// @ts-ignore
import ConfettiCannon from 'react-native-confetti-cannon'

interface ConfettiOverlayProps {
  shouldFire: boolean
  onDone: () => void
}

const { width } = Dimensions.get('window')

export default function ConfettiOverlay({ shouldFire, onDone }: ConfettiOverlayProps) {
  // @ts-ignore
  const cannonRef = useRef<ConfettiCannon>(null)

  useEffect(() => {
    if (shouldFire) {
      cannonRef.current?.start()
    }
  }, [shouldFire])

  if (!shouldFire) return null

  return (
    <View style={styles.overlay} pointerEvents="none">
      <ConfettiCannon
        ref={cannonRef}
        count={120}
        origin={{ x: width / 2, y: -20 }}
        autoStart={false}
        fadeOut
        fallSpeed={3000}
        colors={['#7c3aed', '#a78bca', '#f3e8ff', '#16a34a', '#d97706', '#ef4444']}
        onAnimationEnd={onDone}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
})
