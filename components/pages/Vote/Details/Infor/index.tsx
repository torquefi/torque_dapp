import React from 'react'
import { For } from './For'
import { Against } from './Against'

export const InforVotes = (props: any) => {
  const { votesInfo } = props;

  return (
    <div className="mt-[32px]">
      <div className="justify-between md:flex">
        <For votesInfo={votesInfo} />
        <Against votesInfo={votesInfo} />
      </div>
    </div>
  )
}
