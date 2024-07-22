import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Modal from '@/components/common/Modal'

interface InviteCodeModalProps {
  open: boolean
  handleClose: () => void
}

const InviteCodeModal = ({ open, handleClose }: InviteCodeModalProps) => {
  const [code, setCode] = useState(['', '', '', '', ''])
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const handleChange = (value: string, index: number) => {
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    if (value) {
      if (index < code.length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    } else {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !code[index]) {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (code.join('') === '88888') {
      handleClose()
    } else {
      alert('Incorrect invite code')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Modal open={open} handleClose={() => {}} hideCloseIcon={true} className="max-w-[390px] mb-3 rounded-none py-8 bg-white dark:bg-[#030303] border border-[0px] border-[#efefef]">
      <motion.div
        className="flex mb-3 md:mb-0 flex-col items-center"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.img
          className="h-[46px] rounded-[6px] mb-3 shadow-2xl"
          src="/assets/torque-square.png"
          alt="logo"
          variants={itemVariants}
        />
        <motion.h2 className="font-rogan text-[24px] font-[400] text-black dark:text-white" variants={itemVariants}>
          Early Access
        </motion.h2>
        <motion.div className="mt-2 text-center" variants={itemVariants}>
          <p className="text-[#959595]">Enter invite code to gain early access.</p>
          <p className="text-[#959595]">Don't have a code? <a className="underline" href="https://t.me/torquefi" target="_blank">Join Telegram.</a></p>
        </motion.div>
        <motion.div className="flex mt-4 space-x-2" variants={containerVariants}>
          {code.map((char, index) => (
            <motion.input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={char}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center bg-transparent text-black dark:text-white font-bold border border-[#efefef] dark:border-[#1a1a1a] rounded-md focus:outline-none shadow-md text-[18px]"
              variants={itemVariants}
            />
          ))}
        </motion.div>
        <motion.button 
          onClick={handleSubmit}
          className="mt-6 group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full px-5 font-medium border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]"
          variants={itemVariants}
        >
          <span>Enter code</span>
          <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-1 group-hover:opacity-100">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="#AA5BFF" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
          </div>
        </motion.button>
      </motion.div>
    </Modal>
  )
}

export default InviteCodeModal
