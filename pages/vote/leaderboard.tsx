import AppSeo from '@/components/common/App-Seo'
import { LeaderBoard } from '@/components/pages/Vote/LeaderBoard'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <AppSeo title="Leaderboard | Torque" />
      <LeaderBoard />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
