import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
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
}: SkeletonProps) => (
  <SkeletonTheme baseColor="#1c1c1c" highlightColor="#222121">
    <Skeleton
      height={height}
      width={width}
      borderRadius={borderRadius ? borderRadius : 12}
      className={className}
    />
  </SkeletonTheme>
)
export default SkeletonDefault
