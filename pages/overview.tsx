import { OverviewPage } from '@/components/pages/Overview'
import { MainLayout } from '@/layouts/MainLayout'

export default function Page() {
  return <OverviewPage />
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
