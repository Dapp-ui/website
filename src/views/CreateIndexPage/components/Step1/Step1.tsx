import React, { useMemo, useState, useCallback } from 'react'
import type { Row } from 'react-table'
import cx from 'classnames'

import { Button } from 'components/inputs'
import { Bone } from 'components/feedback'
import { Text, Table } from 'components/dataDisplay'
import type { TableColumns } from 'components/dataDisplay'

import { useContext } from '../../utils/context'
import type { ContextState } from '../../utils/context'

import s from './Step1.module.scss'


type RowData = ContextState['vaultsMap'][number]

type Step1Props = {
  onContinue: () => void
}

const Step1: React.FC<Step1Props> = ({ onContinue }) => {
  const [ { isVaultsFetching, vaultsMap, vaultAddresses, selectedVaultIds }, setContextState ] = useContext()
  const [ selectedIds, setSelectedIds ] = useState<string[]>(selectedVaultIds || [])

  const handleItemClick = (address: string) => {
    let newIds

    if (selectedIds.includes(address)) {
      newIds = selectedIds.filter((id) => id !== address)
    }
    else {
      newIds = [ ...selectedIds, address ]
    }

    setSelectedIds(newIds)
  }

  const handleContinue = () => {
    setContextState({ selectedVaultIds: selectedIds })
    onContinue()
  }

  const isFetching = isVaultsFetching
  let data = vaultsMap ? Object.values(vaultsMap) : null

  if (isFetching) {
    data = [ {}, {}, {} ] as any
  }

  const columns = useMemo(() => {
    const columns: TableColumns<RowData> = [
      {
        id: 'action',
        Header: '',
        accessor: () => {
          if (isFetching) {
            return <Bone w={68} h={16} />
          }

          return (
            <div className={s.checkbox} />
          )
        },
      },
      {
        id: 'protocol',
        Header: 'Protocol',
        accessor: ({ protocol }) => {
          if (isFetching) {
            return <Bone w={210} h={16} />
          }

          return (
            <>{protocol}</>
          )
        },
      },
      {
        id: 'token',
        Header: 'Token',
        accessor: ({ tokenName }) => {
          if (isFetching) {
            return <Bone w={210} h={16} />
          }

          return (
            <>{tokenName}</>
          )
        },
      },
      {
        id: 'apy',
        Header: 'APY',
        accessor: ({ apy }) => {
          if (isFetching) {
            return <Bone w={40} h={16} />
          }

          return apy ? <b className="color-brand-90">{apy}%</b> : 'N/A'
        },
      },
    ]

    return columns
  }, [ isFetching ])

  const getRowProps = useCallback((row: Row<RowData>) => {

    return {
      className: cx({
        [s.activeRow]: selectedIds.includes(row.original.address),
      }),
    }
  }, [ selectedIds ])

  const handleRowClick = (row) => {
    if (!isFetching) {
      handleItemClick(row.original.address)
    }
  }

  return (
    <>
      <Text className="mb-56" style="h3">
        1/3. Choose from vaults
      </Text>
      <Table
        className={s.table}
        columns={columns}
        data={data}
        getRowProps={getRowProps}
        onRowClick={handleRowClick}
      />
      {
        Boolean(selectedIds.length < 2 || selectedIds.length > 5) ? (
          <div className={s.errorContainer}>
            <div className={s.errorContent}>
              <div className={s.error}>
                {
                  selectedIds.length < 2 ? (
                    <>You should select at least 2 vaults.</>
                  ) : (
                    <>You can select maximum 5 vaults.</>
                  )
                }
              </div>
              <Button
                size={56}
                style="primary"
                disabled
              >
                Go to Next Step
              </Button>
            </div>
          </div>
        ) : (
          <div className={s.buttonContainer}>
            <Button
              size={56}
              style="primary"
              onClick={handleContinue}
            >
              Go to Next Step
            </Button>
          </div>
        )
      }
    </>
  )
}

export default Step1
