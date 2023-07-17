import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
const InFadeLine = () => {
  const controls = useAnimation()
  const { ref, inView } = useInView()

  const boxVariants = {
    hidden: { scale: 0.5 },
    visible: {
      scale: 1,
      transition: {
        duration: 0.75,
      },
    },
  }

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
    if (!inView) {
      controls.start('hidden')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={boxVariants}
      className={`relative mx-auto bg-gradient-to-r from-transparent via-gray-500 to-transparent pt-0.5 leading-snug  tracking-wide`}
    >
      <div className=" tracking-w relative h-full  w-full items-center justify-center bg-black" />
    </motion.div>
  )
}
export { InFadeLine }
