import { StakePage } from '@/components/pages/Stake'
import { VotePage } from '@/components/pages/Vote'
import { Distribution } from '@/components/pages/Vote/Distribution'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>Distribution | Torque</title>
      </Head>
      <Distribution />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
