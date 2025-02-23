import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { X, Gauge, ChevronRight } from 'lucide-react';
import Modal from '@/components/common/Modal';
import { AppStore } from '@/types/store';

interface ILoopModalProps {
  open: boolean;
  handleClose: () => void;
  onConfirm: (loop: number) => void;
}

const LoopModal = ({ open, handleClose, onConfirm }: ILoopModalProps) => {
  const theme = useSelector((store: AppStore) => store.theme.theme);
  const [loop, setLoop] = useState(0);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!open) setLoop(0);
  }, [open]);

  const calculateRiskLevel = (value: number) => {
    if (value === 0) return { text: 'No Loop', color: 'text-gray-500', desc: 'Minimal Risk' };
    if (value <= 5) return { text: 'Safe Mode', color: 'text-green-500', desc: 'Optimal Balance' };
    if (value <= 10) return { text: 'Sport Mode', color: 'text-yellow-500', desc: 'Enhanced Performance' };
    return { text: 'Ludicrous Mode', color: 'text-red-500', desc: 'Maximum Output' };
  };

  const riskInfo = calculateRiskLevel(loop);

  const generateTicks = () => {
    const ticks = [];
    for (let i = 0; i < 20; i++) {
      const angle = -180 + (i * (180 / 19));
      const isHighlighted = i < (loop * 2); // Adjusted for 0-based logic
      
      const radius = 40;
      const radians = (angle * Math.PI) / 180;
      const x = 50 + radius * Math.cos(radians);
      const y = 50 + radius * Math.sin(radians);
      
      const tickLength = i % 2 === 0 ? 5 : 3;
      const endX = 50 + (radius + tickLength) * Math.cos(radians);
      const endY = 50 + (radius + tickLength) * Math.sin(radians);

      ticks.push(
        <line
          key={i}
          x1={x}
          y1={y}
          x2={endX}
          y2={endY}
          stroke={isHighlighted ? "url(#gradient)" : isDark ? "#374151" : "#E5E7EB"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    }
    return ticks;
  };

  return (
    <Modal
      className={`mx-auto w-[90%] max-w-[360px] bg-[#FFFFFF] px-[22px] py-3 ${
        isDark ? 'dark:bg-[#030303]' : ''
      }`}
      open={open}
      handleClose={handleClose}
      hideCloseIcon
    >
      <div className="flex items-center justify-between">
        <h2 className={`font-rogan text-2xl font-medium ${
          isDark ? 'text-white' : 'text-[#030303]'
        }`}>
          Set Loops
        </h2>
        <button
          onClick={handleClose}
          className="rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className={isDark ? 'text-white' : 'text-[#030303]'} size={20} />
        </button>
      </div>

      <div className={`mt-2 h-[1px] w-full ${
        isDark ? 'bg-gradient-divider' : 'bg-gradient-divider-light'
      }`} />

      <div className="mt-6">
        <div className="relative flex flex-col items-center">
          <div className="relative h-48 w-48">
            <svg className="absolute" viewBox="0 0 100 100">
              {/* Tick Marks */}
              {generateTicks()}

              {/* Gradient Definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#AA5BFF" />
                  <stop offset="100%" stopColor="#912BFF" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center Display */}
            <div className="absolute mt-[-46px] inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div 
                  className="text-5xl font-bold text-[#030303] dark:text-white"
                  key={loop}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {loop}x
                </motion.div>
                <motion.div 
                  className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  LOOPS
                </motion.div>
              </div>
            </div>
          </div>

          {/* Enhanced Slider */}
          <div className="relative w-full mt-[-58px]">
            {/* Slider Track and Progress Bar */}
            <div className="relative w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#AA5BFF] to-[#912BFF]"
                style={{ width: `${((loop) / 20) * 100}%` }} // Adjusted for 0-based logic
              />
            </div>

            {/* Slider Input */}
            <input
              type="range"
              min="0"
              max="20"
              value={loop}
              onChange={(e) => setLoop(Number(e.target.value))}
              className="absolute top-0 left-0 w-full h-1.5 appearance-none bg-transparent [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-b from-purple-500 to-purple-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]::before:content-[''] [&::-webkit-slider-thumb]::before:w-6 [&::-webkit-slider-thumb]::before:h-6 [&::-webkit-slider-thumb]::before:absolute [&::-webkit-slider-thumb]::before:inset-1/2 [&::-webkit-slider-thumb]::before:translate-x-[-50%] [&::-webkit-slider-thumb]::before:translate-y-[-50%]"
            />

            {/* Markers */}
            <div className="mt-2 flex justify-between px-[2px]">
              {[0, 1, 5, 10, 20].map((mark) => (
                <div
                  key={mark}
                  className={`relative flex flex-col items-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {/* Marker Line */}
                  <div
                    className={`absolute top-[-8px] h-2 w-0.5 transition-colors ${
                      loop >= mark ? 'bg-[#AA5BFF] shadow-[0_0_8px_rgba(170,91,255,0.6)]' : isDark ? 'bg-gray-700' : 'bg-gray-300'
                    }`}
                  />
                  {/* Marker Label */}
                  <span className="mt-2 text-xs font-medium">{mark}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Level Indicator */}
        <div className="rounded-lg my-3 bg-gray-50 px-4 py-2 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${isDark ? 'text-white' : 'text-[#030303]'}`}>
              <Gauge className="mr-2 text-[#AA5BFF]" size={24} />
              <div>
                <div className={`font-bold ${riskInfo.color}`}>
                  {riskInfo.text}
                </div>
                <div className="text-xs text-gray-500">
                  {riskInfo.desc}
                </div>
              </div>
            </div>
            <ChevronRight className="text-[#AA5BFF]" size={20} />
          </div>
        </div>

        {/* Confirm Button */}
        <motion.button
          onClick={() => onConfirm(loop)}
          className={`font-rogan-regular w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]`}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="relative z-10">CONFIRM {loop}X LOOPS</div>
        </motion.button>
      </div>
    </Modal>
  );
};

export default LoopModal;
