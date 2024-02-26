import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
 
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 style={{ fontSize: '100px' }}>{children}</h1>,
    table:({children})=> <table style={{ border:"1px solid black", padding:"5px", textAlign:"center"}}>{children}</table>,
    tr:({children})=> <tr style={{ border:"1px solid black", padding:"5px" }}>{children}</tr>,
    td:({children})=> <td style={{ border:"1px solid black", padding:"5px" }}>{children}</td>,
    th:({children})=> <th style={{ border:"1px solid black", padding:"5px" }}>{children}</th>,

    // img: (props) => (
    //   <Image
    //     sizes="100vw"
    //     style={{ width: '100%', height: 'auto' }}
    //     {...(props as ImageProps)}
    //   />
    // ),
    ...components,
  }
}