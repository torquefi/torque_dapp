import { VotePage } from '@/components/pages/Vote'
import { DetailsVotes } from '@/components/pages/Vote/Details'
import { Distribution } from '@/components/pages/Vote/Distribution'
import { MainLayout } from '@/layouts/MainLayout'
import { updateTipsData } from '@/lib/redux/slices/tips'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { tipsData } from '@/config/vote/content/tips'
import { GetServerSideProps } from 'next'
import AppSeo from '@/components/common/App-Seo'


export default function Page({ title }: { title?: string }) {
  const router = useRouter()
  const { id } = router?.query

  const dispatch = useDispatch()

  const getTipsData = async () => {
    // call API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      dispatch(updateTipsData(tipsData))
    } catch (error) {
    } finally {
    }
  }

  useEffect(() => {
    getTipsData()
  }, [])

  return (
    <>
      {/* <AppSeo title={`TIP-${id} | Torque`} /> */}

      <Head>
        <title> TIP-{id} | Torque</title>
      </Head>
      <DetailsVotes />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>

// export async function getServerSideProps(context: any) {
//   const id = context?.query?.id
//   const currentTip = tipsData.find((tip) => tip.id.toString() === id)
//   return {
//     props: {
//       title: currentTip?.title
//     }
//   }
// }
