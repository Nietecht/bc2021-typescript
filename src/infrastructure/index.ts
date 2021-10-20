export * from './jsx'

export type DeepReadonly<T> =
  T extends {}
  ? {
      readonly [K in keyof T]: DeepReadonly<T[K]>
    }
  : T extends Array<infer U>
    ? ReadonlyArray<U>
    : T