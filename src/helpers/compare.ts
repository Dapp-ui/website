import { parseFixed } from '@ethersproject/bignumber'


type Operator = '<=' | '<' | '=' | '>' | '>='

const methods: Record<Operator, string> = {
  '<=': 'lte',
  '<': 'lt',
  '=': 'eq',
  '>': 'gt',
  '>=': 'gte',
}

const compare = (a: string | number, operator: Operator, b: string | number) => {
  // ATTN unlike a native values comparing "compare" method returns false for "1 > undefined"
  //  we decided to do this because when you compare 2 numberish values you'd like to compare numbers not some other
  //  types values. To not break logic in code keep in mind this and add additional checks for nullish values.
  //  E.g. you'd like to check "const isInsufficientBalance = compare(amount, '>', availableToBorrow)"
  //  add additional checks if amount or availableToBorrow has nullish value then disabled submit button.
  if (isNaN(parseFloat(String(a))) || isNaN(parseFloat(String(b)))) {
    return false
  }

  const aBN = parseFixed(String(a), 50)
  const bBN = parseFixed(String(b), 50)
  const method = methods[operator]

  return aBN[method](bBN) as boolean
}


export default compare
