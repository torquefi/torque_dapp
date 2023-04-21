import { useSelector } from 'react-redux'
import Footer from './Footer'
import { Header } from './Header'
import { MenuMobile } from './MenuMobile'
import { AppStore } from '@/types/store'

interface MainLayoutProps {
  children: any
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  if (theme)
    return (
      <div className="font-mona min-h-screen bg-[#FCFAFF] text-[#fff] dark:bg-[#030303]">
        <Header />
        <div className="container  mx-auto min-h-[calc(100vh-140px)] max-w-screen-xl p-4 lg:p-8">
          {children}
        </div>
        <Footer />
        <MenuMobile />
      </div>
    )
}
