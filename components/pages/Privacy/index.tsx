import React from 'react'
import { useRouter } from "next/router"
import { AppStore } from '@/types/store'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion';

export const PrivacyPage = () => {
  
  const router = useRouter()
  const theme = useSelector((store: AppStore) => store.theme.theme)

  const fadeInUp = {
    initial: {
      opacity: 0,
      y: 30
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.section
      initial="initial"
      animate="animate"
      exit={{ opacity: 0 }}
      className="px-3 md:px-16 text-left"
    >
      <div className="max-w-xl mx-auto">
        <motion.h1
          variants={fadeInUp}
          className="text-3xl font-rogan font-bold mb-2 text-[#030303] dark:text-white tracking-tight"
        >
          Privacy Policy
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          Last updated: March 2nd, 2025
        </motion.p>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          Welcome to Torque Protocol. This Privacy Policy explains how we handle information in connection with your use of our decentralized lending and borrowing system. By using Torque, you agree to the practices described in this policy.
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white tracking-tight"
        >
          1. Information We Do Not Collect
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          We don't collect, store, or process any personal information such as:
        </motion.p>
        <motion.ul
          variants={fadeInUp}
          className="list-disc list-inside mb-2 text-[#595959] dark:text-[#868686]"
        >
          <li>Your name, email address, or physical address.</li>
          <li>Any financial data beyond what is publicly available.</li>
          <li>Your private keys or wallet credentials.</li>
        </motion.ul>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          2. Blockchain Transparency
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          Transactions occur on public and immutable blockchains. This means:
        </motion.p>
        <motion.ul
          variants={fadeInUp}
          className="list-disc list-inside mb-2 text-[#595959] dark:text-[#868686]"
        >
          <li>Your wallet address and transaction history are visible on the blockchain.</li>
          <li>Torque doesn't control or have access to data beyond what is public.</li>
        </motion.ul>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          3. Use of Interfaces and Analytics
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          When you interact with Torque through our interface(s), we may collect limited, non-personal information for analytics and user experience purposes, such as:
        </motion.p>
        <motion.ul
          variants={fadeInUp}
          className="list-disc list-inside mb-2 text-[#595959] dark:text-[#868686]"
        >
          <li>Browser type and current version.</li>
          <li>IP address to protect against malicious actors.</li>
          <li>Usage patterns to improve user experience.</li>

        </motion.ul>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          4. Third-Party Services
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          Torque integrates third-party services (wallets, money markets, and DEXs). Each of these have their own privacy policies, and we encourage you to review them.
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          5. Data Security
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          While Torque does not collect personal data, we take measures to protect the integrity of our interfaces and systems. However, you are responsible for securing your wallet.
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          6. Changes to This Policy
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          We may update this Privacy Policy at any time. Changes will be posted on this page, and your continued use of Torque constitutes acceptance of the updated policy.
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          7. Contact Us
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          If you have questions about this Privacy Policy, please email us at
          <a href="mailto:hello@torque.fi" className="text-[#aa5bff]">
            {" "}
            hello@torque.fi
          </a>
          .
        </motion.p>
      </div>
    </motion.section>
  )
}
