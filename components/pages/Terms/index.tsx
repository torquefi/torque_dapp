import React from 'react'
import { useRouter } from "next/router"
import { AppStore } from '@/types/store'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion';

export const TermsPage = () => {
  
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
          Terms of Service
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
          Welcome to Torque Protocol. These Terms of Service (“Terms”) govern your
          access to and use of our decentralized lending and borrowing system
          and related services. By interacting with Torque, you agree to the following Terms.
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white tracking-tight"
        >
          1. Overview of Services
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          Torque is a decentralized protocol enabling users to lend and borrow digital assets permissionlessly. Transactions occur onchain and are subject to immutability.
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          2. Eligibility
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          By using Torque, you confirm that you are 18 years old or
          the age of majority in your jurisdiction and that your use complies
          with applicable laws. Consider consulting a financial advisor before making investment decisions. Torque is not an advisor and will not provide financial advice. Data displayed is for informational purposes only.
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          3. User Responsibilities
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          You are responsible for:
        </motion.p>
        <motion.ul
          variants={fadeInUp}
          className="list-disc list-inside mb-2 text-[#595959] dark:text-[#868686]"
        >
          <li>Managing your blockchain wallet and private keys.</li>
          <li>Understanding the risks of lending and borrowing in web3.</li>
          <li>Compliance with applicable local and international laws.</li>
        </motion.ul>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          4. Disclaimer of Liability
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          Torque operates autonomously and in a decentralized fashion. It does not custody
          funds or guarantee returns. All funds are help in non-custodial smart contract pools across blockchains. Use Torque at your own risk. We are not
          liable for:
        </motion.p>
        <motion.ul
          variants={fadeInUp}
          className="list-disc list-inside mb-2 text-[#595959] dark:text-[#868686]"
        >
          <li>Smart contract vulnerabilities or exploits.</li>
          <li>Loss of funds due to mismanagement or ignorance.</li>
          <li>Regulatory changes impacting the use of Torque.</li>
        </motion.ul>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          5. Changes to the Terms
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          We may update these Terms at our discretion at any time. Continued use of the Protocol through our interface(s) constitutes agreement
          to these Terms.
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          6. Contact Us
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          Please email us at
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
