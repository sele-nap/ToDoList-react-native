import { useCallback, useState } from 'react'

export function useConfetti() {
  const [shouldFire, setShouldFire] = useState(false)

  const fire = useCallback(() => {
    setShouldFire(true)
  }, [])

  const reset = useCallback(() => {
    setShouldFire(false)
  }, [])

  return { shouldFire, fire, reset }
}
