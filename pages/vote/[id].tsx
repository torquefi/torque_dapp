import { StakePage } from '@/components/pages/Stake'
import { VotePage } from '@/components/pages/Vote'
import { DetailsVotes } from '@/components/pages/Vote/Details'
import { Distribution } from '@/components/pages/Vote/Distribution'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title> ID | Torque</title>
      </Head>
      <DetailsVotes />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
