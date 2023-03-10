import { useRef } from 'react'
import { FaEllipsisH } from 'react-icons/fa'
import { Button, ButtonProps } from '../form/button'
import { Dropdown } from '../popover/dropdown'

interface PropsType extends ReactProps {}
export function Card({ className = '', style = {}, ...props }: PropsType) {
  return (
    <div
      className={`bg-blueGray-100 rounded-xl shadow-xl ${className}`}
      style={{ ...style }}
    >
      {props.children}
    </div>
  )
}
type HeaderProps = ReactProps & {
  title: string
  subtitle?: string
  actions?: ButtonProps[]
  more?: ButtonProps[]
}
Card.Header = (props: HeaderProps) => {
  const moreRef = useRef()
  return (
    <div className="wrapper border-b border-gray-300 pb-2">
      <div className="">
        <div className="flex justify-between ">
          <div className="title inline-block">
            <h3 className="inline text-xl">{props.title}</h3>
            {props.subtitle && (
              <p className="text-xs text-gray-400">{props.subtitle}</p>
            )}
          </div>
          <div className="flex flex-row-reverse items-center space-x-4 space-x-reverse">
            {props.more && (
              <>
                <div className="w-6 text-primary cursor-pointer " ref={moreRef}>
                  <FaEllipsisH />
                </div>
                <Dropdown reference={moreRef}>
                  {props.more.map((btnProps, index) => (
                    <Dropdown.Item key={index} {...btnProps} />
                  ))}
                </Dropdown>
              </>
            )}
            {props.actions &&
              props.actions.map((btn, index) => (
                <Button key={index} {...btn} />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
