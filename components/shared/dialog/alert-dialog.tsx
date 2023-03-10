import { MutableRefObject, useEffect, useRef } from 'react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import {
  BiCheckCircle,
  BiError,
  BiErrorAlt,
  BiInfoCircle,
  BiXCircle,
} from 'react-icons/bi'
import { Button } from '../form/button'
import { Dialog } from './dialog'

interface PropsType extends ReactProps {
  isOpen: boolean
  type: 'success' | 'error' | 'info' | 'warn' | 'question' | 'danger'
  title: string
  content?: string
  confirm?: string
  cancel?: string
  onConfirm?: Function
  onClose: () => any
}

export function AlertDialog({
  type,
  confirm = 'Xác nhận',
  cancel = 'Huỷ',
  onConfirm,
  onClose,
  title,
  content,
  ...props
}: PropsType) {
  const icons = {
    info: <BiInfoCircle />,
    success: <BiCheckCircle />,
    error: <BiXCircle />,
    warn: <BiError />,
    question: <AiOutlineQuestionCircle />,
    danger: <BiErrorAlt />,
  }

  const iconColors = {
    info: 'info',
    success: 'success',
    error: 'danger',
    warn: 'warning',
    question: 'primary',
    danger: 'danger',
  }

  const buttonRef: MutableRefObject<HTMLButtonElement> = useRef()

  const onCancelClick = () => {
    onClose()
  }

  const onConfirmClick = async () => {
    if (onConfirm) await onConfirm()
  }

  useEffect(() => {
    if (props.isOpen) {
      document.getElementById('alert-dialog')?.focus()
    }
  }, [props.isOpen])

  return (
    <Dialog
      root="alert-root"
      width="400px"
      style={{ zIndex: 10000 }}
      dialogClass="relative bg-white shadow-md rounded m-auto p-5"
      isOpen={props.isOpen}
      onClose={onClose}
      slideFromBottom="none"
    >
      <div className="flex md:flex-col md:items-center mt-2">
        <i className={`text-5xl opacity-75 text-${iconColors[type]}`}>
          {icons[type]}
        </i>
        <div className="w-full pt-0 pl-3 md:pt-2 md:px-3 text-left md:text-center">
          <h3 className="text-gray-800 font-semibold text-xl mb-1">{title}</h3>
          <p className="text-gray-700 mb-4 break-words">{content}</p>
        </div>
      </div>
      <form className="flex flex-row-reverse justify-start mt-4 p-2 -mb-5 -mx-5 border-t border-gray-200">
        <Button
          autoFocus
          id="alert-button"
          className="btn-large px-8"
          primary={type == 'question'}
          info={type == 'info'}
          warning={type == 'warn'}
          success={type == 'success'}
          danger={type == 'error' || type == 'danger'}
          text={confirm}
          onClick={onConfirmClick}
        />
        {(type == 'warn' || type == 'question' || type == 'danger') && (
          <Button large hoverDarken onClick={onCancelClick} text={cancel} />
        )}
      </form>
    </Dialog>
  )
}
