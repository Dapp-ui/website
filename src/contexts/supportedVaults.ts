const stables = [
  { protocol: 'Stablecoins', address: '0x049d68029688eabf473097a2fc38ef61633a3c7a' },
  { protocol: 'Stablecoins', address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75' },
  { protocol: 'Stablecoins', address: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E' },
  { protocol: 'Stablecoins', address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83' },
]

const aave = [
  { protocol: 'Aave', address: '0x6ab707Aca953eDAeFBc4fD23bA73294241490620', apy: 11.51 },
  { protocol: 'Aave', address: '0x625E7708f30cA75bfd92586e17077590C60eb4cD', apy: 2.41 },
  { protocol: 'Aave', address: '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE', apy: 2.89 },
]

const yearn = [
  { protocol: 'Yearn', address: '0x148c05caf1Bb09B5670f00D511718f733C54bC4c' },
  { protocol: 'Yearn', address: '0xEF0210eB96c7EB36AF8ed1c20306462764935607' },
  { protocol: 'Yearn', address: '0x637eC617c86D24E421328e6CAEa1d92114892439' },
]

type Vault = {
  protocol: string
  address: string
  apy: number
}

const supportedVaults = [
  ...stables,
  ...aave,
  ...yearn,
] as Vault[]

export default supportedVaults
