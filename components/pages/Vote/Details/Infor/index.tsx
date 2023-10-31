import React from 'react'
import { For } from './For'
import { Against } from './Against'

export const InforVotes = () => {
  return (
    <div className="mt-[41px]">
      <div className="justify-between md:flex">
        <For />
        <Against />
      </div>
    </div>
  )
}
