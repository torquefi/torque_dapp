import React, { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react'; // Import the X icon from Lucide

interface AnnouncementProps {
  positionsCount: number;
  isWalletConnected?: boolean;
}

const Announcement: React.FC<AnnouncementProps> = ({ positionsCount, isWalletConnected }) => {
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility

  // Determine the message based on wallet connection and positions count
  const getMessage = () => {
    if (!isWalletConnected) {
      return (
        <>
          Torque has better rates.{' '}
          <Link href="/borrow" className="font-bold text-md underline text-[#0A0B0D] hover:text-[#aa5bff] duration-100 ease-linear">
            Create Position
          </Link>
        </>
      );
    }

    if (positionsCount === 0) {
      return (
        <Link href="/borrow" className="font-bold text-md underline text-[#0A0B0D] hover:text-[#aa5bff] duration-100 ease-linear">
          Create Position
        </Link>
      );
    }

    return (
      <>
        Torque has better rates.{' '}
        <Link href="/import" className="font-bold text-md underline text-[#0A0B0D] hover:text-[#0072F5]">
          Import {positionsCount} positions
        </Link>
      </>
    );
  };

  // Handle closing the announcement
  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative w-full text-md max-w-[1200px] mx-auto rounded-[12px] border dark:border-[#1A1A1A] bg-white dark:bg-[#030303] mt-[24px] p-4 md:px-4 md:py-2">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Centered Text */}
        <div className="mx-auto flex items-center gap-3">
          <p className="font-semibold text-[#959595] dark:text-white">
            {getMessage()}
          </p>
        </div>

        {/* Close Button */}
        <div
          className="p-2 cursor-pointer bg-gray-100 hover:bg-gray-200 dark:hover:bg-[#1A1A1A] rounded-full transition-colors duration-200"
          onClick={handleClose}
          role="button"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4 text-[#959595] dark:text-white" />
        </div>
      </div>
    </div>
  );
};

export default Announcement;