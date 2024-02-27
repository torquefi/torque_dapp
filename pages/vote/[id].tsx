import { VotePage } from '@/components/pages/Vote'
import { DetailsVotes } from '@/components/pages/Vote/Details'
import { Distribution } from '@/components/pages/Vote/Distribution'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()
  const {id} = router?.query
  return (
    <>
      <Head>
        <title> TIP-{id} | Torque</title>
      </Head>
      <DetailsVotes />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
