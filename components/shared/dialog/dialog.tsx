import { Children, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import useDevice from '../../../lib/hooks/useDevice'
import useScrollBlock from '../../../lib/hooks/useScrollBlock'
import { HiOutlineX } from 'react-icons/hi'
import { forceCheck } from 'react-lazyload'

export interface DialogPropsType extends ReactProps {
  wrapperClass?: string
  overlayClass?: string
  dialogClass?: string
  extraDialogClass?: string
  headerClass?: string
  extraHeaderClass?: string
  bodyClass?: string
  extraBodyClass?: string
  footerClass?: string
  extraFooterClass?: string
  title?: string
  icon?: JSX.Element
  width?: string
  maxWidth?: string
  mobileSizeMode?: boolean
  slideFromBottom?: 'none' | 'mobile-only' | 'all'
  openAnimation?: string
  closeAnimation?: string
  ref?: any
  root?: string
  isOpen?: boolean
  onClose?: () => any
  // onOverlayClick?: () => any
}

const ROOT_ID = 'dialog-root'
export function Dialog({
  wrapperClass = 'fixed w-full h-screen top-0 left-0 z-100 flex flex-col items-center overflow-y-scroll py-20 no-scrollbar',
  overlayClass = 'fixed w-full h-full top-0 left-auto pointer-events-none',
  dialogClass = 'relative shadow-md rounded m-auto',
  extraDialogClass = '',
  headerClass = 'relative flex px-4 py-1 box-content bg-[#FCFAFF] z-5 border-top rounded-t border-b border-gray-200 z-10',
  extraHeaderClass = '',
  bodyClass = 'relative p-4 bg-[#FCFAFF] rounded',
  extraBodyClass = '',
  footerClass = 'relative flex px-4 py-2 bg-[#FCFAFF] z-5 rounded-b',
  extraFooterClass = '',
  slideFromBottom = 'mobile-only',
  width = 'auto',
  mobileSizeMode = false,
  maxWidth = '86vw',
  title = '',
  icon = null,
  style = {},
  // onOverlayClick = () => props.onClose(),
  ...props
}: DialogPropsType) {
  const { isMobile, isSSR } = useDevice()
  if (isSSR) return null

  const [isOpen, setIsOpen] = useState(props.isOpen)
  let isClickingOverlay = false

  useEffect(() => {
    let timeout: any
    if (props.isOpen) {
      setIsOpen(props.isOpen)
      setTimeout(() => forceCheck(), 200)
    } else {
      timeout = setTimeout(() => {
        setIsOpen(props.isOpen)
      }, 200)
    }
    return () => clearTimeout(timeout)
  }, [props.isOpen])

  useScrollBlock({ rootId: ROOT_ID, dependencies: [isOpen] })

  let header = Children.map(props.children, (child: any) =>
    child?.type?.displayName === 'Header' ? child : null
  )
  let body = Children.map(props.children, (child: any) =>
    child?.type?.displayName === 'Body' ? child : null
  )
  let footer = Children.map(props.children, (child: any) =>
    child?.type?.displayName === 'Footer' ? child : null
  )
  let children = Children.map(props.children, (child: any) =>
    !child?.type?.displayName ? child : null
  )

  if (title && !header.length) {
    header = [
      <>
        <div
          className="flex flex-1 items-center"
          style={{ justifyContent: 'inherit' }}
        >
          {icon ? <i className="mr-2 text-lg text-primary">{icon}</i> : null}
          <span className="text font-semibold text-gray-700">{title}</span>
        </div>
        <button
          className="btn-default translate-x-4 transform"
          onClick={() => props.onClose()}
        >
          <i className="text-lg">
            <HiOutlineX />
          </i>
        </button>
      </>,
    ]
  }

  const isSlideFromBottom =
    (slideFromBottom == 'mobile-only' && isMobile) || slideFromBottom == 'all'

  let el = (
    <div
      className={`dialog-wrapper ${wrapperClass} ${
        isSlideFromBottom ? 'bottom-mode' : ''
      } ${isMobile ? 'mobile' : ''}`}
      style={{ ...style }}
      onMouseDown={(e) => {
        e.stopPropagation()
        isClickingOverlay = true
      }}
      onMouseUp={(e) => {
        e.stopPropagation()
        if (isClickingOverlay) {
          props.onClose()
          isClickingOverlay = false
        }
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`dialog-overlay ${overlayClass} ${
          props.isOpen ? 'animate-emerge' : 'animate-fade'
        } ${mobileSizeMode ? '' : ''}`}
        style={{
          backgroundColor: 'rgba(0,0,0,.32)',
        }}
      ></div>
      <div
        className={`dialog ${dialogClass} ${extraDialogClass} ${
          props.isOpen
            ? props.openAnimation
              ? props.openAnimation
              : isSlideFromBottom
              ? 'animate-slide-in-bottom'
              : 'animate-scale-up'
            : props.closeAnimation
            ? props.closeAnimation
            : isSlideFromBottom
            ? 'animate-slide-out-bottom'
            : 'animate-scale-down'
        }  ${mobileSizeMode ? 'max-w-lg' : ''}`}
        style={{ width, maxWidth: mobileSizeMode ? undefined : maxWidth }}
        onMouseDown={(e) => {
          e.stopPropagation()
          isClickingOverlay = false
        }}
        onMouseUp={(e) => {
          e.stopPropagation()
          isClickingOverlay = false
        }}
      >
        {header?.length ? (
          <div className={`dialog-header ${headerClass} ${extraHeaderClass}`}>
            {header[0]}
          </div>
        ) : null}
        {body?.length ? (
          <div className={`dialog-body ${bodyClass} ${extraBodyClass}`}>
            {body[0]}
          </div>
        ) : null}
        {isOpen && children}
        {footer?.length ? (
          <div className={`dialog-footer ${footerClass} ${extraFooterClass}`}>
            {footer[0]}
          </div>
        ) : null}
      </div>
    </div>
  )

  return isOpen
    ? createPortal(el, document.getElementById(props.root || ROOT_ID))
    : null
}

const Header = ({ children }: { children: any }) => children
Header.displayName = 'Header'
Dialog.Header = Header

const Body = ({ children }: { children: any }) => children
Body.displayName = 'Body'
Dialog.Body = Body

const Footer = ({ children }: { children: any }) => children
Footer.displayName = 'Footer'
Dialog.Footer = Footer
