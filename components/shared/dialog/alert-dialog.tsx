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
      dialogClass="relative bg-[#FCFAFF] shadow-md rounded m-auto p-5"
      isOpen={props.isOpen}
      onClose={onClose}
      slideFromBottom="none"
    >
      <div className="mt-2 flex md:flex-col md:items-center">
        <i className={`text-5xl opacity-75 text-${iconColors[type]}`}>
          {icons[type]}
        </i>
        <div className="w-full pl-3 pt-0 text-left md:px-3 md:pt-2 md:text-center">
          <h3 className="mb-1 text-xl font-semibold text-gray-800">{title}</h3>
          <p className="mb-4 break-words text-gray-700">{content}</p>
        </div>
      </div>
      <form className="-mx-5 -mb-5 mt-4 flex flex-row-reverse justify-start border-t border-gray-200 p-2">
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
