import { BorrowPage } from '@/components/pages/Borrow'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>
          Borrow | Torque
        </title>
      </Head>
      <BorrowPage />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
