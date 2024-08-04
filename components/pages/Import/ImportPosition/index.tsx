import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import Popover from '@/components/common/Popover';
import HoverIndicator from '@/components/common/HoverIndicator';
import { useSelector } from 'react-redux';
import { AppStore } from '@/types/store';
import SkeletonDefault from '@/components/skeleton';
import ConnectWalletModal from '@/layouts/MainLayout/ConnectWalletModal';
import { useAccount } from 'wagmi';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Market {
  name: string;
}

interface Collateral {
  name: string;
}

const markets: Market[] = [
  { name: 'Radiant USDC' },
  { name: 'Radiant USDC.e' },
  { name: 'Aave V3 USDC' },
  { name: 'Aave V3 USDC.e' },
  { name: 'Dolomite USDC' },
  { name: 'Dolomite USDC.e' },
  { name: 'Lodestar USDC' },
  { name: 'Lodestar USDC.e' },
  { name: 'Silo WBTC/USDC.e' },
  { name: 'Silo ARB/USDC.e' },
];

const collaterals: Collateral[] = [
  { name: 'WBTC' },
  { name: 'WETH' },
  { name: 'ARB' },
];

const ImportPosition: React.FC = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme);
  const { address } = useAccount();
  const [progressToMarket, setProgressToMarket] = useState(0);
  const [progressFromMarket, setProgressFromMarket] = useState(0);
  const [progressTransaction, setSetProgressTransaction] = useState(0);
  const [completedTransaction, setCompletedTransaction] = useState(false);

  const [selectedMarket, setSelectedMarket] = useState<Market>();
  const [selectedCollateral, setSelectedCollateral] = useState<Collateral>();
  const [amount, setAmount] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openPopover, setOpenPopover] = useState(false);
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false);
  const [showBeneficiaryAddress, setShowBeneficiaryAddress] = useState(false);
  const [customInputVisible, setCustomInputVisible] = useState(false);
  const [infoItems, setInfoItems] = useState([
    { title: 'Current APR', content: '0.00%' },
    { title: 'Torque APR', content: '0.00%' },
    { title: 'Annual Savings', content: '$0.00' },
    { title: 'Monthly Savings', content: '$0.00' },
  ]);

  const [selectedTab, setSelectedTab] = useState<number | null>(null);

  useEffect(() => {
    if (progressFromMarket > 0) {
      setTimeout(() => {
        setSetProgressTransaction(10000);
      }, 500);
    }
  }, [progressFromMarket]);

  useEffect(() => {
    if (progressTransaction > 0) {
      setTimeout(() => {
        setProgressToMarket(500);
      }, 10000);
    }
  }, [progressTransaction]);

  useEffect(() => {
    if (progressToMarket > 0) {
      setTimeout(() => {
        setCompletedTransaction(true);
      }, 500);
    }
  }, [progressToMarket]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const fetchInfoItems = () => {
    // Placeholder for actual fetching logic
    setInfoItems([
      { title: 'Current APR', content: '0.00%' },
      { title: 'Torque APR', content: '0.00%' },
      { title: 'Annual Savings', content: '$0.00' },
      { title: 'Monthly Savings', content: '$0.00' },
    ]);
  };

  const handleResetProgress = () => {
    setProgressToMarket(0);
    setProgressFromMarket(0);
    setSetProgressTransaction(0);
    setCompletedTransaction(false);
  };

  const handleSwap = () => {
    if (!address) {
      setOpenConnectWalletModal(true);
      return;
    }
    if (!amount) {
      return toast.error('Please enter amount');
    }
    if (!selectedMarket || !selectedCollateral) {
      return toast.error('Please fill full information');
    }

    setProgressFromMarket(500);
    console.log(
      `Refinancing ${amount} on ${selectedMarket.name} with ${selectedCollateral.name}`
    );
    fetchInfoItems();
  };

  const handleAmountTabClick = (percentage: number, index: number) => {
    setAmount((percentage * 100).toString());
    setCustomInputVisible(false);
    setSelectedTab(index);
  };

  const handleCustomClick = () => {
    setCustomInputVisible(true);
    setSelectedTab(null);
  };

  const handleCloseCustomInput = () => {
    setCustomInputVisible(false);
  };

  if (isLoading) {
    return (
      <div className="m-auto w-full max-w-[360px] rounded-[12px]">
        <SkeletonDefault className="h-[280px] w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="m-auto w-full max-w-[360px] rounded-[12px] border border-[#E6E6E6] bg-[#ffffff] from-[#0d0d0d] to-[#0d0d0d]/0 px-4 pb-4 pt-3 text-[#030303] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white mb-4">
        <div className="flex items-center justify-between">
          <p className="font-rogan mb-3 mt-2 text-[28px] text-[#030303] dark:text-white">
            Import
          </p>
          <div className="flex items-center justify-between">
            <button className="mt-[0px]">
              <img src="/icons/slider.svg" alt="slider icon" className="w-[20px]" />
            </button>
          </div>
        </div>
        <div
          className={`mb-2 mt-[4px] h-[1px] w-full md:block ${
            theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
          }`}
        ></div>
        <div className="mb-3">
          <label className="mb-1 block text-[14px] font-medium text-[#959595]">Market</label>
          <div className="flex items-center">
            <div className="transition-ease w-full rounded-[10px] border-[1px] border-solid border-[#ececec] duration-100 ease-linear dark:border-[#181818]">
              <Popover
                placement="bottom-left"
                trigger="click"
                wrapperClassName="w-full"
                className={`z-[10] mt-[12px] max-h-[200px] overflow-y-auto w-full bg-white leading-none dark:bg-[#030303]`}
                externalOpen={openPopover}
                content={
                  <HoverIndicator
                    divider
                    direction="vertical"
                    indicatorClassName="rounded-[6px] w-full"
                    className="w-full"
                  >
                    {markets?.map((market, index) => (
                      <div
                        key={market.name}
                        className={`flex w-full cursor-pointer items-center gap-[4px] px-[8px] py-[12px] text-[#030303] dark:text-[#959595] ${
                          index === 0 ? 'pt-[8px]' : ''
                        } ${index === markets.length - 1 ? 'pb-[8px]' : ''}`}
                        onClick={() => {
                          setOpenPopover((openPopover) => !openPopover);
                          setSelectedMarket(market);
                          handleResetProgress();
                        }}
                      >
                        <p className="pt-[1px]">{market?.name}</p>
                      </div>
                    ))}
                  </HoverIndicator>
                }
              >
                <div className="flex w-full cursor-pointer items-center justify-between px-[8px] pt-[8px] pb-[8px] text-[#030303] dark:text-[#959595]">
                  <div className="inline-flex items-center gap-[4px]">
                    {selectedMarket ? (
                      <p className="cursor-pointer">{selectedMarket?.name}</p>
                    ) : (
                      <p className="cursor-pointer text-[#959595]">Select Market</p>
                    )}
                  </div>
                  <ChevronDownIcon className="pointer-events-none h-4 w-4 text-[#030303] dark:text-white" />
                </div>
              </Popover>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="mb-1 block text-[14px] font-medium text-[#959595]">Collateral</label>
          <div className="flex items-center">
            <div className="transition-ease w-full rounded-[10px] border-[1px] border-solid border-[#ececec] duration-100 ease-linear dark:border-[#181818]">
              <Popover
                placement="bottom-left"
                trigger="click"
                wrapperClassName="w-full"
                className={`z-[10] mt-[12px] w-full bg-white leading-none dark:bg-[#030303]`}
                externalOpen={openPopover}
                content={
                  <HoverIndicator
                    divider
                    direction="vertical"
                    indicatorClassName="rounded-[6px] w-full"
                    className="w-full"
                  >
                    {collaterals?.map((collateral, index) => (
                      <div
                        key={collateral.name}
                        className={`flex w-full cursor-pointer items-center gap-[4px] px-[8px] py-[12px] text-[#030303] dark:text-[#959595] ${
                          index === 0 ? 'pt-[8px]' : ''
                        } ${index === collaterals.length - 1 ? 'pb-[8px]' : ''}`}
                        onClick={() => {
                          setOpenPopover((openPopover) => !openPopover);
                          setSelectedCollateral(collateral);
                          handleResetProgress();
                        }}
                      >
                        <p className="pt-[1px]">{collateral?.name}</p>
                      </div>
                    ))}
                  </HoverIndicator>
                }
              >
                <div className="flex w-full cursor-pointer items-center justify-between px-[8px] pt-[8px] pb-[8px] text-[#030303] dark:text-[#959595]">
                  <div className="inline-flex items-center gap-[4px]">
                    {selectedCollateral ? (
                      <p className="cursor-pointer">{selectedCollateral?.name}</p>
                    ) : (
                      <p className="cursor-pointer text-[#959595]">Select Collateral</p>
                    )}
                  </div>
                  <ChevronDownIcon className="pointer-events-none h-4 w-4 text-[#030303] dark:text-white" />
                </div>
              </Popover>
            </div>
          </div>
        </div>
        {selectedMarket && selectedCollateral && (
          <motion.div
            className="relative mb-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            <label className="mb-[4px] block text-[14px] font-medium text-[#959595]">
              Amount
            </label>
            <AnimatePresence>
              {!customInputVisible ? (
                <motion.div
                  className="flex space-x-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[0.5, 0.75, 1].map((percentage, index) => (
                    <motion.button
                      key={percentage}
                      onClick={() => handleAmountTabClick(percentage, index)}
                      className={`flex-1 py-[6px] rounded-md text-[12px] xs:text-[14px] ${
                        selectedTab === index
                          ? 'bg-[#AA5BFF] text-white border-1 border-[#AA5BFF]'
                          : 'bg-[#AA5BFF] bg-opacity-20 text-[#AA5BFF]'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {percentage * 100}%
                    </motion.button>
                  ))}
                  <motion.button
                    onClick={handleCustomClick}
                    className={`flex-1 py-[6px] rounded-md text-[12px] xs:text-[14px] ${
                      customInputVisible
                        ? 'bg-[#AA5BFF] text-white border-1 border-[#AA5BFF]'
                        : 'bg-[#AA5BFF] bg-opacity-20 text-[#AA5BFF]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Custom
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  className="relative flex"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.2 }}
                >
                  <NumericFormat
                    className="transition-ease placeholder:text-[#959595] block w-full rounded-[8px] border border-[#efefef] bg-white pb-2 pl-[10px] pt-2 shadow-sm duration-100 ease-linear dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b dark:from-[#161616] dark:via-[#161616]/40 dark:to-[#0e0e0e]"
                    value={amount}
                    thousandSeparator
                    onChange={(e) => {
                      setAmount(e.target.value);
                      handleResetProgress();
                    }}
                    placeholder="0.00"
                  />
                  <motion.button
                    type="button"
                    className="absolute inset-y-0 right-0 m-auto mr-2 max-h-[24px] rounded-[8px] bg-[#f8f8f8] px-2 text-[11px] uppercase text-[#aa5bff] focus:outline-none dark:bg-[#1E1E1E] dark:text-white"
                    onClick={handleCloseCustomInput}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✕
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
        <div className="flex justify-end">
          <button
            className={`font-rogan-regular mt-1 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF] ${
              btnLoading ? 'cursor-not-allowed text-[#eee]' : 'cursor-pointer '
            }`}
            onClick={handleSwap}
          >
            {address ? 'Import Position' : 'Connect Wallet'}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {selectedMarket && selectedCollateral && (
          <motion.div
            className="grid max-w-[360px] mx-auto h-auto w-full grid-cols-2 gap-[14px]"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: {
                opacity: 1,
                height: 'auto',
                transition: {
                  duration: 0.2,
                  staggerChildren: 0.1,
                },
              },
              hidden: { opacity: 0, height: 0 },
            }}
          >
            {infoItems.map((item, i) => (
              <motion.div
                key={i}
                className="flex h-[98px] flex-col items-center justify-center rounded-[12px] border border-[#E6E6E6] bg-white dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b"
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 20 },
                }}
              >
                <div className="font-rogan text-[24px] text-[#404040] dark:text-white">
                  {item.content}
                </div>
                <div className="mt-1 text-[15px] text-[#959595]">
                  {item.title}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <ConnectWalletModal
        openModal={isOpenConnectWalletModal}
        handleClose={() => setOpenConnectWalletModal(false)}
      />
    </>
  );
};

export default ImportPosition;
