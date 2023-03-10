import { CgSpinner } from 'react-icons/cg'

interface PropsType extends ReactProps {
  icon?: JSX.Element
}
export function Spinner({
  icon = <CgSpinner />,
  className = 'py-32',
  ...props
}: PropsType) {
  return (
    <div className={`w-full flex-center text-primary ${className}`}>
      <i className="animate-spin text-4xl">{icon}</i>
    </div>
  )
}
