import { StakePage } from '@/components/pages/Stake'
import { VotePage } from '@/components/pages/Vote'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>Vote | Torque</title>
      </Head>
      <VotePage />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
