import useSWR from 'swr'
import type { SWRResponse } from 'swr'


type UseQueryProps<Payload> = {
  endpoint: string | any[]
  mockData?: any
  variables?: object
  skip?: boolean
  fetcher?: (endpoint: string, ...args: any) => Promise<Payload>
}

type UseQueryResult<Payload> = {
  isFetching: boolean
  data: Payload
  error: any
  mutate: SWRResponse<Payload, any>['mutate']
}

const useQuery = <Payload, Variables = {}>(props: UseQueryProps<Payload>): UseQueryResult<Payload> => {
  let { endpoint, fetcher, skip } = props

  endpoint = skip ? null : endpoint

  const result = useSWR(endpoint, fetcher)

  const { isValidating, data, error, mutate } = result

  if (error) {
    console.error(error)
    console.log(`The error above comes from useQuery({ endpoint: '${endpoint}' })`)
  }

  return {
    isFetching: !skip && (!endpoint || isValidating),
    data,
    error,
    mutate,
  }
}

export { useSWRConfig } from 'swr'

export default useQuery
