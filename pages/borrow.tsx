import AppSeo from '@/components/common/App-Seo'
import { BorrowPage } from '@/components/pages/Borrow'
import { MainLayout } from '@/layouts/MainLayout'

export default function Page() {
  return (
    <>
      <AppSeo title="Borrow | Torque" />
      <BorrowPage />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
