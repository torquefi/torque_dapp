interface ChoosePercentProps extends ReactProps {
  total: any
  value: any
  onClickPercent: (value: number) => void
  className?: string
}

const ChoosePercent: React.FC<ChoosePercentProps> = ({
  total,
  value,
  onClickPercent,
  className = '',
}: ChoosePercentProps) => {
  return (
    <>
      <div className={`flex space-x-2 ${className}`}>
        {[25, 50, 75, 100].map((item, i) => (
          <div
            className={
              `w-[25%] cursor-pointer  rounded-lg p-[1px]` +
              ` ${
                ((total * item) / 100 == value && +value != 0) ||
                (+value == 0 && item === 100)
                  ? 'bg-gradient-primary'
                  : 'bg-[#525252]'
              }`
            }
          >
            <button
              onClick={() => onClickPercent((total * item) / 100)}
              className={
                `flex w-full  items-center  justify-center rounded-lg py-2 text-12 leading-none md:text-14` +
                ` ${
                  ((total * item) / 100 == value && +value != 0) ||
                  (+value == 0 && item === 100)
                    ? 'bg-black'
                    : 'bg-[#292A2D]'
                }`
              }
            >
              {item}%
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

export default ChoosePercent
