import { Leaderboard } from '@/components/pages/Vote/Leaderboard'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>Leaderboard | Torque</title>
      </Head>
      <Leaderboard />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
