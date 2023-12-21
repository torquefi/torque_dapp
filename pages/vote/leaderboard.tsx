import { LeaderBoard } from '@/components/pages/Vote/LeaderBoard'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>Leaderboard | Torque</title>
      </Head>
      <LeaderBoard />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
