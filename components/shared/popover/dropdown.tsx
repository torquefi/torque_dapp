import { Children, useEffect } from 'react'
import { Button, ButtonProps } from '../form/button'
import { Popover, PopoverProps } from './popover'
import { ImgProps, Img } from '../img'

export interface DropdownProps extends PopoverProps {}
export interface AvatarProps extends ImgProps {
  text?: string
}

export function Dropdown({
  reference,
  trigger = 'click',
  placement = 'bottom-end',
  animation = 'fade',
  arrow = false,
  ...props
}: DropdownProps) {
  //TODO: Khi có điều kiện {} thì bị lỗi child
  let menuItems: JSX.Element[] = Children.map(props.children, (child) =>
    child?.type?.displayName === 'Item' ||
    child?.type?.displayName === 'Divider' ||
    child?.type?.displayName === 'Avatar'
      ? child
      : null
  )
  let children = Children.map(props.children, (child) =>
    !child?.type?.displayName ? child : null
  )

  return (
    <Popover
      reference={reference}
      trigger={trigger}
      placement={placement}
      arrow={arrow}
      {...props}
    >
      {!!menuItems.length && (
        <div
          className="flex flex-col my-1.5"
          style={{ marginLeft: '-9px', marginRight: '-9px' }}
        >
          {menuItems.map((item, index) =>
            item.type.displayName === 'Item' ? (
              <Button
                key={index}
                className={`rounded-none flex justify-start hover:bg-gray-50  px-6 ${
                  item.props.disabled ? 'line-through' : ''
                }`}
                stopPropagation
                {...{
                  ...item.props,
                  onClick: async (e) => {
                    if (item.props.onClick) await item.props.onClick(e)
                    ;(reference.current as any)?._tippy.hide()
                  },
                }}
              />
            ) : item.type.displayName === 'Avatar' ? (
              <div key={index} className="flex-col flex items-center ">
                {/* {/* <div className="rounded-full p-4 "> */}
                <div className="rounded-full p-3 bg-primary  bg-opacity-5">
                  <Img
                    border
                    imageClassName="  p-3 bg-primary bg-opacity-20 "
                    {...{
                      ...item.props,
                      onClick: async (e: any) => {
                        if (item.props.onClick) await item.props.onClick(e)
                        ;(reference.current as any)?._tippy.hide()
                      },
                    }}
                  />
                </div>
                {/* </div>
                    </div> */}
                <p className="my-2 font-semibold">{item.props.text}</p>
              </div>
            ) : (
              <hr key={index} className="my-1 border-gray-100" />
            )
          )}
        </div>
      )}
      {children}
    </Popover>
  )
}

const Item = ({ children }: ButtonProps) => children
Item.displayName = 'Item'
Dropdown.Item = Item

const Divider = ({ children }: { children?: any }) => children
Divider.displayName = 'Divider'
Dropdown.Divider = Divider

const Avatar = ({ children }: AvatarProps) => children
Avatar.displayName = 'Avatar'
Dropdown.Avatar = Avatar
