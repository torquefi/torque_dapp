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
    const newTheme: ThemeValue = e.target.checked ? 'dark' : 'light';
    dispatch(updateTheme(newTheme));
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', e.target.checked);
  };

  return (
    <div className="container relative mx-auto mt-[46px] flex max-w-[1244px] w-full justify-center px-4 lg:px-8">
      <div className={`absolute left-0 top-0 h-[1px] w-full ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`} />
      
      <footer className="flex w-full max-w-[1244px] flex-col pb-3 pt-4 text-[#959595] xs:text-[14px] sm:text-[14px] md:pb-[8px] md:pt-[20px]">
        <div className="flex flex-col md:flex-row w-full">
          <div className="flex flex-col mb-6 md:mb-0 md:w-56">
            <Link href="/" className="cursor-pointer flex font-rogan text-[21px] text-[#030303] dark:text-white items-center transition-colors duration-100 ease-linear hover:text-gray-500 dark:hover:text-white mb-2">
              <img className="h-[20px] mr-[5px]" src="/assets/logo.png" alt="" />
              Torque
            </Link>
            <div className="flex flex-col mb-4">
              <span className="this-year">© {currentYear} Torque Inc.</span>
              <label className="relative inline-flex items-center cursor-pointer mt-4">
                <input type="checkbox" checked={isChecked} onChange={handleDarkMode} className="sr-only" />
                <div className="toggle-bg w-12 h-6 bg-gray-200 rounded-full p-1 transition duration-200 ease-in-out dark:bg-[#212121] peer-checked:bg-blue-600">
                  <span className={`block w-4 h-4 bg-white dark:bg-[#3a3a3a] rounded-full shadow transform transition duration-200 ease-in-out ${isChecked ? 'translate-x-6' : 'translate-x-0'}`}></span>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 flex-1">
            {/* Protocol Column */}
            <div className="flex flex-col">
              <h3 className="font-rogan text-[18px] text-[#030303] dark:text-white mb-2">Protocol</h3>
              <div className="mb-2">
                <Link href="/boost" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white">Boost</Link>
              </div>
              <div className="mb-2">
                <Link href="/borrow" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white">Borrow</Link>
              </div>
              <div className="mb-2">
                <Link href="/bridge" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white">Bridge</Link>
              </div>
              <div className="mb-2">
                <Link href="/import" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white">Import</Link>
              </div>
            </div>

            {/* Resources Column */}
            <div className="flex flex-col">
              <h3 className="font-rogan text-[18px] text-[#030303] dark:text-white mb-2">Resources</h3>
              <div className="mb-2">
                <Link href="https://docs.torque.fi" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white" target="_blank">Docs</Link>
              </div>
              <div className="mb-2">
                <Link href="https://youtube.com/@torquefi" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white" target="_blank">Tutorials</Link>
              </div>
              <div className="mb-2">
                <Link href="https://snapshot.box/#/s:torquefi.eth" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white" target="_blank">Snapshot</Link>
              </div>
              <div className="mb-2">
                <Link href="https://arbiscan.io/token/0xb56c29413af8778977093b9b4947efeea7136c36" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white" target="_blank">Explorer</Link>
              </div>
              <div className="mb-2">
                <Link href="https://docs.torque.fi/main/resources/security" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white" target="_blank">Audits</Link>
              </div>
            </div>

            {/* Community Column */}
            <div className="flex flex-col">
              <h3 className="font-rogan text-[18px] text-[#030303] dark:text-white mb-2">Community</h3>
              <div className="mb-2">
                <Link href="https://x.com/torquefi" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white" target="_blank">X (Twitter)</Link>
              </div>
              <div className="mb-2">
                <Link href="https://t.me/torquefi" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white" target="_blank">Telegram</Link>
              </div>
              <div className="mb-2">
                <Link href="https://discord.com/invite/DKnbnpnMZ5" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white">Discord</Link>
              </div>
              <div className="mb-2">
                <Link href="https://blog.torque.fi" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white" target="_blank">Blog</Link>
              </div>
            </div>

            {/* Policies Column */}
            <div className="flex flex-col">
              <h3 className="font-rogan text-[18px] text-[#030303] dark:text-white mb-2">Policies</h3>
              <div className="mb-2">
                <Link href="/terms" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white">Terms of Service</Link>
              </div>
              <div className="mb-2">
                <Link href="/privacy" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white">Privacy Policy</Link>
              </div>
              <div className="mb-2">
                <Link href="/cookies" className="inline-block text-[#959595] transition-colors duration-200 ease-linear hover:text-[#030303] dark:hover:text-white">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
