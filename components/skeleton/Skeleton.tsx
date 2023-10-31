interface SkeletonProps {
  className?: string
}
const Skeleton: React.FC<SkeletonProps> = ({ className }: SkeletonProps) => {
  return (
    <div
      className={`${className} animate-pulse rounded-[4px] bg-[#eeeeee] dark:bg-[#1c1c1c]`}
    ></div>
  )
}
export default Skeleton
