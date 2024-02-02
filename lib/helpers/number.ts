import BigNumber from 'bignumber.js'

export function toMetricUnits(num: number, fixed: number = 2) {
  const units = ['', 'K', 'M', 'B', 'T', 'Q', 'E', 'Z', 'Y', 'R', 'Q']
  let count = 0
  num = +num
  if (Number.isNaN(num)) {
    return '0.00'
  }
  while (Math.abs(num) >= 1000) {
    num /= 1000
    count++
  }
  return num.toFixed(fixed) + units[count]
}

export const floorFraction = (number: number, fraction = 0) => {
  // return (
  //   Math.floor(+(number || 0) * Math.pow(10, fraction)) / Math.pow(10, fraction)
  // )

  return Number(
    new BigNumber(number)
      .multipliedBy(Math.pow(10, fraction))
      .dividedBy(Math.pow(10, fraction))
      .toString()
  )
}

export const convertNumber = (number: string | number) => {
  if (!number) {
    return '0'
  }
  let result = Number(number).toFixed(4)
  const hasFourZeros = /\.\d{4}$/.test(result)
  if (hasFourZeros) {
    result = Number(number).toFixed(2)
  }
  return result
}
