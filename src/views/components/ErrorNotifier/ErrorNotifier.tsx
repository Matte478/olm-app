import { ApolloError } from '@apollo/client'
import { CAlert } from '@coreui/react'
import React from 'react'

interface Props {
  error?: ApolloError
}

const ErrorNotifier: React.FC<Props> = ({ error }: Props) => {
  if (!error) return <></>

  const formatError = () => {
    const { graphQLErrors, message } = error
    const msg = graphQLErrors[0].message
    const reason = graphQLErrors[0]?.extensions?.reason
    const validation = graphQLErrors[0]?.extensions?.validation

    let validationList = null
    if (Object.prototype.toString.call(validation) === '[object Object]') {
      validationList = (
        <ul className="mb-0">
          {Object.entries(validation).map((entry) => {
            const [key, value] = entry
            return <li key={key}>{value as string}</li>
          })}
        </ul>
      )
    }

    return validationList || reason || msg || message || ''
  }

  return (
    <CAlert color="danger" className="py-2">
      {formatError()}
    </CAlert>
  )
}

export default ErrorNotifier
