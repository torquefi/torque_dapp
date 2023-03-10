interface ReactProps {
  className?: string
  key?: any
  children?: any
  style?: React.CSSProperties
}

interface Option {
  value: any
  label: string
  image?: string
  className?: string
  disabled?: boolean
  color?:
    | 'primary'
    | 'accent'
    | 'info'
    | 'success'
    | 'danger'
    | 'warning'
    | 'bluegray'
    | 'orange'
    | 'teal'
    | 'cyan'
    | 'purple'
    | 'pink'
    | (string & {})

  cols?: Cols
  data?: any
}

interface FormControlProps extends ReactProps {
  value?: any
  onChange?: (val: any, extraVal?: any) => void
  id?: string
  name?: string
  placeholder?: string
  readonly?: boolean
  error?: string
  defaultValue?: any
  controlClassName?: string
  noFocus?: boolean
}

type Cols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
