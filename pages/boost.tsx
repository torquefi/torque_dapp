import { BoostPage } from '@/components/pages/Boost'
import { MainLayout } from '@/layouts/MainLayout'

export default function Page() {
  return <BoostPage />
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
