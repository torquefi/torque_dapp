import { AppStore } from '@/types/store'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
interface SkeletonProps {
  width?: any
  height?: any
  borderRadius?: any
  className?: string
}
const SkeletonDefault: React.FC<SkeletonProps> = ({
  height,
  width,
  borderRadius,
  className,
}: SkeletonProps) => {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  return (
    <SkeletonTheme
      baseColor={theme === 'light' ? '#eeeeee' : '#1c1c1c'}
      highlightColor={theme === 'light' ? '#fff' : '#222121'}
    >
      <Skeleton
        height={height}
        width={width}
        borderRadius={borderRadius ? borderRadius : 12}
        className={className}
      />
    </SkeletonTheme>
  )
}
export default SkeletonDefault
