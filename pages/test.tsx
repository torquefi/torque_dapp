import React,{useState,useEffect} from 'react'
import ReactMarkDown from "react-markdown"
import MyMarkdown from "../test.mdx"
const TestPage = () => {
    return (
      <div className="post">
        <MyMarkdown/>
      </div>
    )
}

export default TestPage