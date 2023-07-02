import { HomePage } from '@/components/pages/Home'
import { MainLayout } from '@/layouts/MainLayout'

export default function Page() {
  return <HomePage />
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
