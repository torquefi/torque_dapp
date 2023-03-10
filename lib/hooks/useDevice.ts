const { useEffect } = require('react')

const getDevice = (userAgent: any) => {
  const isAndroid = Boolean(userAgent.match(/Android/i))
  const isIos = Boolean(userAgent.match(/iPhone|iPad|iPod/i))
  const isOpera = Boolean(userAgent.match(/Opera Mini/i))
  const isWindows = Boolean(userAgent.match(/IEMobile/i))
  const isSSR = Boolean(
    !(
      typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement
    )
  )

  const isMobile = Boolean(isAndroid || isIos || isOpera || isWindows)
  const isDesktop = Boolean(!isMobile && !isSSR)
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
  }
}
export default function useDevice() {
  useEffect(() => {}, [])
  const userAgent =
    typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent
  return getDevice(userAgent)
}
