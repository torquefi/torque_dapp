import { Dialog } from './dialog'

interface PropsType extends ReactProps {
  isOpen: boolean
  image: string
  onClose: () => any
  onClick?: () => void
}

export function ImageDialog({
  className = '',
  style = {},
  ...props
}: PropsType) {
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      slideFromBottom="none"
    >
      {props.image && (
        <img
          className={`${props.onClick ? 'cursor-pointer' : ''} ${className}`}
          style={{ maxWidth: '32rem', ...style }}
          src={props.image}
          onClick={props.onClick}
        />
      )}
    </Dialog>
  )
}
