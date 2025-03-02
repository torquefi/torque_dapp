import React from 'react'
import { useRouter } from "next/router"
import { AppStore } from '@/types/store'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion';

export const CookiesPage = () => {
  
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
      className="px-3 md:px-16 text-left mb-4"
    >
      <div className="max-w-xl mx-auto">
        <motion.h1
          variants={fadeInUp}
          className="text-3xl font-rogan font-bold mb-2 text-[#030303] dark:text-white tracking-tight"
        >
          Cookies Policy
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
          Welcome to Torque Protocol. This Cookies Policy explains how we use cookies and similar technologies when you interact with our website or interfaces. By using Torque, you agree to the use of cookies as described in this policy.
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white tracking-tight"
        >
          1. What Are Cookies?
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          Cookies are text files stored on your device when you visit a website. They help improve your experience by remembering your preferences and enabling certain functions.
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          2. How We Use Cookies
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          Torque uses cookies for the following purposes:
        </motion.p>
        <motion.ul
          variants={fadeInUp}
          className="list-disc list-inside mb-2 text-[#595959] dark:text-[#868686]"
        >
          <li>
            <strong>Analytics:</strong> Understanding how users interact with our website.
          </li>
          <li>
            <strong>Functionality:</strong>Preferences such as theme settings (light/dark mode).
          </li>
          <li>
            <strong>Security:</strong> Enhancing the security of our interface(s).
          </li>
        </motion.ul>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          3. Types of Cookies We Use
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          We use the following types of cookies:
        </motion.p>
        <motion.ul
          variants={fadeInUp}
          className="list-disc list-inside mb-2 text-[#595959] dark:text-[#868686]"
        >
          <li>
            <strong>Strictly Necessary:</strong> Essential for the website to function properly.
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us analyze user behavior and improve our services.
          </li>
          <li>
            <strong>Preference Cookies:</strong> Remember your settings and preferences.
          </li>
        </motion.ul>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          4. Third-Party Cookies
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          We may use third-party services (e.g., analytics providers) that place cookies on your device. These cookies are subject to the respective third-party privacy policies.
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl tracking-tight font-semibold font-rogan mt-8 mb-2 text-[#030303] dark:text-white"
        >
          5. Managing Cookies
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-[#595959] dark:text-[#868686]"
        >
          You can control or disable cookies through your browser settings. However, disabling certain cookies may affect the user experience and functionality of our interface(s).
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
          We may update this Cookies Policy at any time. Changes will be posted on this page, and your continued use of Torque constitutes acceptance of the updated policy.
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
          If you have questions about this Cookies Policy, please email us at
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
