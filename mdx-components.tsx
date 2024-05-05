import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'


export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // h2: ({ children }) => <h2 style={{ fontSize: '18px', color:"#FFFFFF"}}>{children}</h2>,
    h2: ({ children }) => <h2 className='text-black dark:text-white text-[18px] font-rogan mt-0 mb-[10px]'>{children}</h2>,
    // table:({children})=> <table style={{ border:"1px solid black", padding:"5px", textAlign:"center"}}>{children}</table>,
    table: ({ children }) =>
      <div className='w-full overflow-auto'>
        <table className='border-[1px] border-[#959595] dark:border-[#1a1a1a] text-center dark:text-[#959595] mt-[0px]'>
          {children}
        </table>
      </div>,
    // tr:({children})=> <tr style={{ border:"1px solid black", padding:"5px" }}>{children}</tr>,
    tr: ({ children }) => <tr className=' border-[#959595] dark:border-[#1a1a1a]' >{children}</tr>,

    td: ({ children }) => <td className='border-[#959595] border-[1px] dark:border-[#1a1a1a]'>{children}</td>,
    th: ({ children }) => <th className='dark:text-[#FFFFFF] text-black border-[1px] border-[#959595] dark:border-[#1a1a1a] whitespace-nowrap'>{children}</th>,
    p: ({ children }) => <p className='text-[#959595] text-[16px] leading-6 mt-0 break-words'>{children}</p>,
    li: ({ children }) => <li className='text-[#959595] text-[16px] leading-6 mt-0'>{children}</li>,
    a: ({ children }) => <a className='text-black dark:text-white text-[16px] leading-6 mt-0 cursor-pointer break-words'>{children}</a>,

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