declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

declare module '*.scss' {
  interface IClassNames {
    [className: string]: string
  }
  const scssClassNames: IClassNames

  export = scssClassNames
}


// -----------------------------------------------------------


interface Window {
  ethereum: any
}


// -----------------------------------------------------------

type UnPromisify<T> = T extends Promise<infer U> ? U : T

type AllOrNothing<T> = T | { [P in keyof T]?: never }

// type OneOrBothFromList = AtLeastOne<ExampleProps, 'to' | 'onClick'>
// type OneOrBothFromAll  = AtLeastOne<ExampleProps>
type AtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

// type OneOrOtherFromList = OnlyOne<ExampleProps, 'to' | 'onClick'>
// type OneOrOtherFromAll  = OnlyOne<ExampleProps>
type OnlyOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>
  }[Keys]

type Address = string
