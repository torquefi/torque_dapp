import { useState, useEffect } from 'react'

type BreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

function useScreen(breakpoint: BreakPoint) {
  function isBreakPoint(): boolean {
    if (typeof window !== 'undefined') {
      let width = window.innerWidth
      switch (breakpoint) {
        case '2xl': {
          return width >= 1536
        }
        case 'xl': {
          return width >= 1280
        }
        case 'lg': {
          return width >= 1024
        }
        case 'md': {
          return width >= 768
        }
        case 'sm': {
          return width >= 640
        }
        case 'xs': {
          return width >= 480
        }
        default: {
          return true
        }
      }
    }
    return false
  }

  const [screen, setScreen] = useState<boolean>()
  useEffect(() => {
    function handleResize() {
      setScreen(isBreakPoint())
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])
  return screen
}
export default useScreen
