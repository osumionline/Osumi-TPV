export function setTwoNumberDecimal(ev: Event): void {
  const target = ev.target as HTMLInputElement;
  target.value =
    target.value != '' ? parseFloat(target.value.replace(',', '.')).toFixed(2) : '0.00';
}

type Primitive = string | number | boolean | null | undefined | Date;

export function shallowEqual<T extends object>(a: Readonly<T>, b: Readonly<T>): boolean {
  const aKeys = Object.keys(a) as (keyof T)[];
  const bKeys = Object.keys(b) as (keyof T)[];
  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const k of aKeys) {
    const av = a[k] as unknown as Primitive;
    const bv = b[k] as unknown as Primitive;

    const eq: boolean =
      av instanceof Date && bv instanceof Date ? av.getTime() === bv.getTime() : av === bv;

    if (!eq) {
      return false;
    }
  }
  return true;
}
