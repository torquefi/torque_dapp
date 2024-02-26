import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
 
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // h2: ({ children }) => <h2 style={{ fontSize: '18px', color:"#FFFFFF"}}>{children}</h2>,
    h2: ({ children }) => <h2 className='text-black dark:text-white text-[18px] font-larken'>{children}</h2>,
    table:({children})=> <table style={{ border:"1px solid black", padding:"5px", textAlign:"center"}}>{children}</table>,
    tr:({children})=> <tr style={{ border:"1px solid black", padding:"5px" }}>{children}</tr>,
    td:({children})=> <td style={{ border:"1px solid black", padding:"5px" }}>{children}</td>,
    th:({children})=> <th style={{ border:"1px solid black", padding:"5px" }}>{children}</th>,
    p:({children})=> <p className='text-black dark:text-[#959595] text-[16px] leading-6'>{children}</p>,
    

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