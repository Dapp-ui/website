const formatStringNumber = (value: string, digits: number = 10) => {
  if (!/\./.test(value)) {
    return value
  }

  const [ num, digs ] = value.split('.')

  return `${num}.${digs.substr(0, digits)}`
}

export default formatStringNumber
