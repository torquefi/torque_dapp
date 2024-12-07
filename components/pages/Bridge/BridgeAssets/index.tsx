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
import { motion } from 'framer-motion';

interface Token {
  symbol: string;
  name: string;
  icon?: string;
}

interface Network {
  name: string;
  chainId: number;
}

const tokens: Token[] = [
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'USDT', name: 'Tether' },
];

const networks: Network[] = [
  { name: 'Ethereum', chainId: 1 },
  { name: 'Arbitrum', chainId: 42161 },
];

const BridgeAssets: React.FC = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme);
  const { address } = useAccount();
  const [progressToNetwork, setProgressToNetwork] = useState(0);
  const [progressFromNetwork, setProgressFromNetwork] = useState(0);
  const [progressTransaction, setSetProgressTransaction] = useState(0);
  const [completedTransaction, setCompletedTransaction] = useState(false);

  const [fromToken, setFromToken] = useState<Token>();
  const [toToken, setToToken] = useState<Token>();
  const [fromNetwork, setFromNetwork] = useState<Network>();
  const [toNetwork, setToNetwork] = useState<Network>();
  const [amount, setAmount] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openPopover, setOpenPopover] = useState(false);
  const [isOpenConnectWalletModal, setOpenConnectWalletModal] = useState(false);
  const [showDestinationAddress, setShowDestinationAddress] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [customSlippage, setCustomSlippage] = useState(0.5);
  const [isAutoSlippage, setIsAutoSlippage] = useState(true);

  useEffect(() => {
    if (progressFromNetwork > 0) {
      setTimeout(() => {
        setSetProgressTransaction(10000);
      }, 500);
    }
  }, [progressFromNetwork]);

  useEffect(() => {
    if (progressTransaction > 0) {
      setTimeout(() => {
        setProgressToNetwork(500);
      }, 10000);
    }
  }, [progressTransaction]);

  useEffect(() => {
    if (progressToNetwork > 0) {
      setTimeout(() => {
        setCompletedTransaction(true);
      }, 500);
    }
  }, [progressToNetwork]);

  const handleResetProgress = () => {
    setProgressToNetwork(0);
    setProgressFromNetwork(0);
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
    if (!toNetwork || !fromNetwork || !toToken || !fromToken) {
      return toast.error('Please fill full information');
    }

    if (fromNetwork && toNetwork && fromNetwork.chainId === toNetwork.chainId) {
      return toast.error('Please select different network');
    }
    setProgressFromNetwork(500);
    console.log(
      `Swapping ${amount} of ${fromToken.symbol} on ${fromNetwork.name} to ${toToken.symbol} on ${toNetwork.name}`
    );
  };

  const variants = {
    open: { opacity: 1, height: 'auto', marginBottom: '1rem' },
    collapsed: { opacity: 0, height: 0, marginBottom: 0 },
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="m-auto w-full max-w-[360px] rounded-[12px]">
        <SkeletonDefault className="h-[330px] w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="m-auto w-full max-w-[360px] rounded-[12px] border border-[#E6E6E6] bg-[#ffffff] from-[#0d0d0d] to-[#0d0d0d]/0 px-4 pb-4 pt-3 text-[#030303] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white">
        <div className="flex items-center justify-between">
          <p className="font-rogan mb-3 mt-1 text-[28px] text-[#030303] dark:text-white">
            Bridge
          </p>
          <div className="flex items-center justify-between">
            <button
              className="mt-[0px]"
              onClick={() =>
                setShowDestinationAddress(!showDestinationAddress)
              }
            >
              <div className="transition-ease cursor-pointer items-center rounded-full bg-transparent p-[8px] duration-100 hover:bg-[#f9f9f9] dark:hover:bg-[#141414] xs:flex">
                <img
                  src="/icons/wallet.svg"
                  alt="wallet icon"
                  className="w-[15px]"
                />
              </div>
            </button>
            <Popover
              trigger="click"
              placement="bottom-right"
              className="mt-[8px] w-[200px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight dark:border-[#1A1A1A] dark:bg-[#161616]"
              content={
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[16px] font-semibold dark:text-white">
                      Slippage
                    </span>
                    <span className="text-[14px] font-medium dark:text-white">
                      {!isAutoSlippage ? `${slippage}%` : ''}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className={`flex-1 rounded-lg px-3 py-2 text-[14px] font-medium ${
                        isAutoSlippage
                          ? 'bg-[#F8F9FA] text-[#333] dark:bg-[#555] dark:text-white'
                          : 'bg-[#f8f8f8] text-[#aaa] dark:bg-[#444] dark:text-[#bbb]'
                      }`}
                      onClick={() => {
                        setIsAutoSlippage(true);
                      }}
                    >
                      Auto
                    </button>
                    <button
                      className={`flex-1 rounded-lg px-3 py-2 text-[14px] font-medium ${
                        !isAutoSlippage
                          ? 'bg-[#F8F9FA] text-[#333] dark:bg-[#555] dark:text-white'
                          : 'bg-[#f8f8f8] text-[#aaa] dark:bg-[#444] dark:text-[#bbb]'
                      }`}
                      onClick={() => {
                        setIsAutoSlippage(false);
                        setSlippage(customSlippage || 0.5);
                      }}
                    >
                      Custom
                    </button>
                  </div>
                  {!isAutoSlippage && (
                    <div className="mt-3 flex items-center">
                      <NumericFormat
                        className="w-full rounded-lg border border-[#F8F9FA] bg-[#f8f8f8] p-2 text-[14px] text-[#333] dark:border-[#555] dark:bg-[#444] dark:text-white"
                        value={customSlippage}
                        onValueChange={(e) =>
                          setCustomSlippage(e.floatValue || 0.5)
                        }
                        suffix="%"
                        decimalScale={2}
                        placeholder="0.50"
                      />
                    </div>
                  )}
                </div>
              }
            >
              <div className="transition-ease cursor-pointer items-center rounded-full bg-transparent mr-[-6px] p-[6px] duration-100 hover:bg-[#f9f9f9] dark:hover:bg-[#141414] xs:flex">
                <img
                  src="/icons/slider.svg"
                  alt="slider icon"
                  className="w-[20px]"
                />
              </div>
            </Popover>
          </div>
        </div>
        <div
          className={`mb-2 mt-[4px] h-[1px] w-full md:block ${
            theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
          }`}
        ></div>
        <div className="mb-3">
          <label className="mb-1 block text-[14px] font-medium text-[#959595]">
            From
          </label>
          <div className="flex items-center">
            <div className="transition-ease w-[60%] rounded-[10px] rounded-r-none border-[1px] border-solid border-[#ececec] duration-100 ease-linear dark:border-[#181818]">
              <p className="ml-2 pb-[2px] pt-[2px] text-[12px] text-[#959595]">
                Token
              </p>
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
                    {tokens?.map((token, index) => (
                      <div
                        key={token?.symbol}
                        className={`flex w-full cursor-pointer items-center gap-[4px] px-[8px] py-[12px] text-[#030303] dark:text-[#959595] ${
                          index === 0 ? 'pt-[8px]' : ''
                        } ${index === tokens.length - 1 ? 'pb-[8px]' : ''}`}
                        onClick={() => {
                          setOpenPopover((openPopover) => !openPopover);
                          setFromToken(token);
                          handleResetProgress();
                        }}
                      >
                        <img
                          src={`/icons/coin/${token.symbol.toLocaleLowerCase()}.png`}
                          alt={`${token.symbol} icon`}
                          className="h-[18px] w-[18px] rounded-full"
                        />
                        <p className="pt-[1px]">{token?.symbol}</p>
                      </div>
                    ))}
                  </HoverIndicator>
                }
              >
                <div className="flex w-full cursor-pointer items-center justify-between px-[8px] pb-[8px] text-[#030303] dark:text-[#959595]">
                  <div className="inline-flex items-center gap-[4px]">
                    {fromToken ? (
                      <>
                        <img
                          src={`/icons/coin/${fromToken.symbol.toLocaleLowerCase()}.png`}
                          alt={`${fromToken.symbol} icon`}
                          className="h-[18px] w-[18px] rounded-full"
                        />
                        <p className="cursor-pointer">{fromToken?.symbol}</p>
                      </>
                    ) : (
                      <>
                        <div className="h-[18px] w-[18px] rounded-full bg-[#E0E0E0] dark:bg-[#282828]" />
                        <p className="cursor-pointer text-[#959595]">Select</p>
                      </>
                    )}
                  </div>
                  <ChevronDownIcon className="pointer-events-none h-4 w-4 text-[#030303] dark:text-white" />
                </div>
              </Popover>
            </div>
            <div className="w-[40%] rounded-[10px] rounded-l-none border-[1px] border-l-0 border-solid border-[#ececec] dark:border-[#181818]">
              <p className="ml-2 pb-[2px] pt-[2px] text-[12px] text-[#959595]">
                Network
              </p>
              <Popover
                placement="bottom-right"
                trigger="click"
                className={`z-[10] mt-[12px] w-full bg-white leading-none dark:bg-[#030303]`}
                wrapperClassName="w-full"
                externalOpen={openPopover}
                content={
                  <HoverIndicator
                    divider
                    direction="vertical"
                    indicatorClassName="rounded-[6px]"
                  >
                    {networks?.map((network, index) => (
                      <div
                        key={network.chainId}
                        className={`flex w-full cursor-pointer items-center gap-[4px] px-[8px] py-[12px] text-[#030303] dark:text-[#959595] ${
                          index === 0 ? 'pt-[8px]' : ''
                        } ${index === networks.length - 1 ? 'pb-[8px]' : ''}`}
                        onClick={() => {
                          setFromNetwork(network);
                          setOpenPopover((openPopover) => !openPopover);
                          handleResetProgress();
                        }}
                      >
                        <img
                          src={`/icons/coin/${network.name.toLocaleLowerCase()}.png`}
                          alt={`${network.name} icon`}
                          className="h-[18px] w-[18px] rounded-[6px]"
                        />
                        <p>{network?.name}</p>
                      </div>
                    ))}
                  </HoverIndicator>
                }
              >
                <div className="flex w-full cursor-pointer items-center justify-between px-[8px] pb-[8px] text-[#030303] dark:text-[#959595]">
                  <div className="inline-flex flex-1 items-center gap-[4px]">
                    {fromNetwork ? (
                      <>
                        <img
                          src={`/icons/coin/${fromNetwork.name.toLocaleLowerCase()}.png`}
                          alt={`${fromNetwork.name} icon`}
                          className="h-[18px] w-[18px] rounded-[6px]"
                        />
                        <p className="w-[60%] cursor-pointer text-ellipsis">
                          {fromNetwork?.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="h-[18px] w-[18px] rounded-[6px] bg-[#E0E0E0] dark:bg-[#282828]" />
                        <p className="cursor-pointer text-[#959595]">Select</p>
                      </>
                    )}
                  </div>
                  <ChevronDownIcon className="h-4 w-4 text-[#030303] dark:text-white" />
                </div>
              </Popover>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="mb-1 block text-[14px] font-medium text-[#959595]">
            To
          </label>
          <div className="flex">
            <div className="w-[60%] rounded-[10px] rounded-r-none border-[1px] border-solid border-[#ececec] dark:border-[#181818]">
              <p className="ml-2 pb-[2px] pt-[2px] text-[12px] text-[#959595]">
                Token
              </p>
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
                    {tokens?.map((token, index) => (
                      <div
                        key={token?.symbol}
                        className={`flex w-full cursor-pointer items-center gap-[4px] px-[8px] py-[12px] text-[#030303] dark:text-[#959595] ${
                          index === 0 ? 'pt-[8px]' : ''
                        } ${index === tokens.length - 1 ? 'pb-[8px]' : ''}`}
                        onClick={() => {
                          setToToken(token);
                          setOpenPopover((openPopover) => !openPopover);
                          handleResetProgress();
                        }}
                      >
                        <img
                          src={`/icons/coin/${token.symbol.toLocaleLowerCase()}.png`}
                          alt={`${token.symbol} icon`}
                          className="h-[18px] w-[18px] rounded-full"
                        />
                        <p className="pt-[1px]">{token?.symbol}</p>
                      </div>
                    ))}
                  </HoverIndicator>
                }
              >
                <div className="flex w-full cursor-pointer items-center justify-between px-[8px] pb-[8px] text-[#030303] dark:text-[#959595]">
                  <div className="inline-flex flex-1 items-center gap-[4px]">
                    {toToken ? (
                      <>
                        <img
                          src={`/icons/coin/${toToken.symbol.toLocaleLowerCase()}.png`}
                          alt={`${toToken.symbol} icon`}
                          className="h-[18px] w-[18px] rounded-full"
                        />
                        <p className="cursor-pointer">{toToken?.symbol}</p>
                      </>
                    ) : (
                      <>
                        <div className="h-[18px] w-[18px] rounded-full bg-[#E0E0E0] dark:bg-[#282828]" />
                        <p className="cursor-pointer text-[#959595]">Select</p>
                      </>
                    )}
                  </div>
                  <ChevronDownIcon className="pointer-events-none h-4 w-4 text-[#030303] dark:text-white" />
                </div>
              </Popover>
            </div>
            <div className="w-[40%] rounded-[10px] rounded-l-none border-[1px] border-l-0 border-solid border-[#ececec] dark:border-[#181818]">
              <p className="ml-2 text-ellipsis pb-[2px] pt-[2px] text-[12px] text-[#959595]">
                Network
              </p>
              <Popover
                placement="bottom-right"
                trigger="click"
                className={`z-[10] mt-[12px] w-full bg-white leading-none dark:bg-[#030303]`}
                wrapperClassName="w-full"
                externalOpen={openPopover}
                content={
                  <HoverIndicator
                    divider
                    direction="vertical"
                    indicatorClassName="rounded-[6px]"
                  >
                    {networks?.map((network, index) => (
                      <div
                        key={network.chainId}
                        className={`flex w-full cursor-pointer items-center gap-[4px] px-[8px] py-[12px] text-[#030303] dark:text-[#959595] ${
                          index === 0 ? 'pt-[8px]' : ''
                        } ${index === networks.length - 1 ? 'pb-[8px]' : ''}`}
                        onClick={() => {
                          setToNetwork(network);
                          setOpenPopover((openPopover) => !openPopover);
                          handleResetProgress();
                        }}
                      >
                        <img
                          src={`/icons/coin/${network.name.toLocaleLowerCase()}.png`}
                          alt={`${network.name} icon`}
                          className="h-[18px] w-[18px] rounded-[6px]"
                        />
                        <p>{network?.name}</p>
                      </div>
                    ))}
                  </HoverIndicator>
                }
              >
                <div className="flex w-full cursor-pointer items-center justify-between px-[8px] pb-[8px] text-[#030303] dark:text-[#959595]">
                  <div className="inline-flex items-center gap-[4px]">
                    {toNetwork ? (
                      <>
                        <img
                          src={`/icons/coin/${toNetwork.name.toLocaleLowerCase()}.png`}
                          alt={`${toNetwork.name} icon`}
                          className="h-[18px] w-[18px] rounded-[6px]"
                        />
                        <p className="w-[60%] cursor-pointer text-ellipsis">
                          {toNetwork?.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="h-[18px] w-[18px] rounded-[6px] bg-[#E0E0E0] dark:bg-[#282828]" />
                        <p className="cursor-pointer text-[#959595]">Select</p>
                      </>
                    )}
                  </div>
                  <ChevronDownIcon className="h-4 w-4 text-[#030303] dark:text-white" />
                </div>
              </Popover>
            </div>
          </div>
        </div>
        <div className="relative mb-4">
          <label className="mb-[4px] block text-[14px] font-medium text-[#959595]">
            Amount
          </label>
          <div className="relative flex">
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
            <button
              type="button"
              className="absolute inset-y-0 right-0 m-auto mr-2 max-h-[24px] rounded-[8px] bg-[#f8f8f8] px-2 text-[11px] uppercase text-[#aa5bff] focus:outline-none dark:bg-[#1E1E1E] dark:text-white"
            >
              MAX
            </button>
          </div>
        </div>
        {showDestinationAddress && (
          <motion.div
            key="destinationAddress"
            initial="collapsed"
            animate={showDestinationAddress ? 'open' : 'collapsed'}
            variants={variants}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <label className="mb-[4px] block text-[14px] font-medium text-[#959595]">
              Destination
            </label>
            <input
              type="text"
              className="block w-full truncate placeholder:text-[#959595] rounded-[8px] border border-[#efefef] bg-white pb-2 pl-[10px] pt-2 shadow-sm duration-100 ease-linear dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-b dark:from-[#161616] dark:via-[#161616]/40 dark:to-[#0e0e0e]"
              placeholder="0x123.."
            />
          </motion.div>
        )}
        <div className="flex justify-end">
          <button
            className={`font-rogan-regular mt-1 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF] ${
              btnLoading ? 'cursor-not-allowed text-[#eee]' : 'cursor-pointer '
            }`}
            onClick={handleSwap}
          >
            {address ? 'Bridge' : 'Connect Wallet'}
          </button>
        </div>
      </div>
      <ConnectWalletModal
        openModal={isOpenConnectWalletModal}
        handleClose={() => setOpenConnectWalletModal(false)}
      />
    </>
  );
};

export default BridgeAssets;
