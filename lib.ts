export function capitalize(str: string) {
  return str.substr(0, 1).toLocaleUpperCase() + str.substr(1);
}

export namespace Foo {
  export type CarName = string
  
  export enum FooEnum {
    FooValue
  }
}