export function toHumanRead(num: number, fixed: number = 2) {
  const units = ['', 'K', 'M', 'B', 'T', 'Q']
  let count = 0
  num = +num
  if (Number.isNaN(num)) {
    return '0.00'
  }
  while (Math.abs(num) >= 1000) {
    num /= 1000
    count++
  }
  // for (let i = 0; i < fixed; i++) {
  //   if (num === +num.toFixed(i)) return num.toFixed(i) + units[count]
  // }
  return num.toFixed(fixed) + units[count]
}
