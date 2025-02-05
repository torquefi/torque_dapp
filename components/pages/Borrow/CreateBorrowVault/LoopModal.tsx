import Modal from '@/components/common/Modal';
import { useSelector } from 'react-redux';
import { AppStore } from '@/types/store';
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Slider from '@mui/material/Slider';
// import { Button } from '@/components/common/Button';
import { motion } from 'framer-motion';

interface ILoopModalProps {
  open: boolean;
  handleClose: () => void;
  onConfirm: (loop: number) => void;
}

const LoopModal = ({ open, handleClose, onConfirm }: ILoopModalProps) => {
  const theme = useSelector((store: AppStore) => store.theme.theme);
  const [loop, setLoop] = useState(1);

  useEffect(() => {
    if (!open) {
      setLoop(1);
    }
  }, [open]);

  const loopVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <Modal
      className={`mx-auto w-[90%] max-w-[360px] bg-white px-[22px] ${theme === 'dark' ? 'dark:bg-[#030303]' : ''}`}
      open={open}
      handleClose={handleClose}
      hideCloseIcon
    >
      <div className="flex items-center justify-between py-1">
        <h2 className={`font-rogan text-[24px] font-[400] ${theme === 'dark' ? 'text-white' : 'text-[#030303]'}`}>
          Set Loop
        </h2>
        <AiOutlineClose
          className={`cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-[#030303]'}`}
          onClick={handleClose}
        />
      </div>
      <div
        className={`mt-3 h-[1px] w-full md:block ${
          theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
        }`}
      ></div>
      <div className="mt-4">
        <Slider
          aria-label="Loop"
          defaultValue={1}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={10}
          onChange={(e, newValue) => setLoop(newValue as number)}
          sx={{
            color: theme === 'dark' ? '#AA5BFF' : '#912BFF',
            '& .MuiSlider-thumb': {
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${theme === 'dark' ? 'rgba(170, 91, 255, 0.16)' : 'rgba(145, 43, 255, 0.16)'}`,
              },
            },
          }}
        />
      </div>
      <motion.div
        className="flex justify-center mt-4"
        variants={loopVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <button
          onClick={() => onConfirm(loop)}
          className="w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]"
        >
          Confirm Loop
        </button>
      </motion.div>
    </Modal>
  );
};

export default LoopModal;
