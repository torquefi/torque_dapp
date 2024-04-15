import React, { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/outline'

interface Token {
  symbol: string;
  name: string;
}

interface Network {
  name: string;
  chainId: number;
}

const tokens: Token[] = [
//   { symbol: 'TORQ', name: 'Torque' },
//   { symbol: 'TUSD', name: 'Torque USD' },
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'USDT', name: 'Tether' },
];

const networks: Network[] = [
  { name: 'Ethereum', chainId: 1 },
  { name: 'Arbitrum', chainId: 42161 },
  { name: 'Optimism', chainId: 10 },
  { name: 'Polygon', chainId: 137 },
  { name: 'Base', chainId: 8453 },
];

const BridgeAssets: React.FC = () => {
  const [fromToken, setFromToken] = useState<Token>(tokens[0]);
  const [toToken, setToToken] = useState<Token>(tokens[0]);
  const [fromNetwork, setFromNetwork] = useState<Network>(networks[0]);
  const [toNetwork, setToNetwork] = useState<Network>(networks[1]);
  const [amount, setAmount] = useState<number>(0);
  const [btnLoading, setBtnLoading] = useState(false)

  const handleSwap = () => {
    // Logic to initiate the swap transaction
    console.log(`Swapping ${amount} of ${fromToken.symbol} on ${fromNetwork.name} to ${toToken.symbol} on ${toNetwork.name}`);
  };

  return (
    <div className="rounded-[12px] border border-[#E6E6E6] bg-[#ffffff] from-[#0d0d0d] to-[#0d0d0d]/0 pb-4 pt-3 text-[#030303] px-4 dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white w-full max-w-[360px] m-auto">
      <div className="mb-3">
        <label className="block text-[14px] font-medium text-[#959595] mb-2">From</label>
        <div className="flex space-x-3">
          <div className="relative block w-full">
            <select
              className="appearance-none text-[15px] block w-full pl-[10px] pt-2 pb-2 pr-2 border border-[#efefef] bg-white dark:bg-transparent dark:from-[#161616] dark:via-[#161616]/40 dark:to-[#0e0e0e] dark:border-[#1A1A1A] dark:bg-gradient-to-b rounded-[8px] shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
              value={fromToken.symbol}
              onChange={(e) => setFromToken(tokens.find(token => token.symbol === e.target.value)!)}>
              {tokens.map(token => (
                <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-2.5 h-5 w-5 text-[#030303] dark:text-white pointer-events-none" />
          </div>
          <div className="relative block w-full">
            <select
              className="appearance-none text-[15px] block w-full pl-[10px] pt-2 pb-2 pr-2 border border-[#efefef] bg-white dark:bg-transparent dark:from-[#161616] dark:via-[#161616]/40 dark:to-[#0e0e0e] dark:border-[#1A1A1A] dark:bg-gradient-to-b rounded-[8px] shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
              value={fromNetwork.name}
              onChange={(e) => setFromNetwork(networks.find(network => network.name === e.target.value)!)}>
              {networks.map(network => (
                <option key={network.name} value={network.name}>{network.name}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-2.5 h-5 w-5 text-[#030303] dark:text-white pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-[14px] font-medium text-[#959595] mb-2">To</label>
        <div className="flex space-x-3">
          <div className="relative w-full">
            <select
              className="appearance-none text-[15px] block w-full pl-[10px] pt-2 pb-2 pr-2 border border-[#efefef] bg-white dark:bg-transparent dark:from-[#161616] dark:via-[#161616]/40 dark:to-[#0e0e0e] dark:border-[#1A1A1A] dark:bg-gradient-to-b rounded-[8px] shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
              value={toToken.symbol}
              onChange={(e) => setToToken(tokens.find(token => token.symbol === e.target.value)!)}>
              {tokens.map(token => (
                <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-2.5 h-5 w-5 text-[#030303] dark:text-white pointer-events-none" />
          </div>
          <div className="relative w-full">
            <select
              className="appearance-none text-[15px] block w-full pl-[10px] pt-2 pb-2 pr-2 border border-[#efefef] bg-white dark:bg-transparent dark:from-[#161616] dark:via-[#161616]/40 dark:to-[#0e0e0e] dark:border-[#1A1A1A] dark:bg-gradient-to-b rounded-[8px] shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
              value={toNetwork.name}
              onChange={(e) => setToNetwork(networks.find(network => network.name === e.target.value)!)}>
              {networks.map(network => (
                <option key={network.name} value={network.name}>{network.name}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-2.5 h-5 w-5 text-[#030303] dark:text-white pointer-events-none" />
          </div>
        </div>
      </div>
    <div className="mb-4 relative">
  <label className="block text-[14px] font-medium text-[#959595] mb-[2px]">Total Amount</label>
    <div className="flex relative">
        <input
        type="number"
        className="block w-full pl-[10px] pt-2 pb-2 border-[#efefef] border bg-white shadow-sm dark:bg-transparent dark:from-[#161616] dark:via-[#161616]/40 dark:to-[#0e0e0e] dark:border-[#1A1A1A] dark:bg-gradient-to-b rounded-[8px] ease-linear duration-200 transition-ease hover:ring-2 hover:ring-purple-500"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        placeholder="0.00"
        />
        <button
        type="button"
        className="absolute mr-2 inset-y-0 right-0 m-auto dark:text-white text-[11px] px-2 rounded-[8px] text-[#aa5bff] uppercase focus:outline-none bg-[#f8f8f8] dark:bg-[#1E1E1E] max-h-[24px]"
        onClick={() => setAmount( /* Logic to set max amount */ )}
        >
        MAX
        </button>
    </div>
    </div>
        <div className="flex justify-end">
            <button
            className={`font-mona mt-1 w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 text-[14px] uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
            ${btnLoading ? 'cursor-not-allowed text-[#eee]' : 'cursor-pointer '}
          `}
            // onClick={handleSwap}
            >
            Bridge
            </button>
        </div>
    </div>
  );
};

export default BridgeAssets;
