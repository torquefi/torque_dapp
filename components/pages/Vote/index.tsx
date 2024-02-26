import React from 'react'
import { Governance } from './Governance'
import { Distribution } from './Distribution'
import { LeaderBoard } from './LeaderBoard'
import { DetailsVotes } from './Details'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import {tipsData} from "@/config/vote/content/tips"


export async function getServerSideProps() {
  console.log(tipsData)
  // Use the imported JSON data directly in getServerSideProps
  return {
    props: {
      jsonData: tipsData
    }
  };
}

export const VotePage = ({jsonData}:any) => {
  console.log(jsonData)
  return (
    <div className="mt-2">
      <Governance />
      {/* <Distribution /> */}
      {/* <LeaderBoard /> */}
      {/* <DetailsVotes /> */}
    </div>
  )
}

