import { BorrowPage } from '@/components/pages/Borrow'
import { MainLayout } from '@/layouts/MainLayout'

export default function Page() {
  return <BorrowPage />
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
