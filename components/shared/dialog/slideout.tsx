import { Dialog, DialogPropsType } from './dialog'

export interface SlideoutPropsType extends DialogPropsType {
  placement?: 'left' | 'right'
}

export function Slideout({
  className = '',
  style = {},
  placement = 'right',
  ...props
}: SlideoutPropsType) {
  return (
    <Dialog
      {...props}
      wrapperClass={`fixed w-full h-screen top-0 left-0 z-300 flex flex-col overflow-hidden ${
        placement == 'left' ? 'item-start' : 'items-end'
      }`}
      dialogClass="relative h-full bg-white shadow-md"
      isOpen={props.isOpen}
      onClose={props.onClose}
      openAnimation={
        placement == 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'
      }
      closeAnimation={
        placement == 'left'
          ? 'animate-slide-out-left'
          : 'animate-slide-out-right'
      }
      slideFromBottom="none"
    >
      {props.children}
    </Dialog>
  )
}
