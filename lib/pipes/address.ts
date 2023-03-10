export function AddressPipe(item: any, prefix: string = "") {
  let getPropName = (prop: string) =>
    prefix ? `${prefix}${prop[0].toUpperCase() + prop.slice(1)}` : prop;
  return [
    item[getPropName("address")],
    item[getPropName("ward")],
    item[getPropName("district")],
    item[getPropName("province")],
  ]
    .filter(Boolean)
    .join(", ");
}
