const shortenAddress = (address: string, count: number = 6) =>
  `${address.substr(0, count)}...${address.substr(2 - count)}`


export default shortenAddress
