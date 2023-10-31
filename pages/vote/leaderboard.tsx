import { StakePage } from '@/components/pages/Stake'
import { VotePage } from '@/components/pages/Vote'
import { Distribution } from '@/components/pages/Vote/Distribution'
import { LeaderBoard } from '@/components/pages/Vote/LeaderBoard'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>leaderboard | Torque</title>
      </Head>
      <LeaderBoard />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
