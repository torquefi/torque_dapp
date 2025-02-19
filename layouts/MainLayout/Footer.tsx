import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTheme } from '@/lib/redux/slices/theme';
import { AppStore } from '@/types/store';
import Link from 'next/link';

type ThemeValue = 'light' | 'dark' | 'auto';

export default function Footer() {
  const dispatch = useDispatch();
  const theme = useSelector((store: AppStore) => store.theme.theme);
  const [currentYear] = useState(new Date().getFullYear());

  const THEME_LIST = [
    {
      icon: <img src="/assets/desktop-outlined.svg" className="h-4 w-4" alt="Auto Theme" />,
      value: 'auto' as ThemeValue,
    },
    {
      icon: <img src="/assets/sun-outlined.svg" className="h-4 w-4" alt="Light Theme" />,
      value: 'light' as ThemeValue,
    },
    {
      icon: <img src="/assets/moon-outlined.svg" className="h-4 w-4" alt="Dark Theme" />,
      value: 'dark' as ThemeValue,
    },
  ];

  const themeSelectClasses = useMemo(() => {
    switch (theme) {
      case 'dark': return 'left-[58px]';
      case 'light': return 'left-[30px]';
      default: return 'left-0.5';
    }
  }, [theme]);

  const handleThemeChange = (value: ThemeValue) => {
    dispatch(updateTheme(value));
    localStorage.setItem('theme', value);
    document.documentElement.classList.toggle('dark', value === 'dark');
  };

  return (
    <div className="container relative mx-auto mt-[46px] flex max-w-[1244px] w-full justify-center px-4 lg:px-8">
      <div className={`absolute left-0 top-0 h-[1px] w-full ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider-dark'}`}/>
      <footer className="flex w-full max-w-[1244px] justify-between pb-4 pt-6 text-[#959595] xs:text-[14px] sm:text-[14px] md:pb-[12px] md:pt-4">
        <Link
          href="https://torque.fi"
          className="cursor-pointer flex items-center transition-colors duration-100 ease-linear hover:text-gray-500 dark:hover:text-white"
          target="_blank"
        >
          <span className="this-year mr-1">© {currentYear}</span>Torque Inc.
        </Link>
        <div className="hidden md:flex space-x-8 text-[14px]">
          {socials.map((item) => (
            <Link
              href={item.link}
              key={item.label}
              className="transition-colors duration-300 ease-linear hover:text-gray-500 dark:hover:text-white"
              target="_blank"
            >
              {item.label}
            </Link>
          ))}
          {privacies.map((item) => (
            <Link
              href={item.link}
              key={item.label}
              className="hidden xs:block transition-colors duration-300 ease-linear hover:text-gray-500 dark:hover:text-white"
              target="_blank"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="bg-gray-100 dark:bg-[#0e0e0e] relative flex items-center rounded-full p-0.5 transition-colors duration-300" role="radiogroup">
            <div className={`bg-white dark:bg-[#1c1c1c] transition-all duration-300 absolute top-0.5 h-7 w-7 rounded-full ${themeSelectClasses}`}></div>
            {THEME_LIST.map((item) => (
                <div
                    className={`relative dark:invert inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 ease-in-out ${item.value === theme ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    key={item.value}
                    onClick={() => handleThemeChange(item.value)}
                    tabIndex={0}
                    role="radio"
                    aria-label={item.value}
                    aria-checked={item.value === theme}
                >
                    {item.icon}
                </div>
            ))}
        </div>
      </footer>
    </div>
  );
}

// You might need to ensure these are defined or imported correctly
const socials = [
  { label: 'Blog', link: 'https://medium.com/@torquefi' },
  { label: 'Telegram', link: 'https://t.me/torquefi' },
  { label: 'GitHub', link: 'https://github.com/torquefi' },
];

const privacies = [
  { label: 'Terms', link: 'https://torque.fi/terms' },
];
