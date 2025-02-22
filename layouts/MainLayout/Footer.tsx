import { updateTheme } from '@/lib/redux/slices/theme';
import { AppStore } from '@/types/store';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type ThemeValue = 'light' | 'dark';

export default function Footer() {
  const dispatch = useDispatch();
  const theme = useSelector((store: AppStore) => store.theme.theme);
  const [currentYear] = useState(new Date().getFullYear());
  const [isChecked, setIsChecked] = useState(theme === 'dark');

  useEffect(() => {
    setIsChecked(theme === 'dark');
  }, [theme]);

  const handleDarkMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.checked ? 'dark' : 'light';
    dispatch(updateTheme(newTheme as ThemeValue));
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', e.target.checked);
  };

  return (
    <div className="container relative mx-auto mt-[46px] flex max-w-[1244px] w-full justify-center px-4 lg:px-8">
      <div className={`absolute left-0 top-0 h-[1px] w-full ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`} />
      <footer className="flex w-full max-w-[1244px] justify-between pb-3 pt-4 text-[#959595] xs:text-[14px] sm:text-[14px] md:pb-[8px] md:pt-[14px]">
        <Link href="https://torque.fi" className="cursor-pointer flex items-center transition-colors duration-100 ease-linear hover:text-gray-500 dark:hover:text-white" target="_blank">
          <span className="this-year mr-1">© {currentYear}</span>Torque Inc.
        </Link>
        <div className="space-x-6 ml-[-60px] hidden md:block">
        {links.map((item) => (
            <Link href={item.link} key={item.label} className="transition-colors duration-300 ease-linear hover:text-gray-500 dark:hover:text-white" target="_blank">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isChecked} onChange={handleDarkMode} className="sr-only" />
            <div className="toggle-bg w-12 h-6 bg-gray-200 rounded-full p-1 transition duration-200 ease-in-out dark:bg-[#212121] peer-checked:bg-blue-600">
              <span className={`block w-4 h-4 bg-white dark:bg-[#3a3a3a] rounded-full shadow transform transition duration-200 ease-in-out ${isChecked ? 'translate-x-6' : 'translate-x-0'}`}></span>
            </div>
          </label>
        </div>
      </footer>
    </div>
  );
}

const links = [
  { label: 'Blog', link: 'https://medium.com/@torquefi' },
  { label: 'Telegram', link: 'https://t.me/torquefi' },
  { label: 'GitHub', link: 'https://github.com/torquefi' },
  { label: 'Terms', link: 'https://torque.fi/terms' },
];