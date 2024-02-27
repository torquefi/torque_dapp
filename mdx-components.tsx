import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
 
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // h2: ({ children }) => <h2 style={{ fontSize: '18px', color:"#FFFFFF"}}>{children}</h2>,
    h2: ({ children }) => <h2 className='text-black dark:text-white text-[18px] font-larken mt-0'>{children}</h2>,
    // table:({children})=> <table style={{ border:"1px solid black", padding:"5px", textAlign:"center"}}>{children}</table>,
    table:({children})=> <table className='border-[1px] border-[#959595] text-center dark:text-[#959595]'>{children}</table>,
    // tr:({children})=> <tr style={{ border:"1px solid black", padding:"5px" }}>{children}</tr>,
    tr:({children})=> <tr className=' border-[#959595]' >{children}</tr>,

    td:({children})=> <td className='border-[#959595] border-[1px] '>{children}</td>,
    th:({children})=> <th className='dark:text-[#FFFFFF] text-black border-[1px] border-[#959595] '>{children}</th>,
    p:({children})=> <p className='text-[#959595] text-[16px] leading-6'>{children}</p>,
    h6:({children})=> <h6 className='text-[#959595] text-[16px] leading-6'>{children}</h6>,
    
    

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