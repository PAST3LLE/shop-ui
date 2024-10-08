import { useState, useEffect } from 'react'

export function useIsClientReady() {
  const [isClientReady, setIsClientReady] = useState(false)
  useEffect(() => {
    setIsClientReady(true)
  }, [])
  return isClientReady
}
