import { StakePage } from '@/components/pages/Stake'
import { MainLayout } from '@/layouts/MainLayout'

export default function Page() {
  return <StakePage />
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
