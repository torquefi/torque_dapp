import { AlertDialog } from '../../components/shared/dialog/alert-dialog'
import { createContext, useContext, useEffect, useState } from 'react'

const AlertContext = createContext<
  Partial<{
    info: (
      title: string,
      content?: string,
      confirm?: string
    ) => Promise<boolean>
    success: (
      title: string,
      content?: string,
      confirm?: string
    ) => Promise<boolean>
    error: (
      title: string,
      content?: string,
      confirm?: string
    ) => Promise<boolean>
    warn: (
      title: string,
      content?: string,
      confirm?: string,
      confirmFn?: (() => Promise<boolean>) | (() => boolean)
    ) => Promise<boolean>
    question: (
      title: string,
      content?: string,
      confirm?: string,
      confirmFn?: (() => Promise<boolean>) | (() => boolean)
    ) => Promise<boolean>
    danger: (
      title: string,
      content?: string,
      confirm?: string,
      confirmFn?: (() => Promise<boolean>) | (() => boolean)
    ) => Promise<boolean>
  }>
>(null)

let interval: any = null
const intervalDelay = 100
let confirmed: any = undefined
let confirmFn: any = null
export function AlertProvider({ children }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<
    'success' | 'error' | 'info' | 'warn' | 'question'
  >()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [confirm, setConfirm] = useState('')

  const alert = {
    info: (title: string, content: string = '', confirm?: string) => {
      openAlert('info', title, content, confirm)
      return new Promise<boolean>(alertPromise)
    },
    success: (title: string, content: string = '', confirm?: string) => {
      openAlert('success', title, content, confirm)
      return new Promise<boolean>(alertPromise)
    },
    error: (title: string, content: string = '', confirm?: string) => {
      openAlert('error', title, content, confirm)
      return new Promise<boolean>(alertPromise)
    },
    warn: (
      title: string,
      content: string = '',
      confirm?: string,
      confirmFn?: (() => Promise<boolean>) | (() => boolean)
    ) => {
      openAlert('warn', title, content, confirm, confirmFn)
      return new Promise<boolean>(alertPromise)
    },
    question: (
      title: string,
      content: string = '',
      confirm?: string,
      confirmFn?: (() => Promise<boolean>) | (() => boolean)
    ) => {
      openAlert('question', title, content, confirm, confirmFn)
      return new Promise<boolean>(alertPromise)
    },
    danger: (
      title: string,
      content: string = '',
      confirm?: string,
      confirmFn?: (() => Promise<boolean>) | (() => boolean)
    ) => {
      openAlert('danger', title, content, confirm, confirmFn)
      return new Promise<boolean>(alertPromise)
    },
  }

  const alertPromise = (resolve: any) => {
    interval = setInterval(() => {
      if (confirmed !== undefined) {
        clearInterval(interval)
        resolve(confirmed)
        confirmed = undefined
      }
    }, intervalDelay)
  }

  const openAlert = (
    type: any,
    title: string,
    content: string,
    confirm?: string,
    confirmFnParam?: Function
  ) => {
    confirmFn = confirmFnParam || null
    clearInterval(interval)
    setTitle(title)
    setContent(content)
    setConfirm(confirm)
    setType(type)
    setIsOpen(true)
  }

  const onConfirm = async () => {
    confirmed = true
    if (confirmFn) {
      let res = await confirmFn()
      if (res) setIsOpen(false)
    } else {
      setIsOpen(false)
    }
  }

  const onClose = () => {
    confirmed = false
    setIsOpen(false)
  }

  return (
    <AlertContext.Provider value={alert}>
      {children}
      <AlertDialog
        type={type}
        title={title}
        content={content}
        confirm={confirm}
        isOpen={isOpen}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    </AlertContext.Provider>
  )
}

export const useAlert = () => useContext(AlertContext)
