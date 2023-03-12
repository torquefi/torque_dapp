import React, { createContext, useContext } from 'react'
import {
  BiCheckCircle,
  BiError,
  BiErrorAlt,
  BiErrorCircle,
} from 'react-icons/bi'
import { FaCheckCircle } from 'react-icons/fa'
import {
  Slide,
  toast as toastify,
  ToastContainer,
  ToastContent,
  ToastOptions,
} from 'react-toastify'

const ToastContext = createContext<{
  default: (
    content: ToastContent,
    options?: ToastOptions | undefined
  ) => React.ReactText
  info: (
    content: ToastContent,
    options?: ToastOptions | undefined
  ) => React.ReactText
  success: (
    content: ToastContent,
    options?: ToastOptions | undefined
  ) => React.ReactText
  error: (
    content: ToastContent,
    options?: ToastOptions | undefined
  ) => React.ReactText
  warn: (
    content: ToastContent,
    options?: ToastOptions | undefined
  ) => React.ReactText
  dark: (
    content: ToastContent,
    options?: ToastOptions | undefined
  ) => React.ReactText
}>(null)

export function ToastProvider({ children }: any) {
  const defaultOptions: ToastOptions = {
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    pauseOnFocusLoss: true,
    position: toastify.POSITION.TOP_RIGHT,
  }

  const toast = {
    default: (content: string, options?: ToastOptions) =>
      toastify(content, {
        ...defaultOptions,
        ...options,
        icon: (
          <i className="text-2xl font-bold text-white">
            <FaCheckCircle />
          </i>
        ),
      }),
    info: (content: string, options?: ToastOptions) =>
      toastify.info(content, {
        ...defaultOptions,
        ...options,
        icon: (
          <i className="text-2xl font-bold text-white">
            <BiErrorAlt />
          </i>
        ),
      }),
    success: (content: string, options?: ToastOptions) =>
      toastify.success(content, {
        ...defaultOptions,
        ...options,
        icon: (
          <i className="text-2xl font-bold text-white">
            <BiCheckCircle />
          </i>
        ),
      }),
    error: (content: string, options?: ToastOptions) =>
      toastify.error(content, {
        ...defaultOptions,
        ...options,
        icon: (
          <i className="text-2xl font-bold text-white">
            <BiErrorCircle />
          </i>
        ),
      }),
    warn: (content: string, options?: ToastOptions) =>
      toastify.warn(content, {
        ...defaultOptions,
        ...options,
        icon: (
          <i className="text-2xl font-bold text-white">
            <BiError />
          </i>
        ),
      }),
    dark: (content: string, options?: ToastOptions) =>
      toastify.dark(content, {
        ...defaultOptions,
        ...options,
        icon: (
          <i className="text-2xl font-bold text-white">
            <BiCheckCircle />
          </i>
        ),
      }),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer
        newestOnTop
        containerId="toast-root"
        limit={5}
        transition={Slide}
      />
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
