import React,{useState,useEffect} from 'react'
import ReactMarkDown from "react-markdown"
import MyMarkdown from "../test.mdx"
const TestPage = () => {
    return (
      <div className="post">
        <article className='prose lg:prose-xl'>
            <MyMarkdown/>
        </article>
        
      </div>
    )
}

export default TestPage