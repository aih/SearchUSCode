export function cloneDeep(value: any): any {
  return JSON.parse(JSON.stringify(value));
}


export function removeEmpty(value: { [x: string]: any; }): object {
  const obj = cloneDeep(value);
  Object.keys(obj).forEach((k) => obj[k] == null && delete obj[k]);
  return obj;
}
