import Footer from './Footer'
import { Header } from './Header'
import { MenuMobile } from './MenuMobile'

interface MainLayoutProps {
  children: any
}

export const MainLayout = ({ children }: MainLayoutProps) => {
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
