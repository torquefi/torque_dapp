import { VotePage } from '@/components/pages/Vote'
import { MainLayout } from '@/layouts/MainLayout'
import Head from 'next/head'
import { tipsData } from '@/config/vote/content/tips'
import { InferGetServerSidePropsType } from 'next'

export async function getServerSideProps() {
  // Use the imported JSON data directly in getServerSideProps
  await new Promise((resolve)=>setTimeout(resolve,1000))
  return {
    props: {
      jsonData: tipsData,
    },
  }
}

export default function Page({
  jsonData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
