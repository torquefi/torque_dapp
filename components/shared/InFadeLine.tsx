
import { useEffect } from 'react';
import {
  motion,
  useAnimation,
} from 'framer-motion'
import { useInView } from 'react-intersection-observer'
const InFadeLine = () => {

  const controls = useAnimation();
  const { ref, inView } = useInView();

  const boxVariants = {
    hidden: { scale: 0.5 },
    visible: {
      scale: 1,
      transition: {
        duration: .75
      }
    }
  }

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
    if (!inView) {
      controls.start('hidden');
    }
    }, [controls, inView]);




    return (
      <motion.div ref={ref} initial="hidden" animate={controls} variants={boxVariants}  className={`relative pt-0.5 mx-auto leading-snug tracking-wide bg-gradient-to-r from-transparent via-gray-500  to-transparent`}>
          <div className=" relative items-center justify-center  tracking-w w-full h-full bg-black"></div>
      </motion.div>
    )

}
export { InFadeLine }







