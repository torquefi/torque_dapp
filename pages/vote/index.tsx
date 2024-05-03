import { VotePage } from '@/components/pages/Vote'
import { MainLayout } from '@/layouts/MainLayout'
import { updateTipsData } from '@/lib/redux/slices/tips'
import Head from 'next/head'
import { useDispatch } from 'react-redux'
import { tipsData } from '@/config/vote/content/tips'
import { useEffect } from 'react'
import AppSeo from '@/components/common/App-Seo'
export default function Page() {
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
      <AppSeo title="Vote | Torque" />
      <VotePage />
    </>
  )
}

Page.getLayout = (page: any) => <MainLayout>{page}</MainLayout>
