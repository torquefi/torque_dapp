import { BridgePage } from '@/components/pages/Bridge'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>Bridge | Torque</title>
      </Head>
      <BridgePage />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
